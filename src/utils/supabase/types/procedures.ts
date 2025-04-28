
import { Json } from '@/integrations/supabase/types';
import { Database } from '@/integrations/supabase/types';

/**
 * Define doctor participation types
 */
export interface DoctorParticipation {
  id: string;
  name?: string;
  role?: string;
  crm?: string;
  value?: number;
}

/**
 * Define simplified interfaces to avoid circular references
 */
export interface ProcedureFlat {
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
  doctors: DoctorParticipation[];
}

/**
 * Define procedure types
 */
export type ProcedureType = 'all' | 'surgical' | 'clinical' | 'diagnostic';

/**
 * Define a separate interface for procedures with children
 */
export interface ProcedureWithChildren extends ProcedureFlat {
  children?: ProcedureFlat[] | null;
}
