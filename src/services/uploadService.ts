
import { toast } from 'sonner';
import { ProcessingStage, FileWithStatus, ProcessMode, ExtractedData } from '@/types/upload';
import { getProcessMode, getSuccessMessage, getSuccessDescription } from './messageUtils';
import { simulateProcessingStages } from './processingService';
import { supabase } from '@/integrations/supabase/client';

// Store the extracted data in memory for components to access
let currentExtractedData: ExtractedData | null = null;
let currentAnalysisId: string | null = null;

/**
 * Processa os arquivos de upload para extração de dados
 * 
 * @param files Lista de arquivos para processamento
 * @param setProgress Função para atualizar o progresso do processamento
 * @param setProcessingStage Função para atualizar o estágio do processamento
 * @param setProcessingMsg Função para atualizar a mensagem de processamento
 * @param crmRegistrado CRM do médico registrado para filtrar apenas suas participações
 * @returns Boolean indicando sucesso ou falha no processamento
 */
export async function processFiles(
  files: FileWithStatus[],
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void,
  crmRegistrado: string = ''
): Promise<boolean> {
  try {
    // Call the backend Edge Function for processing
    const { data: uploadedFiles } = await uploadFilesToStorage(files);
    
    const hasGuias = files.some(f => f.type === 'guia' && f.status === 'valid');
    const hasDemonstrativos = files.some(f => f.type === 'demonstrativo' && f.status === 'valid');
    
    // Determinar o modo de processamento com base nos arquivos disponíveis
    const processMode = getProcessMode(hasGuias, hasDemonstrativos);
    
    // Simular os estágios de processamento
    await simulateProcessingStages(processMode, setProgress, setProcessingStage, setProcessingMsg);
    
    // Call backend function to process files
    const response = await supabase.functions.invoke('process-analysis', {
      body: {
        uploadIds: uploadedFiles?.map(f => f.id) || [],
        crmRegistrado
      }
    });
    
    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Error processing files');
    }
    
    // Store extracted data and analysis ID
    currentExtractedData = response.data.extractedData;
    currentAnalysisId = response.data.analysisId;
    
    // Exibir toast de sucesso
    toast.success(getSuccessMessage(processMode), {
      description: getSuccessDescription(processMode)
    });
    
    return true;
  } catch (error) {
    console.error('Erro no processamento:', error);
    toast.error('Erro ao processar os arquivos', {
      description: 'Por favor, tente novamente ou contate o suporte.'
    });
    return false;
  }
}

/**
 * Faz upload dos arquivos para o Supabase Storage
 * 
 * @param files Arquivos para upload
 * @returns Array de URLs dos arquivos salvos
 */
async function uploadFilesToStorage(files: FileWithStatus[]) {
  const validFiles = files.filter(f => f.status === 'valid');
  
  try {
    // Call the upload-files edge function
    const formData = new FormData();
    
    // Add each file to the form data
    validFiles.forEach(file => {
      formData.append('files', file.file);
      formData.append('fileType', file.type);
    });
    
    const { data, error } = await supabase.functions.invoke('upload-files', {
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (error) {
      console.error('Erro no upload dos arquivos:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro no upload dos arquivos:', error);
    throw error;
  }
}

/**
 * Obtém os dados extraídos do último processamento
 * 
 * @returns Os dados extraídos ou dados simulados caso não haja dados disponíveis
 */
export async function getExtractedData(): Promise<ExtractedData> {
  // Se temos dados em memória, retornamos eles
  if (currentExtractedData) {
    return currentExtractedData;
  }
  
  // Se temos o ID da análise, tenta buscar do banco de dados
  if (currentAnalysisId) {
    try {
      const { data, error } = await supabase.functions.invoke('get-analysis', {
        body: { analysisId: currentAnalysisId }
      });
      
      if (!error && data) {
        currentExtractedData = data;
        return data;
      }
    } catch (error) {
      console.error('Erro ao buscar análise:', error);
    }
  }
  
  // Em último caso, retorna dados simulados
  return {
    demonstrativoInfo: {
      numero: 'DM' + Math.floor(Math.random() * 1000000),
      competencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      hospital: 'Hospital Demonstrativo',
      data: new Date().toLocaleDateString('pt-BR'),
      beneficiario: 'Paciente Demonstrativo'
    },
    procedimentos: [
      {
        id: 'proc-1',
        codigo: '30602246',
        procedimento: 'Reconstrução Mamária Com Retalhos Cutâneos Regionais',
        papel: 'Cirurgiao',
        valorCBHPM: 3772.88,
        valorPago: 3200.50,
        diferenca: -572.38,
        pago: true,
        guia: '10467538',
        beneficiario: 'THAYSE BORGES',
        doctors: [
          {
            code: '8425',
            name: 'FERNANDA MABEL BATISTA DE AQUINO',
            role: 'Cirurgiao',
            startTime: '19/08/2024 14:09',
            endTime: '19/08/2024 15:24',
            status: 'Fechada'
          }
        ]
      },
      {
        id: 'proc-2',
        codigo: '30602076',
        procedimento: 'Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll',
        papel: 'Cirurgiao',
        valorCBHPM: 2450.65,
        valorPago: 2100.30,
        diferenca: -350.35,
        pago: true,
        guia: '10467538',
        beneficiario: 'THAYSE BORGES',
        doctors: [
          {
            code: '8425',
            name: 'FERNANDA MABEL BATISTA DE AQUINO',
            role: 'Cirurgiao',
            startTime: '19/08/2024 14:09',
            endTime: '19/08/2024 15:24',
            status: 'Fechada'
          }
        ]
      }
    ],
    totais: {
      valorCBHPM: 6223.53,
      valorPago: 5300.80,
      diferenca: -922.73,
      procedimentosNaoPagos: 0
    }
  };
}
