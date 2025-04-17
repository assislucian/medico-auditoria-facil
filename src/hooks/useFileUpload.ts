
import { useState } from 'react';
import { FileWithStatus, ProcessingStage } from '@/types/upload';
import { validateFiles } from '@/utils/fileValidation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { processFiles } from '@/services/uploadService';

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
  const { user } = useAuth();
  
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
      type: determineFileType(file.name),
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
      
      // Process the files
      const result = await processFiles(
        files,
        setProgress,
        setProcessingStage,
        setProcessingMsg,
        crmRegistrado
      );
      
      setIsUploading(false);
      setUploadSuccess(result);
      
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
  const determineFileType = (fileName: string): 'guia' | 'demonstrativo' => {
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
    isUploading,
    progress,
    processingStage,
    processingMsg,
    uploadSuccess,
    handleFileSelect,
    removeFile,
    clearFiles,
    processUploadedFiles
  };
}
