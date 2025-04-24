
/**
 * uploadUtils.ts
 * 
 * Utilitários para o processo de upload e processamento de arquivos.
 */

import { FileWithStatus, ProcessMode, ExtractedData } from '@/types/upload';
import { getRandomInt } from './numberUtils';
import { format } from 'date-fns';

/**
 * Determina o modo de processamento baseado nos tipos de arquivos
 * @param files Lista de arquivos
 * @returns Modo de processamento (completo, somente guia, somente demonstrativo)
 */
export function determineProcessingMode(files: FileWithStatus[]): ProcessMode {
  const hasGuia = files.some(f => f.type === 'guia' && f.status !== 'invalid');
  const hasDemonstrativo = files.some(f => f.type === 'demonstrativo' && f.status !== 'invalid');
  
  if (hasGuia && hasDemonstrativo) {
    return 'complete';
  } else if (hasGuia) {
    return 'guia-only';
  } else {
    return 'demonstrativo-only';
  }
}

/**
 * Verifica se o arquivo é um PDF válido
 * @param file Arquivo para verificar
 * @returns Booleano indicando se é um PDF válido
 */
export function isValidPdf(file: File): boolean {
  return file.type === 'application/pdf' && file.size < 10 * 1024 * 1024; // 10MB máximo
}

/**
 * Gera dados simulados para fallback quando o processamento online falha
 * @param processMode Modo de processamento
 * @param files Arquivos enviados
 * @param crmRegistrado CRM para filtrar
 * @returns Dados extraídos simulados
 */
export function generateFallbackData(processMode: ProcessMode, files: FileWithStatus[], crmRegistrado: string = ''): ExtractedData {
  console.log('Gerando dados de fallback para modo:', processMode);
  
  const hospital = 'Hospital Santa Cruz'; // Hospital padrão para simulação
  const competencia = format(new Date(), 'MMMM yyyy', { locale: require('date-fns/locale/pt-BR') });
  const data = format(new Date(), 'dd/MM/yyyy');
  
  // Buscar nome do beneficiário dos arquivos se disponível
  let beneficiario = 'Paciente Teste';
  const fileNames = files.map(f => f.name.toLowerCase());
  
  if (fileNames.some(name => name.includes('maria'))) {
    beneficiario = 'Maria Silva';
  } else if (fileNames.some(name => name.includes('jose'))) {
    beneficiario = 'José Santos';
  } else if (fileNames.some(name => name.includes('ana'))) {
    beneficiario = 'Ana Oliveira';
  }
  
  // Determinar quantidade de procedimentos a gerar
  const procedimentosCount = processMode === 'complete' ? 5 : 3;
  
  // Lista de procedimentos possíveis para simulação
  const possibleProcedures = [
    { codigo: '30602246', descricao: 'Reconstrução Mamária Com Retalhos Cutâneos Regionais', valorBase: 3772.88 },
    { codigo: '30602076', descricao: 'Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll', valorBase: 2450.65 },
    { codigo: '31309186', descricao: 'Catarata - Facoemulsificação Com Implante De Lente Intraocular Dobrável', valorBase: 1768.43 },
    { codigo: '31003079', descricao: 'Tratamento Cirúrgico Do Glaucoma Congênito', valorBase: 2145.30 },
    { codigo: '30715016', descricao: 'Correção Cirúrgica De Sindactilia Dois Dígitos', valorBase: 1950.56 },
  ];
  
  // Lista de médicos possíveis para simulação
  const possibleDoctors = [
    { crm: '8425', nome: 'FERNANDA MABEL BATISTA DE AQUINO', papel: 'Cirurgiao' },
    { crm: '4127', nome: 'LILIANE ANNUZA DA SILVA', papel: 'Anestesista' },
    { crm: '6091', nome: 'MOISES DE OLIVEIRA SCHOTS', papel: 'Primeiro Auxiliar' },
    { crm: '7236', nome: 'CAROLINA PEIXOTO GARCIA', papel: 'Cirurgiao' },
    { crm: '5489', nome: 'ANDRE LUIZ MENDONÇA', papel: 'Anestesista' },
  ];
  
  // Gerar procedimentos
  const procedimentos = Array.from({ length: procedimentosCount }).map((_, index) => {
    const procedureInfo = possibleProcedures[index % possibleProcedures.length];
    const valorCBHPM = procedureInfo.valorBase;
    const valorPago = processMode === 'complete' 
      ? valorCBHPM * (Math.random() * 0.4 + 0.6) // 60% a 100% do valor CBHPM
      : (index === 0 ? 0 : valorCBHPM * 0.85); // Primeiro procedimento glosado nos modos não completos
    const diferenca = valorPago - valorCBHPM;
    const pago = valorPago > 0;
    
    // Filtrar médicos pelo CRM se fornecido
    let doctors = possibleDoctors.map(d => ({
      code: d.crm,
      name: d.nome,
      role: d.papel,
      startTime: format(new Date(), 'dd/MM/yyyy HH:mm'),
      endTime: format(new Date(Date.now() + 30 * 60000), 'dd/MM/yyyy HH:mm'),
      status: 'Fechada'
    }));
    
    if (crmRegistrado) {
      doctors = doctors.filter(d => d.code === crmRegistrado);
      
      // Se não encontrou o CRM, adiciona um médico com esse CRM
      if (doctors.length === 0) {
        doctors.push({
          code: crmRegistrado,
          name: 'MÉDICO REGISTRADO',
          role: 'Cirurgiao',
          startTime: format(new Date(), 'dd/MM/yyyy HH:mm'),
          endTime: format(new Date(Date.now() + 30 * 60000), 'dd/MM/yyyy HH:mm'),
          status: 'Fechada'
        });
      }
    }
    
    return {
      id: `sim-${Date.now()}-${index}`,
      codigo: procedureInfo.codigo,
      procedimento: procedureInfo.descricao,
      papel: doctors[0]?.role || 'Cirurgiao',
      valorCBHPM,
      valorPago,
      diferenca,
      pago,
      guia: `${getRandomInt(10000000, 99999999)}`,
      beneficiario,
      doctors
    };
  });
  
  // Calcular totais
  const totais = procedimentos.reduce((acc, proc) => {
    acc.valorCBHPM += proc.valorCBHPM;
    acc.valorPago += proc.valorPago;
    acc.diferenca += proc.diferenca;
    if (!proc.pago) acc.procedimentosNaoPagos += 1;
    return acc;
  }, { valorCBHPM: 0, valorPago: 0, diferenca: 0, procedimentosNaoPagos: 0 });
  
  // Montar e retornar dados extraídos simulados
  return {
    demonstrativoInfo: {
      numero: `SIM${Date.now()}`,
      competencia,
      hospital,
      data,
      beneficiario
    },
    procedimentos,
    totais
  };
}

/**
 * Formata tamanho de arquivo em unidades legíveis
 * @param bytes Tamanho em bytes
 * @returns String formatada
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
