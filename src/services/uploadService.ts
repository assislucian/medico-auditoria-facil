import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { ProcessingStage, FileWithStatus, ExtractedData, ProcessMode } from '@/types/upload';

// Dados simulados para demonstração - representando o que seria extraído dos PDFs
const mockExtractedData: ExtractedData = {
  demonstrativoInfo: {
    numero: "DEM-2024-001",
    competencia: "Agosto/2024",
    hospital: "Liga Norteriog Cancer Policlinic",
    data: "2024-08-19",
    beneficiario: "00620040000604690"
  },
  procedimentos: [
    {
      id: "proc-1",
      codigo: "30602246",
      procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
      papel: "Cirurgião",
      valorCBHPM: 3772.88,
      valorPago: 457.64,
      diferenca: -3315.24,
      pago: true,
      guia: "10467538",
      beneficiario: "00620040000604690",
      doctors: [
        {
          code: "8425",
          name: "FERNANDA MABEL BATISTA DE AQUINO",
          role: "Cirurgião",
          startTime: "2024-08-19T14:09:00",
          endTime: "2024-08-19T15:24:00",
          status: "Fechada"
        },
        {
          code: "6091",
          name: "MOISES DE OLIVEIRA SCHOTS",
          role: "Primeiro Auxiliar",
          startTime: "2024-08-19T14:15:00",
          endTime: "2024-08-19T15:17:00",
          status: "Fechada"
        },
        {
          code: "4127",
          name: "LILIANE ANNUZA DA SILVA",
          role: "Anestesista",
          startTime: "2024-08-19T15:17:00",
          endTime: "2024-08-19T15:43:00",
          status: "Fechada"
        }
      ]
    },
    {
      id: "proc-2",
      codigo: "30801036",
      procedimento: "Reconstrução com Retalho Miocutâneo",
      papel: "Cirurgião",
      valorCBHPM: 2981.75,
      valorPago: 596.35,
      diferenca: -2385.40,
      pago: true,
      guia: "10467538",
      beneficiario: "00620040000604690",
      doctors: [
        {
          code: "8425",
          name: "FERNANDA MABEL BATISTA DE AQUINO",
          role: "Cirurgião",
          startTime: "2024-08-19T15:30:00",
          endTime: "2024-08-19T16:45:00",
          status: "Fechada"
        }
      ]
    },
    {
      id: "proc-3",
      codigo: "40809048",
      procedimento: "Consulta em Pronto-Socorro",
      papel: "Cirurgião",
      valorCBHPM: 264.00,
      valorPago: 0.00,
      diferenca: -264.00,
      pago: false,
      guia: "10467649",
      beneficiario: "00620040000604690",
      doctors: [
        {
          code: "8425",
          name: "FERNANDA MABEL BATISTA DE AQUINO",
          role: "Cirurgião",
          startTime: "2024-08-20T08:30:00",
          endTime: "2024-08-20T09:00:00",
          status: "Fechada"
        }
      ]
    }
  ],
  totais: {
    valorCBHPM: 7018.63,
    valorPago: 1053.99,
    diferenca: -5964.64,
    procedimentosNaoPagos: 1
  }
};

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
    
    // Simular estágio de extração de dados dos PDFs
    setProcessingMsg('Extraindo dados dos documentos...');
    setProcessingStage('extracting');
    for (let i = 1; i <= 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }
    
    // Simular estágio de análise de procedimentos
    setProcessingStage('analyzing');
    setProcessingMsg(getAnalysisMessage(processMode));
    for (let i = 31; i <= 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }
    
    // Simular estágio de comparação de valores (se aplicável)
    if (processMode === 'complete') {
      setProcessingStage('comparing');
      setProcessingMsg('Comparando valores pagos com referência CBHPM e calculando diferenças...');
      for (let i = 61; i <= 95; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
    } else {
      // Pular a etapa de comparação para processamento parcial
      setProgress(95);
    }
    
    // Finalizar processamento
    setProgress(100);
    setProcessingStage('complete');
    setProcessingMsg(getCompletionMessage(processMode));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fixed: Correctly pass icon as a function
    toast.success(getSuccessMessage(processMode), {
      icon: () => {
        return <CheckCircle className="h-4 w-4" />;
      },
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
 * Determina o modo de processamento com base nos tipos de arquivos disponíveis
 */
function getProcessMode(hasGuias: boolean, hasDemonstrativos: boolean): 'complete' | 'guia-only' | 'demonstrativo-only' {
  if (hasGuias && hasDemonstrativos) return 'complete';
  if (hasGuias) return 'guia-only';
  return 'demonstrativo-only';
}

/**
 * Retorna a mensagem apropriada para o estágio de análise
 */
function getAnalysisMessage(mode: 'complete' | 'guia-only' | 'demonstrativo-only'): string {
  switch (mode) {
    case 'complete':
      return 'Identificando procedimentos e consultando tabela CBHPM 2015...';
    case 'guia-only':
      return 'Identificando procedimentos nas guias médicas...';
    case 'demonstrativo-only':
      return 'Extraindo valores e procedimentos do demonstrativo de pagamento...';
  }
}

/**
 * Retorna a mensagem apropriada para o estágio de conclusão
 */
function getCompletionMessage(mode: 'complete' | 'guia-only' | 'demonstrativo-only'): string {
  switch (mode) {
    case 'complete':
      return 'Análise completa concluída com sucesso!';
    case 'guia-only':
      return 'Extração de dados das guias concluída!';
    case 'demonstrativo-only':
      return 'Extração de dados do demonstrativo concluída!';
  }
}

/**
 * Retorna a mensagem de sucesso apropriada para o tipo de processamento
 */
function getSuccessMessage(mode: ProcessMode): string {
  switch (mode) {
    case 'complete':
      return 'Análise concluída com sucesso!';
    case 'guia-only':
      return 'Guias processadas com sucesso!';
    case 'demonstrativo-only':
      return 'Demonstrativo processado com sucesso!';
  }
}

/**
 * Retorna a descrição de sucesso apropriada para o tipo de processamento
 */
function getSuccessDescription(mode: ProcessMode): string {
  switch (mode) {
    case 'complete':
      return 'Os resultados da comparação estão disponíveis abaixo.';
    case 'guia-only':
      return 'Adicione um demonstrativo para comparar valores com tabelas CBHPM.';
    case 'demonstrativo-only':
      return 'Adicione guias para verificar procedimentos realizados.';
  }
}

/**
 * Retorna dados extraídos com base nos tipos de arquivos disponíveis
 * @param hasGuias Indica se há guias disponíveis
 * @param hasDemonstrativos Indica se há demonstrativos disponíveis
 */
export function getExtractedData(hasGuias: boolean = true, hasDemonstrativos: boolean = true): ExtractedData {
  // Em um cenário real, retornaríamos dados parciais baseados no que foi processado
  // Para o mock, retornamos os dados completos
  return mockExtractedData;
}
