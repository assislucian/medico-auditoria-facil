
export interface ExtractedData {
  demonstrativoInfo: {
    numero: string;
    competencia: string;
    hospital: string;
    data: string;
    beneficiario: string;
  };
  procedimentos: Procedure[];
  totais: {
    valorCBHPM: number;
    valorPago: number;
    diferenca: number;
    procedimentosNaoPagos: number;
  };
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
