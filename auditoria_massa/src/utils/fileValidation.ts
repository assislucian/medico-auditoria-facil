
import { FileWithStatus } from "@/types/upload";
import { toast } from "sonner";

// Maximum allowed file size in MB
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert to bytes

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.ms-excel', // xls
  'text/csv',
  'application/json',
  'application/xml',
  'text/xml',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/msword' // doc
];

/**
 * Validates individual files based on type and size
 * @param file The file to validate
 * @returns Boolean indicating if the file is valid
 */
export const validateFile = async (file: File): Promise<boolean> => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    console.error(`File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE_MB}MB`);
    return false;
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    // For PDFs, do an additional check for files that might be PDFs but have wrong MIME type
    if (file.name.toLowerCase().endsWith('.pdf')) {
      // Try to read the first few bytes to detect PDF signature
      try {
        const buffer = await file.slice(0, 5).arrayBuffer();
        const signature = new Uint8Array(buffer);
        // Check for PDF signature (%PDF-)
        if (signature[0] === 0x25 && signature[1] === 0x50 && 
            signature[2] === 0x44 && signature[3] === 0x46 && 
            signature[4] === 0x2D) {
          return true;
        }
      } catch (error) {
        console.error('Error checking PDF signature:', error);
      }
    }
    
    console.error(`File ${file.name} has invalid type: ${file.type}`);
    return false;
  }

  return true;
};

/**
 * Validates array of files and updates their status
 * @param filesWithStatus Array of files with status
 * @returns Array of files with updated status
 */
export const validateFiles = async (filesWithStatus: FileWithStatus[]): Promise<FileWithStatus[]> => {
  // Create a copy of the files array to modify
  const validatedFiles = [...filesWithStatus];
  
  // Array to track invalid files
  const invalidFiles: string[] = [];
  
  // Process each file
  for (let i = 0; i < validatedFiles.length; i++) {
    const file = validatedFiles[i];
    const isValid = await validateFile(file.file);
    
    // Update file status
    validatedFiles[i] = {
      ...file,
      status: isValid ? 'valid' : 'invalid'
    };
    
    // Track invalid files
    if (!isValid) {
      invalidFiles.push(file.name);
    }
  }
  
  // Notify about invalid files
  if (invalidFiles.length > 0) {
    if (invalidFiles.length === 1) {
      toast.error(`Arquivo inválido: ${invalidFiles[0]}`, {
        description: `Apenas arquivos de até ${MAX_FILE_SIZE_MB}MB nos formatos permitidos são aceitos.`
      });
    } else {
      toast.error(`${invalidFiles.length} arquivos inválidos`, {
        description: `Alguns arquivos não poderão ser processados. Verifique o formato e tamanho.`
      });
    }
  }
  
  return validatedFiles;
};

/**
 * Gets a descriptive error message for an invalid file
 * @param file The file that failed validation
 * @returns Error message
 */
export const getFileValidationErrorMessage = (file: File): string => {
  if (file.size > MAX_FILE_SIZE) {
    return `O arquivo excede o tamanho máximo de ${MAX_FILE_SIZE_MB}MB.`;
  }
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return `Formato de arquivo não suportado. Use PDF, Excel, CSV, XML ou documentos Word.`;
  }
  
  return 'O arquivo não pode ser validado.';
};
