
import { useState } from 'react';
import { FileWithStatus, FileType } from '@/types/upload';
import { toast } from 'sonner';
import { validateFiles } from '@/utils/fileValidation';

/**
 * Custom hook for managing file list operations
 */
export function useFileList() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);

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
   * Handle file type-specific selection from input
   * @param event File input change event
   * @param type File type
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    return handleFileSelect(event);
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
    hasFile,
    hasGuiaDemonstrativoPair,
    hasValidFilesForProcessing,
    hasInvalidFiles,
    handleFileSelect,
    handleFileChange,
    removeFile,
    clearFiles,
    resetFiles: clearFiles, // Alias for clearFiles to match UploadSection
  };
}
