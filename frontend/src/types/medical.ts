export interface DoctorParticipation {
  code: string;
  name: string;
  role: string;
  startTime: string;
  endTime: string;
  status: string;
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

export interface PaymentStatement {
  id: string;
  numero: string;
  competencia: string;
  hospital: string;
  data: string;
  beneficiario: string;
  codigo: string;
  descricao: string;
  funcao: string;
  pago: boolean;
  valorPago: number;
  valorTabela2015: number;
  diferenca: number;
  procedimentos: Procedure[];
}

export interface GuideData {
  numero: string;
  dataExecucao: string;
  beneficiario: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  status: string;
}

export interface DemonstrativeData {
  lote: string;
  conta: string;
  guia: string;
  data: string;
  carteira: string;
  beneficiario: string;
  nome: string;
  acomodacao: string;
  codigoServico: string;
  descricaoServico: string;
  quantidade: number;
  valorApresentado: number;
  valorLiberado: number;
  proRata: number;
  glosa: number;
}

export interface GuideProcedure {
  numero_guia: string;
  data: string;
  codigo: string;
  descricao: string;
  papel: string;
  crm: string;
  qtd: number;
  status: string;
  beneficiario: string;
  prestador?: string;
  [key: string]: any;
}
