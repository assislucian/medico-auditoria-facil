import { FileWithStatus } from '@/types/upload';
import { toast } from 'sonner';
import { processFiles } from '@/services/upload';
import { determineProcessingMode } from '@/utils/uploadUtils';
import axios from 'axios';

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

      // Apenas demonstrativo
      const demoFile = files.find(f => f.type === 'demonstrativo' && f.status === 'valid');
      if (!demoFile) {
        toast.error('Selecione um demonstrativo válido para upload.');
        return { success: false, analysisId: null };
      }
      const formData = new FormData();
      formData.append('file', demoFile.file, demoFile.name);
      // Se desejar, pode adicionar periodo/lote vindos do usuário

      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${apiUrl}/api/v1/demonstrativos/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setProgress(100);
      setProcessingStage('complete');
      setProcessingMsg('Processamento concluído!');
      toast.success('Demonstrativo processado com sucesso!');
      return { success: true, analysisId: res.data.id };
    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
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
