
import { useAuth } from '@/contexts/AuthContext';
import { useFileList } from './upload/useFileList';
import { useProcessingStatus } from './upload/useProcessingStatus';
import { useFileUploadService } from './upload/useFileUploadService';
import { FileWithStatus } from '@/types/upload';

/**
 * Custom hook for handling file uploads
 * Combines multiple smaller hooks to provide full upload functionality
 */
export function useFileUpload() {
  const { user } = useAuth();
  
  // Use smaller, focused hooks
  const fileList = useFileList();
  const processingStatus = useProcessingStatus();
  const fileUploadService = useFileUploadService();
  
  /**
   * Process the uploaded files
   * @param crmRegistrado CRM to filter by (optional)
   */
  const processUploadedFiles = async (crmRegistrado: string = '') => {
    processingStatus.setUploading(true);
    processingStatus.setShowComparison(false);
    
    // Save CRM if provided
    if (crmRegistrado) {
      processingStatus.setCrmRegistrado(crmRegistrado);
    }
    
    // Process the files
    const result = await fileUploadService.processUploadedFiles(
      fileList.files,
      processingStatus.setProgress,
      processingStatus.setProcessingStage,
      processingStatus.setProcessingMsg,
      crmRegistrado || processingStatus.crmRegistrado
    );
    
    processingStatus.setUploading(false);
    processingStatus.setUploadSuccess(result);
    
    if (result) {
      processingStatus.setShowComparison(true);
    }
    
    return result;
  };
  
  /**
   * Reset files and status
   */
  const resetFiles = () => {
    fileList.clearFiles();
    processingStatus.resetStatus();
  };
  
  // Combine all the exports from other hooks plus this hook's functions
  return {
    // From fileList
    ...fileList,
    
    // From processingStatus
    ...processingStatus,
    
    // From fileUploadService
    determineProcessingMode: () => fileUploadService.determineProcessingMode(fileList.files),
    
    // This hook's functions
    processUploadedFiles,
    resetFiles
  };
}
