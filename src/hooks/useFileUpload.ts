
import { useState } from 'react';
import { FileWithStatus, FileType, FileStatus, ProcessingStage } from '@/types/upload';
import { toast } from 'sonner';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [processingMsg, setProcessingMsg] = useState('Preparando arquivos...');

  const hasFile = (type: FileType): boolean => {
    return selectedFiles.some(f => f.type === type);
  };

  const hasGuiaDemonstrativoPair = (): boolean => {
    const validGuias = selectedFiles.filter(f => f.type === 'guia' && f.status !== 'invalid').length > 0;
    const validDemos = selectedFiles.filter(f => f.type === 'demonstrativo' && f.status !== 'invalid').length > 0;
    return validGuias && validDemos;
  };

  const hasInvalidFiles = (): boolean => {
    return selectedFiles.some(f => f.status === 'invalid');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Validate file types
      const invalidFiles = files.filter(file => file.type !== 'application/pdf');
      if (invalidFiles.length > 0) {
        toast.error('Por favor, envie apenas arquivos PDF');
        return;
      }

      const fileArray: FileWithStatus[] = files.map(file => ({
        name: file.name,
        type,
        file,
        status: 'processing' as FileStatus
      }));
      
      // Simulate file validation
      setTimeout(() => {
        const updatedFiles = fileArray.map(file => {
          // Randomly mark some files as invalid for demonstration
          const isValid = file.name.toLowerCase().includes('invalid') ? false : true;
          return { ...file, status: isValid ? 'valid' as FileStatus : 'invalid' as FileStatus };
        });
        
        setSelectedFiles(prev => {
          const newFiles = [...prev];
          updatedFiles.forEach(file => {
            const existingIndex = newFiles.findIndex(f => f.name === file.name && f.type === file.type);
            if (existingIndex >= 0) {
              newFiles[existingIndex] = file;
            } else {
              newFiles.push(file);
            }
          });
          return newFiles;
        });
        
        const invalidCount = updatedFiles.filter(f => f.status === 'invalid').length;
        if (invalidCount > 0) {
          toast.warning(`${invalidCount} ${invalidCount === 1 ? 'arquivo não pôde' : 'arquivos não puderam'} ser processado. Verifique o formato.`);
        }
      }, 1500);
      
      setSelectedFiles([...selectedFiles, ...fileArray]);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    if (showComparison) {
      setShowComparison(false);
      toast.info("A comparação foi resetada devido à remoção de arquivos.");
    }
  };

  const resetFiles = () => {
    setSelectedFiles([]);
    setShowComparison(false);
  };

  return {
    uploading,
    setUploading,
    progress,
    setProgress,
    selectedFiles,
    setSelectedFiles,
    showComparison,
    setShowComparison,
    processingStage,
    setProcessingStage,
    processingMsg,
    setProcessingMsg,
    hasFile,
    hasGuiaDemonstrativoPair,
    hasInvalidFiles,
    handleFileChange,
    removeFile,
    resetFiles
  };
}
