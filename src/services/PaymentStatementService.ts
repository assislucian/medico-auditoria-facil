
import { supabase } from '@/integrations/supabase/client';
import { PaymentStatementDetailed } from '@/types';

/**
 * Service responsible for handling payment statement processing
 */
export class PaymentStatementService {
  /**
   * Extracts data from a payment statement PDF
   * @param file PDF file containing payment statement
   * @returns Processed payment statement or error
   */
  static async processPaymentStatement(file: File): Promise<{ data?: PaymentStatementDetailed, error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data, error } = await supabase.functions.invoke('process-payment-statement', {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      return { data: data as PaymentStatementDetailed };
      
    } catch (error: any) {
      console.error('Error processing payment statement:', error);
      return { error: error.message || 'Erro ao processar demonstrativo de pagamento' };
    }
  }
  
  /**
   * Saves a processed payment statement to the database
   */
  static async savePaymentStatement(paymentStatement: PaymentStatementDetailed): Promise<{ success: boolean, id?: string, error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data: analysisData, error: analysisError } = await supabase
        .from('analysis_results')
        .insert({
          file_name: `demonstrativo_${paymentStatement.periodo.replace(/\s+/g, '_')}`,
          file_type: 'demonstrativo',
          user_id: userId,
          summary: {
            totalProcedimentos: paymentStatement.totais.qtdProcedimentos,
            totalPago: paymentStatement.totais.total,
            totalGlosas: paymentStatement.totais.valorGlosas
          }
        })
        .select('id')
        .single();
        
      if (analysisError) throw new Error(analysisError.message);
      
      const proceduresData = paymentStatement.procedimentos.map(proc => ({
        analysis_id: analysisData.id,
        user_id: userId,
        codigo: proc.codigoServico,
        procedimento: proc.descricaoServico,
        valor_pago: proc.valorLiberado,
        pago: proc.valorLiberado > 0,
        guia: proc.guia,
        beneficiario: proc.nome
      }));
      
      if (proceduresData.length > 0) {
        const { error: proceduresError } = await supabase
          .from('procedures')
          .insert(proceduresData);
          
        if (proceduresError) throw new Error(proceduresError.message);
      }
      
      return { success: true, id: analysisData.id };
      
    } catch (error: any) {
      console.error('Error saving payment statement:', error);
      return { success: false, error: error.message || 'Erro ao salvar demonstrativo de pagamento' };
    }
  }
  
  /**
   * Retrieves all payment statements for the current user
   */
  static async getPaymentStatements(): Promise<PaymentStatementDetailed[]> {
    try {
      const { data: analyses, error } = await supabase
        .from('analysis_results')
        .select(`
          *,
          procedures(*)
        `)
        .eq('file_type', 'demonstrativo')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (!analyses) return [];
      
      return analyses.map(analysis => {
        const procedures = analysis.procedures || [];
        
        return {
          id: analysis.id,
          periodo: analysis.competencia || 'Período não especificado',
          nome: 'Nome do Médico',
          crm: 'CRM',
          cpf: 'CPF',
          procedimentos: Array.isArray(procedures) ? procedures.map((proc: any) => ({
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
          })) : [],
          totais: {
            consultas: 0,
            honorarios: this.sumProcedureValues(procedures),
            total: this.sumProcedureValues(procedures),
            qtdProcedimentos: this.getArrayLength(procedures),
            glosas: this.countUnpaidProcedures(procedures),
            valorGlosas: this.calculateTotalGlosas(procedures)
          },
          glosas: []
        };
      });
      
    } catch (error) {
      console.error('Error fetching payment statements:', error);
      return [];
    }
  }
  
  private static getArrayLength(data: any): number {
    return Array.isArray(data) ? data.length : 0;
  }

  private static sumProcedureValues(procedures: any): number {
    if (!Array.isArray(procedures)) return 0;
    return procedures.reduce((sum: number, proc: any) => sum + (proc.valor_pago || 0), 0);
  }
  
  private static countUnpaidProcedures(procedures: any): number {
    if (!Array.isArray(procedures)) return 0;
    return procedures.filter((p: any) => !p.pago).length;
  }
  
  private static calculateTotalGlosas(procedures: any): number {
    if (!Array.isArray(procedures)) return 0;
    return procedures.reduce((sum: number, proc: any) => 
      sum + ((proc.valor_cbhpm || 0) - (proc.valor_pago || 0)), 0);
  }
}
