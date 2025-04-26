
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  name: string;
  email: string;
  crm: string;
  specialty?: string;
  notification_preferences?: Json;
  reference_tables_preferences?: Json;
  trial_status: 'not_started' | 'active' | 'expired';
  trial_end_date?: string;
  updated_at?: string;
  created_at?: string;
}

// Extension of the Profile interface that includes UUID type for ID
// to be used with Supabase queries
export interface ProfileWithUUID extends Omit<Profile, 'id'> {
  id: unknown; // This allows the Supabase UUID type to be used
}

export type ExtractedData = {
  id: string;
  procedures: Array<{
    id: string;
    codigo: string;
    procedimento: string;
    papel?: string;
    valorCBHPM: number;
    valorPago: number;
    diferenca: number;
    pago: boolean;
    guia?: string;
    beneficiario?: string;
    doctors?: any[];
  }>;
};

export type HelpArticle = Database['public']['Tables']['help_articles']['Row'];

// Use explicit re-exports to avoid ambiguity
export * from './upload';

// Re-export everything from medical except DoctorParticipation which is already exported from upload
export type {
  Procedure,
  PaymentStatement,
  GuideData,
  DemonstrativeData
} from './medical';

// Now let's create types for our enhanced data model
export interface PaymentStatementDetailed {
  id: string;
  periodo: string;
  nome: string;
  crm: string;
  cpf: string;
  procedimentos: Array<ProcedimentoDemonstrativo>;
  totais: {
    consultas: number;
    honorarios: number;
    total: number;
    qtdProcedimentos: number;
    glosas: number;
    valorGlosas: number;
  };
  glosas: Array<GlosaDetalhada>;
}

export interface ProcedimentoDemonstrativo {
  lote: string;
  conta: string;
  guia: string;
  data: string;
  carteira: string;
  nome: string;
  acomodacao: string;
  codigoServico: string;
  descricaoServico: string;
  quantidade: number;
  valorApresentado: number;
  valorLiberado: number;
  proRata: number;
  glosa: number;
  tipo: 'consulta' | 'honorario' | 'outro';
}

export interface GlosaDetalhada {
  conta: string;
  guia: string;
  data: string;
  nome: string;
  codigoServico: string;
  descricaoServico: string;
  codigo: string;
  descricao: string;
  valor: number;
}

export interface MedicalGuideDetailed {
  numero: string;
  dataExecucao: string;
  beneficiario: {
    codigo: string;
    nome: string;
  };
  prestador: {
    codigo: string;
    nome: string;
  };
  procedimentos: Array<ProcedimentoGuia>;
}

export interface ProcedimentoGuia {
  codigo: string;
  descricao: string;
  dataExecucao: string;
  quantidade: number;
  status: string;
  participacoes: Array<ParticipacaoMedica>;
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

export interface ComparisonResult {
  guia: MedicalGuideDetailed;
  demonstrativo?: ProcedimentoDemonstrativo[];
  discrepancias: Array<{
    tipo: 'nao_pago' | 'pago_parcialmente' | 'funcao_incorreta' | 'outro';
    procedimentoGuia: ProcedimentoGuia;
    procedimentoDemonstrativo?: ProcedimentoDemonstrativo;
    descricao: string;
  }>;
}
