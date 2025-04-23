
import { FileWithStatus } from '@/types/upload';
import { toast } from 'sonner';
import { processFiles } from '@/services/upload';
import { determineProcessingMode } from '@/utils/uploadUtils';

// Define the result type
interface ProcessResult {
  success: boolean;
  analysisId: string | null;
}

/**
 * Custom hook for file upload service integration
 */
export function useFileUploadService() {
  /**
   * Process the uploaded files
   * @param files Files to process
   * @param setProgress Progress setter function
   * @param setProcessingStage Processing stage setter function
   * @param setProcessingMsg Processing message setter function
   * @param crmRegistrado CRM to filter by (optional)
   * @param fileTypes Lista dos tipos selecionados
   * @returns Success status and analysis ID
   */
  const processUploadedFiles = async (
    files: FileWithStatus[],
    setProgress: (progress: number) => void,
    setProcessingStage: (stage: any) => void,
    setProcessingMsg: (msg: string) => void,
    crmRegistrado: string = '',
    fileTypes: ('guia' | 'demonstrativo')[]
  ): Promise<ProcessResult> => {
    if (files.length === 0) {
      toast.error('Nenhum arquivo selecionado', {
        description: 'Por favor, selecione arquivos para processar.'
      });
      return { success: false, analysisId: null };
    }

    if (!files.some(file => file.status === 'valid')) {
      toast.error('Arquivos inválidos', {
        description: 'Todos os arquivos selecionados são inválidos. Por favor, selecione arquivos válidos.'
      });
      return { success: false, analysisId: null };
    }

    try {
      setProgress(0);
      setProcessingStage('extracting');
      setProcessingMsg('Enviando arquivos...');

      const result = await processFiles(
        files.filter(f => f.status === 'valid'),
        setProgress,
        setProcessingStage,
        setProcessingMsg,
        crmRegistrado,
        fileTypes
      );

      return result;
    } catch (error) {
      console.error('Error processing files:', error);
      setProcessingStage('error');
      setProcessingMsg('Erro ao processar os arquivos');

      toast.error('Erro ao processar os arquivos', {
        description: 'Por favor, tente novamente ou contate o suporte.'
      });

      return { success: false, analysisId: null };
    }
  };

  return {
    processUploadedFiles,
    determineProcessingMode: (files: FileWithStatus[]) => determineProcessingMode(files),
  };
}
