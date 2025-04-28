
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
  doctors?: any[];
  created_at?: string;
}

export interface Procedure {
  id: string;
  guide_id: string;
  codigo: string;
  descricao?: string;
  quantidade?: number;
  created_at?: string;
  // Additional fields needed for our application
  procedimento?: string;
  papel?: string;
  valor_cbhpm?: number;
  valor_pago?: number;
  diferenca?: number;
  pago?: boolean;
  guia?: string;
  beneficiario?: string;
  doctors?: any[];
}
