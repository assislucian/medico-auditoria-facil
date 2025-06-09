
import { FileWithStatus, FileType } from "@/types/upload";
import { determineProcessingMode } from "./uploadModeUtils";
import { processWithEdgeFunction } from "./fileUploadEdge";
import { createSimulatedResults } from "./simulatedUploadService";

/**
 * Service for processing uploaded files
 */
export const FileUploadService = () => {

  /**
   * Process uploaded files
   * Tries Edge Function first, then falls back to simulated results
   */
  const processUploadedFiles = async (
    files: FileWithStatus[],
    setProgress?: (progress: number) => void,
    setStage?: (stage: string) => void,
    setMsg?: (msg: string) => void,
    crmRegistrado?: string,
    fileTypes?: FileType[]
  ) => {
    const mode = determineProcessingMode(files);
    console.info('Processing files in mode:', mode);
    
    try {
      // Try to use the Edge Function first
      console.info('Attempting to upload files via Edge Function');
      
      const result = await processWithEdgeFunction(
        files, 
        setProgress, 
        setStage, 
        setMsg,
        crmRegistrado,
        fileTypes
      );
      
      return result;
    } catch (error) {
      console.info('Backend processing failed, using fallback mechanism', error);
      
      // Fallback to simulated results
      return await createSimulatedResults(
        files, 
        setProgress, 
        setStage, 
        setMsg,
        crmRegistrado,
        fileTypes
      );
    }
  };
  
  return {
    determineProcessingMode,
    processUploadedFiles
  };
};
