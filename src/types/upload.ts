
export interface ExtractedData {
  demonstrativoInfo: DemonstrativoInfo;
  procedimentos: Procedure[];
  totais: {
    valorCBHPM: number;
    valorPago: number;
    diferenca: number;
    procedimentosNaoPagos: number;
  };
}

export interface DemonstrativoInfo {
  numero: string;
  competencia: string;
  hospital: string;
  data: string;
  beneficiario: string;
}

export interface Procedure {
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

export interface DoctorParticipation {
  code: string;
  name: string;
  role: string;
  startTime: string;
  endTime: string;
  status: string;
}

export type FileType = 'guia' | 'demonstrativo';

export type FileStatus = 'processing' | 'valid' | 'invalid';

export interface FileWithStatus {
  id?: string;
  name: string;
  file: File;
  type: FileType;
  status: FileStatus;
}

export type ProcessingStage = 'idle' | 'extracting' | 'uploading' | 'analyzing' | 'comparing' | 'complete' | 'error';

export type ProcessMode = 'complete' | 'guia-only' | 'demonstrativo-only';
