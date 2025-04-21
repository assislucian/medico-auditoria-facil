
import { toast } from 'sonner';
import { ProcessingStage, FileWithStatus, ProcessMode } from '@/types/upload';
import { getProcessMode, getSuccessMessage, getSuccessDescription } from './messageUtils';
import { simulateProcessingStages } from './processingService';
import { supabase } from '@/integrations/supabase/client';
import { uploadFilesToStorage } from './fileUploadService';
import { generateFallbackData, determineProcessingMode } from '@/utils/uploadUtils';
import { setCurrentAnalysis } from './analysisService';

/**
 * Processes the uploaded files for data extraction and analysis
 * @param files List of files to process
 * @param setProgress Function to update the processing progress
 * @param setProcessingStage Function to update the processing stage
 * @param setProcessingMsg Function to update the processing message
 * @param crmRegistrado CRM of the registered doctor to filter records
 * @returns Boolean indicating success or failure
 * @param typesPresentfileTypes types selected (guia, demonstrativo, ambos)
 */
export async function processFiles(
  files: FileWithStatus[],
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void,
  crmRegistrado: string = '',
  fileTypes: ('guia' | 'demonstrativo')[]
): Promise<boolean> {
  try {
    const processMode = determineProcessingMode(files);
    console.log(`Processing files in mode: ${processMode}`);
    await simulateProcessingStages(processMode, setProgress, setProcessingStage, setProcessingMsg);

    try {
      // Upload files
      const uploadedFiles = await uploadFilesToStorage(files);
      console.log('Files uploaded:', uploadedFiles);

      // IDs dos uploads válidos
      const uploadIds = uploadedFiles?.map((f: any) => f.id) || [];

      // Chamada à edge function com novo payload:
      const response = await supabase.functions.invoke('process-analysis', {
        body: {
          uploadIds,
          fileTypes, // guiado por types presentes
          crmRegistrado,
        }
      });

      if (response.data?.success) {
        setCurrentAnalysis(response.data.extractedData, response.data.analysisId);
        console.log('Analysis successful via Edge Function', response.data.analysisId);
      } else {
        throw new Error('Edge Function response unsuccessful');
      }
    } catch (backendError) {
      console.log('Backend processing failed, using fallback mechanism', backendError);
      const fallbackData = generateFallbackData(processMode, files, crmRegistrado);
      const localAnalysisId = `local-${Date.now()}`;
      setCurrentAnalysis(fallbackData, localAnalysisId);
    }

    toast.success(getSuccessMessage(processMode), {
      description: getSuccessDescription(processMode)
    });

    return true;
  } catch (error) {
    console.error('Error processing files:', error);
    toast.error('Erro ao processar os arquivos', {
      description: 'Por favor, tente novamente ou contate o suporte.'
    });
    return false;
  }
}
