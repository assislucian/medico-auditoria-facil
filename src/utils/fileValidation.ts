
import { FileWithStatus, FileType } from '@/types/upload';
import { toast } from 'sonner';

/**
 * Validates uploaded files based on type and size
 * @param files Array of files to validate
 * @returns Validated files with status
 */
export const validateFiles = async (files: FileWithStatus[]): Promise<FileWithStatus[]> => {
  const validatedFiles: FileWithStatus[] = [];

  for (const file of files) {
    // Check file type (PDF only)
    if (!file.file.name.toLowerCase().endsWith('.pdf')) {
      toast.warning(`Arquivo inválido: ${file.name}`, {
        description: 'Apenas arquivos PDF são permitidos.'
      });
      continue;
    }

    // Check file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.file.size > MAX_FILE_SIZE) {
      toast.warning(`Arquivo muito grande: ${file.name}`, {
        description: 'Tamanho máximo do arquivo é 10MB.'
      });
      continue;
    }

    // Validate file type consistency
    const expectedType: FileType = file.type;
    const detectedType = detectFileType(file.name);
    
    if (expectedType !== detectedType) {
      toast.warning(`Tipo de arquivo inconsistente: ${file.name}`, {
        description: `Esperado: ${expectedType}, Detectado: ${detectedType}`
      });
      continue;
    }

    // If all validations pass
    validatedFiles.push({
      ...file,
      status: 'valid'
    });
  }

  return validatedFiles;
};

/**
 * Detect file type based on file name
 * @param fileName Name of the file
 * @returns Detected file type
 */
const detectFileType = (fileName: string): FileType => {
  const lowercaseName = fileName.toLowerCase();
  
  if (
    lowercaseName.includes('demonstrativo') || 
    lowercaseName.includes('pagamento') || 
    lowercaseName.includes('recebiveis')
  ) {
    return 'demonstrativo';
  }
  
  return 'guia';
};
