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
}

export interface PaymentStatement {
  id: string;
  numero: string;
  competencia: string;
  hospital: string;
  data: string;
  beneficiario: string;
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
