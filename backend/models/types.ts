
/**
 * Core data types for file upload and processing
 * Provides type definitions used across the backend services
 */
import { z } from 'zod';

export type FileType = 'guia' | 'demonstrativo';
export type ProcessingStage = 'idle' | 'extracting' | 'analyzing' | 'comparing' | 'complete' | 'error';
export type FileStatus = 'valid' | 'invalid' | 'processing';
export type ProcessMode = 'complete' | 'guia-only' | 'demonstrativo-only';

export interface FileWithStatus {
  name: string;
  type: FileType;
  file: File;
  status?: FileStatus;
}

export interface DoctorParticipation {
  code: string;
  name: string;
  role: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ProcedureExtracted {
  id?: string;
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
  valorPago?: number;
}

export interface ParticipacaoMedica {
  funcao: string;
  crm: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  status: string;
}

export interface AnalysisResult {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  hospital?: string;
  competencia?: string;
  numero?: string;
  summary: {
    totalCBHPM?: number;
    totalPago?: number;
    totalDiferenca?: number;
    procedimentosTotal?: number;
    procedimentosNaoPagos?: number;
  };
  created_at: string;
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
