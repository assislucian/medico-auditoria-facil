
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
    // Get current user session to include auth token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Authentication required for file uploads:', sessionError);
      throw new Error('Authentication required for file uploads');
    }

    // Check if bucket exists, create if not
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const uploadsBucketExists = buckets?.some(b => b.name === 'uploads');
      
      if (!uploadsBucketExists) {
        console.log('Creating uploads bucket');
        await supabase.storage.createBucket('uploads', { public: false });
      }
    } catch (bucketError) {
      console.error('Error checking or creating storage bucket:', bucketError);
      // Continue without failing as the upload might still work
    }

    // Upload each file with auth token in headers
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        try {
          const filePath = `${session.user.id}/${Date.now()}-${file.name}`;
          
          const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filePath, file.file, {
              cacheControl: '3600',
              upsert: true,
            });
          
          if (error) {
            console.error('Error uploading file:', error);
            throw error;
          }
          
          // Register upload in database
          const { data: uploadData, error: dbError } = await supabase
            .from('uploads')
            .insert({
              user_id: session.user.id,
              file_name: file.name,
              file_type: file.type,
              file_path: data.path,
              status: 'processando'
            })
            .select('id')
            .single();
            
          if (dbError) {
            console.error('Error registering upload in database:', dbError);
            throw dbError;
          }
          
          return {
            id: uploadData.id,
            name: file.name,
            type: file.type
          };
        } catch (uploadError) {
          console.error('Error in file upload:', uploadError);
          return {
            id: `error-${Date.now()}`,
            name: file.name,
            error: uploadError.message || 'Upload failed'
          };
        }
      })
    );
    
    return uploadResults.filter(result => !('error' in result));
  } catch (error) {
    console.error('Error in uploadFilesToStorage:', error);
    throw error;
  }
}

/**
 * Set current analysis data (ID and extracted data)
 */
export function setCurrentAnalysis(extractedData: any, analysisId: string) {
  // Store the current analysis data in localStorage or state management
  console.log('Setting current analysis:', analysisId);
  
  localStorage.setItem('currentAnalysisId', analysisId);
  localStorage.setItem('currentAnalysisTimestamp', Date.now().toString());
  
  // Store extracted data for local fallback
  if (analysisId.startsWith('local-')) {
    localStorage.setItem(`extractedData-${analysisId}`, JSON.stringify(extractedData));
  }
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
    
    // Simulate UI processing stages
    await simulateProcessingStages(processMode, setProgress, setProcessingStage, setProcessingMsg);

    try {
      // Get current user session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required for processing files');
      }

      // Upload files with authentication
      setProgress(25);
      setProcessingStage('uploading');
      setProcessingMsg('Fazendo upload dos arquivos...');
      
      const uploadedFiles = await uploadFilesToStorage(files.filter(f => f.status === 'valid'));
      console.log('Files uploaded:', uploadedFiles);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error('No files were successfully uploaded');
      }

      // IDs dos uploads válidos
      const uploadIds = uploadedFiles.map(f => f.id);

      setProgress(50);
      setProcessingStage('processing');
      setProcessingMsg('Processando arquivos...');

      // Call the edge function with auth token
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

      // Store analysis data
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
      
      // Generate fallback data for local processing when backend fails
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
