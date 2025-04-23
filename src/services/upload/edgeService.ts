
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FileType, FileWithStatus, ProcessingStage } from '@/types/upload';
import { simulateProcessingStages } from '../processingService';
import { uploadFilesToStorage } from './storageService';
import { setCurrentAnalysis } from './analysisService';
import { generateFallbackData } from '@/utils/uploadUtils';
import { determineProcessingMode } from '@/utils/uploadUtils';

/**
 * Processes the uploaded files using edge functions
 */
export async function processFiles(
  files: FileWithStatus[],
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void,
  crmRegistrado: string = '',
  fileTypes: FileType[]
): Promise<{ success: boolean; analysisId: string | null }> {
  try {
    const processMode = determineProcessingMode(files);
    console.log(`Processing files in mode: ${processMode}`);
    
    await simulateProcessingStages(processMode, setProgress, setProcessingStage, setProcessingMsg);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required for processing files');
      }

      setProgress(25);
      setProcessingStage('uploading');
      setProcessingMsg('Fazendo upload dos arquivos...');
      
      const uploadedFiles = await uploadFilesToStorage(files.filter(f => f.status === 'valid'));
      console.log('Files uploaded:', uploadedFiles);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error('No files were successfully uploaded');
      }

      const uploadIds = uploadedFiles.map(f => f.id);

      setProgress(50);
      setProcessingStage('analyzing');
      setProcessingMsg('Processando arquivos...');

      const { data: processingData, error: processingError } = await supabase.functions.invoke('process-analysis', {
        body: {
          uploadIds,
          fileTypes,
          crmRegistrado,
        }
      });

      if (processingError || !processingData?.success) {
        console.error('Edge function error:', processingError || 'Unknown processing error');
        throw new Error(processingError?.message || 'Error processing files');
      }

      setProgress(100);
      setProcessingStage('complete');
      setProcessingMsg('Processamento concluído!');

      setCurrentAnalysis(processingData.extractedData, processingData.analysisId);
      
      toast.success('Processamento concluído', {
        description: `Foram processados ${processingData.proceduresCount || 0} procedimentos.`
      });
      
      return {
        success: true,
        analysisId: processingData.analysisId
      };
    } catch (backendError) {
      console.log('Backend processing failed, using fallback mechanism', backendError);
      
      const fallbackData = generateFallbackData(processMode, files, crmRegistrado);
      const localAnalysisId = `local-${Date.now()}`;
      
      setCurrentAnalysis(fallbackData, localAnalysisId);
      
      toast.warning('Processando localmente', {
        description: 'Não foi possível conectar ao servidor, usando processamento local.'
      });
      
      return {
        success: true,
        analysisId: localAnalysisId
      };
    }
  } catch (error) {
    console.error('Error processing files:', error);
    
    setProgress(0);
    setProcessingStage('error');
    setProcessingMsg('Erro ao processar os arquivos');
    
    toast.error('Erro ao processar os arquivos', {
      description: 'Por favor, tente novamente ou contate o suporte.'
    });
    
    return {
      success: false,
      analysisId: null
    };
  }
}
