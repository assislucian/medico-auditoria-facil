
import { useState } from 'react';
import { FileWithStatus, FileType, ProcessingStage, ProcessMode } from '@/types/upload';
import { validateFiles } from '@/utils/fileValidation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { processFiles } from '@/services/uploadService';
import { determineProcessingMode } from '@/utils/uploadUtils';

/**
 * Custom hook for handling file uploads
 */
export function useFileUpload() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [processingMsg, setProcessingMsg] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [processingMode, setProcessingMode] = useState<ProcessMode>('complete');
  const [crmRegistrado, setCrmRegistrado] = useState('');
  const { user } = useAuth();
  
  /**
   * Check if we have files of a specific type
   */
  const hasFile = (type: FileType): boolean => {
    return files.some(file => file.type === type && file.status !== 'invalid');
  };
  
  /**
   * Check if we have both guia and demonstrativo files
   */
  const hasGuiaDemonstrativoPair = (): boolean => {
    return hasFile('guia') && hasFile('demonstrativo');
  };
  
  /**
   * Check if we have any valid files for processing
   */
  const hasValidFilesForProcessing = (): boolean => {
    return files.some(file => file.status !== 'invalid');
  };
  
  /**
   * Check if we have any invalid files
   */
  const hasInvalidFiles = (): boolean => {
    return files.some(file => file.status === 'invalid');
  };
  
  /**
   * Handle file selection from input
   * @param event File input change event
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    return handleFileSelect(event);
  };
  
  /**
   * Handle file selection from input
   * @param event File input change event
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const newFiles = Array.from(event.target.files).map(file => ({
      name: file.name,
      file,
      type: detectFileType(file.name),
      status: 'processing' as const,
    }));
    
    // Validate the files
    const validatedFiles = await validateFiles(newFiles);
    
    setFiles(prev => [...prev, ...validatedFiles]);
  };
  
  /**
   * Remove a file from the list
   * @param index Index of the file to remove
   */
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  /**
   * Clear all files from the list
   */
  const clearFiles = () => {
    setFiles([]);
    setProgress(0);
    setProcessingStage('idle');
    setProcessingMsg('');
    setUploadSuccess(false);
  };
  
  /**
   * Reset files - alias for clearFiles to match UploadSection
   */
  const resetFiles = () => {
    clearFiles();
  };
  
  /**
   * Process the uploaded files
   * @param crmRegistrado CRM to filter by (optional)
   */
  const processUploadedFiles = async (crmRegistrado: string = '') => {
    if (files.length === 0) {
      toast.error('Nenhum arquivo selecionado', {
        description: 'Por favor, selecione arquivos para processar.'
      });
      return false;
    }
    
    if (!files.some(file => file.status === 'valid')) {
      toast.error('Arquivos inválidos', {
        description: 'Todos os arquivos selecionados são inválidos. Por favor, selecione arquivos válidos.'
      });
      return false;
    }
    
    try {
      setIsUploading(true);
      setProgress(0);
      setProcessingStage('uploading');
      setProcessingMsg('Enviando arquivos...');
      
      // Determine the processing mode
      const mode = determineProcessingMode(files);
      setProcessingMode(mode);
      
      // Process the files
      const result = await processFiles(
        files.filter(f => f.status === 'valid'), 
        setProgress, 
        setProcessingStage, 
        setProcessingMsg, 
        crmRegistrado
      );
      
      setIsUploading(false);
      setUploadSuccess(result);
      
      if (result) {
        setShowComparison(true);
      }
      
      return result;
    } catch (error) {
      console.error('Error processing files:', error);
      setIsUploading(false);
      setProcessingStage('error');
      setProcessingMsg('Erro ao processar os arquivos');
      
      toast.error('Erro ao processar os arquivos', {
        description: 'Por favor, tente novamente ou contate o suporte.'
      });
      
      return false;
    }
  };
  
  /**
   * Determine the type of file based on its name
   * @param fileName Name of the file
   * @returns Type of the file
   */
  const detectFileType = (fileName: string): FileType => {
    const lowercaseName = fileName.toLowerCase();
    
    // Check for demonstrativo file
    if (
      lowercaseName.includes('demonstrativo') || 
      lowercaseName.includes('pagamento') || 
      lowercaseName.includes('recebiveis')
    ) {
      return 'demonstrativo';
    }
    
    // Default to guia
    return 'guia';
  };
  
  return {
    files,
    selectedFiles: files, // Alias for selectedFiles to match UploadSection
    isUploading,
    uploading: isUploading, // Alias for uploading to match UploadSection
    progress,
    processingStage,
    processingMsg,
    processingMode,
    uploadSuccess,
    showComparison,
    crmRegistrado,
    // Return setter functions
    setUploading: setIsUploading,
    setProgress,
    setProcessingStage,
    setProcessingMsg,
    setProcessingMode,
    setShowComparison,
    setCrmRegistrado,
    // Return helper methods
    hasFile,
    hasGuiaDemonstrativoPair,
    hasValidFilesForProcessing,
    hasInvalidFiles,
    // Return action methods
    handleFileSelect,
    handleFileChange,
    removeFile,
    clearFiles,
    resetFiles,
    processUploadedFiles,
    determineProcessingMode: () => determineProcessingMode(files)
  };
}
