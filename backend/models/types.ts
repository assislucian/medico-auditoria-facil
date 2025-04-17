
/**
 * Core type definitions for the backend
 */

export interface DoctorParticipation {
  code: string;
  name: string;
  role: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ProcedureExtracted {
  id: string;
  codigo: string;
  procedimento: string;
  papel: string;
  valorCBHPM: number;
  valorPago: number;
  diferenca: number;
  pago: boolean;
  guia: string;
  beneficiario: string;
  doctors: DoctorParticipation[];
}

export interface DemonstrativoInfo {
  numero: string;
  competencia: string;
  hospital: string;
  data: string;
  beneficiario: string;
}

export interface ProcessingTotals {
  valorCBHPM: number;
  valorPago: number;
  diferenca: number;
  procedimentosNaoPagos: number;
}

export interface ExtractedData {
  demonstrativoInfo: DemonstrativoInfo;
  procedimentos: ProcedureExtracted[];
  totais: ProcessingTotals;
}

export interface GuiaData {
  numero: string;
  execucao: string;
  beneficiario: {
    codigo: string;
    nome: string;
  };
  prestador: {
    codigo: string;
    nome: string;
  };
  procedimentos: ProcedimentoGuia[];
}

export interface ProcedimentoGuia {
  codigo: string;
  descricao: string;
  dataExecucao: string;
  quantidade: number;
  status: string;
  participacoes: ParticipacaoMedica[];
}

export interface ParticipacaoMedica {
  funcao: string;
  crm: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  status: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  type: string;
  description: string;
  procedimentos: number;
  glosados: number;
  status: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  crm?: string;
  specialty?: string;
}

export interface AnalysisResult {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  created_at: string;
  summary: Record<string, any>;
  hospital?: string;
  competencia?: string;
  numero?: string;
  status: string;
}

export interface ProcedureResult {
  id: string;
  analysis_id: string;
  codigo: string;
  procedimento: string;
  papel?: string;
  valor_cbhpm: number;
  valor_pago: number;
  diferenca: number;
  pago: boolean;
  guia?: string;
  beneficiario?: string;
  doctors?: DoctorParticipation[];
}
