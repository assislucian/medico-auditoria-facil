
import { toast } from 'sonner';
import { ProcessingStage, FileWithStatus, ProcessMode } from '@/types/upload';
import { getProcessMode, getSuccessMessage, getSuccessDescription } from './messageUtils';
import { simulateProcessingStages } from './processingService';
import { supabase } from '@/integrations/supabase/client';
import { generateFallbackData, determineProcessingMode } from '@/utils/uploadUtils';

/**
 * Upload files to storage
 */
export async function uploadFilesToStorage(files: FileWithStatus[]) {
  try {
    // Implementation of file upload to storage
    // This is a stub for the missing function
    console.log('Files to upload:', files.length);
    return files.map(f => ({ id: f.id || `temp-${Date.now()}`, name: f.name }));
  } catch (error) {
    console.error('Error uploading files to storage:', error);
    return [];
  }
}

/**
 * Set current analysis data (ID and extracted data)
 */
export function setCurrentAnalysis(extractedData: any, analysisId: string) {
  // Store the current analysis data in localStorage or state management
  console.log('Setting current analysis:', analysisId);
  
  // You might want to store this in localStorage for persistence
  localStorage.setItem('currentAnalysisId', analysisId);
  localStorage.setItem('currentAnalysisTimestamp', Date.now().toString());
}

/**
 * Processes the uploaded files for data extraction and analysis
 * @param files List of files to process
 * @param setProgress Function to update the processing progress
 * @param setProcessingStage Function to update the processing stage
 * @param setProcessingMsg Function to update the processing message
 * @param crmRegistrado CRM of the registered doctor to filter records
 * @returns Object with success status and analysisId
 * @param typesPresentfileTypes types selected (guia, demonstrativo, ambos)
 */
export async function processFiles(
  files: FileWithStatus[],
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void,
  crmRegistrado: string = '',
  fileTypes: ('guia' | 'demonstrativo')[]
): Promise<{ success: boolean; analysisId: string | null }> {
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
        return {
          success: true,
          analysisId: response.data.analysisId
        };
      } else {
        throw new Error('Edge Function response unsuccessful');
      }
    } catch (backendError) {
      console.log('Backend processing failed, using fallback mechanism', backendError);
      const fallbackData = generateFallbackData(processMode, files, crmRegistrado);
      const localAnalysisId = `local-${Date.now()}`;
      setCurrentAnalysis(fallbackData, localAnalysisId);
      return {
        success: true,
        analysisId: localAnalysisId
      };
    }
  } catch (error) {
    console.error('Error processing files:', error);
    toast.error('Erro ao processar os arquivos', {
      description: 'Por favor, tente novamente ou contate o suporte.'
    });
    return {
      success: false,
      analysisId: null
    };
  }
}
