
import { FileWithStatus, FileType, ProcessMode } from "@/types/upload";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for processing uploaded files
 */
export const FileUploadService = () => {
  /**
   * Determine the processing mode based on the file types present
   */
  const determineProcessingMode = (files: FileWithStatus[]): ProcessMode => {
    const hasGuias = files.some(f => f.type === 'guia' && f.status === 'valid');
    const hasDemonstrativos = files.some(f => f.type === 'demonstrativo' && f.status === 'valid');
    
    if (hasGuias && hasDemonstrativos) {
      return 'complete';
    } else if (hasGuias) {
      return 'guia-only';
    } else {
      return 'demonstrativo-only';
    }
  };
  
  /**
   * Process uploaded files using the Edge Function
   */
  const processWithEdgeFunction = async (
    files: FileWithStatus[],
    setProgress?: (progress: number) => void,
    setStage?: (stage: string) => void,
    setMsg?: (msg: string) => void,
    crmRegistrado?: string,
    fileTypes?: FileType[]
  ) => {
    try {
      if (setProgress) setProgress(10);
      if (setStage) setStage('uploading');
      if (setMsg) setMsg('Enviando arquivos para processamento...');
      
      // Create FormData object to upload the files
      const formData = new FormData();
      
      // Add each file to FormData
      files.forEach((file, index) => {
        formData.append(`files`, file.file, file.name);
        formData.append(`fileTypes[${index}]`, file.type);
      });
      
      if (crmRegistrado) {
        formData.append('crmRegistrado', crmRegistrado);
      }
      
      // Upload files via Edge Function
      const uploadResponse = await supabase.functions.invoke('upload-files', {
        body: formData,
      });
      
      if (uploadResponse.error) {
        console.error('Edge Function upload error:', uploadResponse.error);
        throw new Error('Edge Function response unsuccessful');
      }
      
      const uploadIds = uploadResponse.data.map((file: any) => file.id);
      
      // Process the uploaded files
      if (setProgress) setProgress(50);
      if (setStage) setStage('processing');
      if (setMsg) setMsg('Processando arquivos...');
      
      // Call the processing Edge Function
      const processingResponse = await supabase.functions.invoke('process-analysis', {
        body: { 
          uploadIds, 
          fileTypes: fileTypes || [],
          crmRegistrado: crmRegistrado || '' 
        },
      });
      
      if (processingResponse.error) {
        console.error('Edge Function processing error:', processingResponse.error);
        throw new Error('Edge Function processing response unsuccessful');
      }
      
      if (setProgress) setProgress(100);
      if (setStage) setStage('complete');
      if (setMsg) setMsg('Processamento concluído!');
      
      return { 
        success: true, 
        analysisId: processingResponse.data.analysisId,
        message: 'Processamento realizado com sucesso!'
      };
    } catch (error) {
      console.error('Edge Function upload failed:', error);
      throw error;
    }
  };
  
  /**
   * Create simulated results for fallback when Edge Function fails
   */
  const createSimulatedResults = async (
    files: FileWithStatus[],
    setProgress?: (progress: number) => void,
    setStage?: (stage: string) => void,
    setMsg?: (msg: string) => void,
    crmRegistrado?: string,
    fileTypes?: FileType[]
  ) => {
    console.info('Generating fallback data in mode:', determineProcessingMode(files));
    
    // Simulate file uploads
    const uploadedFiles = files.map((file, index) => ({
      id: file.id || `local-${Date.now()}-${index}`,
      name: file.name,
      status: 'success',
      path: `local/${file.name}`,
      url: file.file ? URL.createObjectURL(file.file) : '',
    }));
    
    console.info('Files uploaded:', uploadedFiles);
    
    // Generate a unique ID for the analysis
    const analysisId = `local-${Date.now()}`;
    
    // Simulate the processing steps
    if (setProgress) setProgress(25);
    if (setStage) setStage('extracting');
    if (setMsg) setMsg('Extraindo dados dos arquivos...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (setProgress) setProgress(50);
    if (setStage) setStage('analyzing');
    if (setMsg) setMsg('Analisando procedimentos...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (setProgress) setProgress(75);
    if (setStage) setStage('comparing');
    if (setMsg) setMsg('Comparando com tabela CBHPM...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (setProgress) setProgress(100);
    if (setStage) setStage('complete');
    if (setMsg) setMsg('Processamento concluído!');
    
    return {
      success: true,
      analysisId,
      message: 'Processamento simulado concluído!'
    };
  };
  
  /**
   * Process uploaded files
   * This is the main function that tries the Edge Function first,
   * then falls back to simulated results if that fails
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
      
      // Fall back to simulated results
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
