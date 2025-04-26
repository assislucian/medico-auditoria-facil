
import { PaymentStatementDetailed } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class PaymentStatementRetrieval {
  private static sumProcedureValues(procedures: any[]): number {
    return procedures.reduce((sum: number, proc: any) => sum + (proc.valor_pago || 0), 0);
  }
  
  private static countUnpaidProcedures(procedures: any[]): number {
    return procedures.filter((p: any) => !p.pago).length;
  }
  
  private static calculateTotalGlosas(procedures: any[]): number {
    return procedures.reduce((sum: number, proc: any) => 
      sum + ((proc.valor_cbhpm || 0) - (proc.valor_pago || 0)), 0);
  }

  static async getPaymentStatements(): Promise<PaymentStatementDetailed[]> {
    try {
      const { data: analyses, error } = await supabase
        .from('analysis_results')
        .select(`
          id,
          created_at,
          file_name,
          summary,
          procedures (
            id,
            codigo,
            procedimento,
            valor_pago,
            pago,
            guia,
            beneficiario,
            created_at
          )
        `)
        .eq('file_type', 'demonstrativo')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (!analyses) return [];
      
      return analyses.map(analysis => ({
        id: analysis.id,
        periodo: analysis.file_name.replace('demonstrativo_', '').replace(/_/g, ' '),
        nome: 'Nome do Médico',
        crm: 'CRM',
        cpf: 'CPF',
        procedimentos: (analysis.procedures || []).map((proc: any) => ({
          lote: proc.guia?.split('-')[0] || '',
          conta: proc.id,
          guia: proc.guia || '',
          data: new Date(proc.created_at).toLocaleDateString('pt-BR'),
          carteira: '',
          nome: proc.beneficiario || '',
          acomodacao: '',
          codigoServico: proc.codigo,
          descricaoServico: proc.procedimento,
          quantidade: 1,
          valorApresentado: proc.valor_cbhpm || 0,
          valorLiberado: proc.valor_pago || 0,
          proRata: 0,
          glosa: (proc.valor_cbhpm || 0) - (proc.valor_pago || 0),
          tipo: 'honorario'
        })),
        totais: {
          consultas: 0,
          honorarios: this.sumProcedureValues(analysis.procedures || []),
          total: this.sumProcedureValues(analysis.procedures || []),
          qtdProcedimentos: (analysis.procedures || []).length,
          glosas: this.countUnpaidProcedures(analysis.procedures || []),
          valorGlosas: this.calculateTotalGlosas(analysis.procedures || [])
        },
        glosas: []
      }));
      
    } catch (error) {
      console.error('Error fetching payment statements:', error);
      return [];
    }
  }
}
