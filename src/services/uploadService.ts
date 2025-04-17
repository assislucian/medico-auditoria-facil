
import { toast } from 'sonner';
import { ProcessingStage, FileWithStatus, ProcessMode, ExtractedData } from '@/types/upload';
import { getProcessMode, getSuccessMessage, getSuccessDescription } from './messageUtils';
import { simulateProcessingStages, processarMultiplasGuias, extrairDadosDePDFs } from './processingService';
import { saveAnalysisToDatabase, getAnalysisById } from './databaseService';
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
    const hasGuias = files.some(f => f.type === 'guia' && f.status === 'valid');
    const hasDemonstrativos = files.some(f => f.type === 'demonstrativo' && f.status === 'valid');
    
    // Determinar o modo de processamento com base nos arquivos disponíveis
    const processMode = getProcessMode(hasGuias, hasDemonstrativos);
    
    // Simular os estágios de processamento
    await simulateProcessingStages(processMode, setProgress, setProcessingStage, setProcessingMsg);
    
    // Fazer upload dos arquivos para o Supabase Storage
    const uploadedFiles = await uploadFilesToStorage(files);
    
    // Extrair e processar dados dos arquivos
    const extractedData = await extractDataFromFiles(files, processMode, crmRegistrado);

    // Salvar os dados extraídos na variável de memória para acesso pelos componentes
    currentExtractedData = extractedData;

    // Salvar os dados no banco de dados
    const { success, analysisId } = await saveAnalysisToDatabase(files, processMode, extractedData);
    
    if (!success) {
      throw new Error('Falha ao salvar os dados da análise no banco de dados');
    }
    
    // Armazenar o ID da análise para recuperação posterior
    currentAnalysisId = analysisId;
    
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
async function uploadFilesToStorage(files: FileWithStatus[]): Promise<string[]> {
  const fileUrls: string[] = [];
  const validFiles = files.filter(f => f.status === 'valid');
  
  try {
    // Obter o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');
    
    // Verificar se o bucket existe e criar se não existir
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === 'uploads')) {
      await supabase.storage.createBucket('uploads', { public: false });
    }
    
    // Fazer upload de cada arquivo
    for (const file of validFiles) {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file.file, {
          cacheControl: '3600',
          upsert: false,
        });
        
      if (error) {
        console.error('Erro ao fazer upload:', error);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path);
        
      fileUrls.push(publicUrl);
      
      // Registrar o upload no banco de dados
      await supabase.from('uploads').insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_path: data.path,
        status: 'processado'
      });
    }
    
    return fileUrls;
  } catch (error) {
    console.error('Erro no upload dos arquivos:', error);
    return fileUrls;
  }
}

/**
 * Extrai dados dos arquivos com base no tipo
 * 
 * @param files Arquivos para processamento
 * @param processMode Modo de processamento
 * @param crmRegistrado CRM do médico para filtrar participações
 * @returns Dados extraídos dos arquivos
 */
async function extractDataFromFiles(files: FileWithStatus[], processMode: ProcessMode, crmRegistrado: string = '') {
  // Filtrar apenas os arquivos válidos
  const validFiles = files.filter(f => f.status === 'valid');
  
  // Separar os arquivos por tipo
  const guiasFiles = validFiles.filter(f => f.type === 'guia').map(f => f.file);
  const demonstrativosFiles = validFiles.filter(f => f.type === 'demonstrativo').map(f => f.file);
  
  console.log(`Processando ${guiasFiles.length} guias e ${demonstrativosFiles.length} demonstrativos`);
  console.log('CRM registrado para filtragem:', crmRegistrado || 'Nenhum (mostrando todas participações)');
  
  if (processMode === 'complete' || processMode === 'guia-only') {
    // Extrair dados das guias (PDFs) - em ambiente real utilizaria OCR ou parsing específico
    const guiasData = await extrairDadosDePDFs(guiasFiles);
    
    console.log('Dados extraídos das guias:', guiasData);
    
    // Processar as guias e demonstrativos
    if (processMode === 'complete' && demonstrativosFiles.length > 0) {
      // Em produção: processar dados de ambos guias e demonstrativos
      return processarMultiplasGuias(guiasData, crmRegistrado);
    } else {
      // Processamento somente com guias
      return processarMultiplasGuias(guiasData, crmRegistrado);
    }
  } else {
    // Processamento somente com demonstrativos (simplificado para demonstração)
    return {
      demonstrativoInfo: {
        numero: 'DM' + Math.floor(Math.random() * 1000000),
        competencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        hospital: 'Hospital Demonstrativo',
        data: new Date().toLocaleDateString('pt-BR'),
        beneficiario: 'Paciente Demonstrativo'
      },
      procedimentos: [],
      totais: {
        valorCBHPM: 0,
        valorPago: 0,
        diferenca: 0,
        procedimentosNaoPagos: 0
      }
    };
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
      const dadosDb = await getAnalysisById(currentAnalysisId);
      if (dadosDb) {
        currentExtractedData = dadosDb;
        return dadosDb;
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
