
import { toast } from 'sonner';
import { ProcessingStage, FileWithStatus, ProcessMode } from '@/types/upload';
import { getExtractedMockData } from './mockData';
import { 
  getProcessMode, 
  getAnalysisMessage,
  getCompletionMessage,
  getSuccessMessage,
  getSuccessDescription 
} from './messageUtils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Processa os arquivos de upload para extração de dados
 * 
 * @param files Lista de arquivos para processamento
 * @param setProgress Função para atualizar o progresso do processamento
 * @param setProcessingStage Função para atualizar o estágio do processamento
 * @param setProcessingMsg Função para atualizar a mensagem de processamento
 * @returns Boolean indicando sucesso ou falha no processamento
 */
export async function processFiles(
  files: FileWithStatus[],
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void
): Promise<boolean> {
  try {
    const hasGuias = files.some(f => f.type === 'guia' && f.status === 'valid');
    const hasDemonstrativos = files.some(f => f.type === 'demonstrativo' && f.status === 'valid');
    
    // Determinar o modo de processamento com base nos arquivos disponíveis
    const processMode = getProcessMode(hasGuias, hasDemonstrativos);
    
    // Simular os estágios de processamento
    await simulateProcessingStages(processMode, setProgress, setProcessingStage, setProcessingMsg);
    
    // Extrair os dados
    const extractedData = getExtractedData(hasGuias, hasDemonstrativos);

    // Salvar os dados no banco de dados
    const success = await saveAnalysisToDatabase(files, processMode, extractedData);
    
    if (!success) {
      throw new Error('Falha ao salvar os dados da análise no banco de dados');
    }
    
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
 * Simula os estágios de processamento dos arquivos
 */
async function simulateProcessingStages(
  processMode: ProcessMode,
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void
): Promise<void> {
  // Estágio 1: Extração de dados
  setProcessingMsg('Extraindo dados dos documentos...');
  setProcessingStage('extracting');
  await simulateProgress(1, 30, setProgress);
  
  // Estágio 2: Análise de procedimentos
  setProcessingStage('analyzing');
  setProcessingMsg(getAnalysisMessage(processMode));
  await simulateProgress(31, 60, setProgress);
  
  // Estágio 3: Comparação (apenas para modo completo)
  if (processMode === 'complete') {
    setProcessingStage('comparing');
    setProcessingMsg('Comparando valores pagos com referência CBHPM e calculando diferenças...');
    await simulateProgress(61, 95, setProgress);
  } else {
    setProgress(95);
  }
  
  // Finalizar processamento
  setProgress(100);
  setProcessingStage('complete');
  setProcessingMsg(getCompletionMessage(processMode));
  
  await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Simula o progresso do processamento
 */
async function simulateProgress(
  start: number,
  end: number,
  setProgress: (progress: number) => void
): Promise<void> {
  for (let i = start; i <= end; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    setProgress(i);
  }
}

/**
 * Retorna dados extraídos com base nos tipos de arquivos disponíveis
 * @param hasGuias Indica se há guias disponíveis
 * @param hasDemonstrativos Indica se há demonstrativos disponíveis
 */
export function getExtractedData(hasGuias: boolean = true, hasDemonstrativos: boolean = true) {
  // Em um cenário real, retornaríamos dados parciais baseados no que foi processado
  return getExtractedMockData();
}

/**
 * Salva os resultados da análise no banco de dados
 * @param files Arquivos processados
 * @param processMode Modo de processamento
 * @param extractedData Dados extraídos dos arquivos
 */
async function saveAnalysisToDatabase(
  files: FileWithStatus[],
  processMode: ProcessMode, 
  extractedData: any
): Promise<boolean> {
  try {
    // 1. Criar um registro de análise
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        file_name: files.map(f => f.name).join(', '),
        file_type: processMode,
        hospital: extractedData.demonstrativoInfo?.hospital || null,
        competencia: extractedData.demonstrativoInfo?.competencia || null,
        numero: extractedData.demonstrativoInfo?.numero || null,
        summary: {
          totalCBHPM: extractedData.totais?.valorCBHPM || 0,
          totalPago: extractedData.totais?.valorPago || 0,
          totalDiferenca: extractedData.totais?.diferenca || 0,
          procedimentosTotal: extractedData.procedimentos?.length || 0,
          procedimentosNaoPagos: extractedData.totais?.procedimentosNaoPagos || 0
        },
        status: 'processed'
      })
      .select('id')
      .single();
    
    if (analysisError) {
      console.error('Erro ao inserir análise:', analysisError);
      return false;
    }
    
    // 2. Inserir procedimentos relacionados
    if (extractedData.procedimentos && extractedData.procedimentos.length > 0) {
      const proceduresForInsert = extractedData.procedimentos.map((proc: any) => ({
        analysis_id: analysisData.id,
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        papel: proc.papel,
        valor_cbhpm: proc.valorCBHPM,
        valor_pago: proc.valorPago,
        diferenca: proc.diferenca,
        pago: proc.pago,
        guia: proc.guia,
        beneficiario: proc.beneficiario,
        doctors: proc.doctors
      }));
      
      const { error: proceduresError } = await supabase
        .from('procedure_results')
        .insert(proceduresForInsert);
        
      if (proceduresError) {
        console.error('Erro ao inserir procedimentos:', proceduresError);
        return false;
      }
    }
    
    // 3. Também criar um registro na tabela de histórico para exibição na lista
    const { error: historyError } = await supabase
      .from('analysis_history')
      .insert({
        type: processMode === 'complete' ? 'Guia + Demonstrativo' : 
              processMode === 'guia-only' ? 'Guia' : 'Demonstrativo',
        hospital: extractedData.demonstrativoInfo?.hospital || null,
        description: `${extractedData.demonstrativoInfo?.hospital || 'Hospital'} - ${extractedData.demonstrativoInfo?.competencia || 'Competência não informada'}`,
        procedimentos: extractedData.procedimentos?.length || 0,
        glosados: extractedData.totais?.procedimentosNaoPagos || 0,
        status: 'Analisado'
      });
      
    if (historyError) {
      console.error('Erro ao inserir no histórico:', historyError);
      // Não falharemos a operação se apenas o histórico falhar
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    return false;
  }
}
