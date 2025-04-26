
import { Database } from '@/integrations/supabase/types';

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

export * from './upload';
export * from './medical';
