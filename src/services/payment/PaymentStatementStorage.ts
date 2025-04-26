
import { PaymentStatementDetailed } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class PaymentStatementStorage {
  static async savePaymentStatement(paymentStatement: PaymentStatementDetailed): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
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
      
      if (paymentStatement.procedimentos.length > 0) {
        const chunkSize = 50;
        for (let i = 0; i < paymentStatement.procedimentos.length; i += chunkSize) {
          const proceduresChunk = paymentStatement.procedimentos
            .slice(i, i + chunkSize)
            .map(proc => ({
              analysis_id: analysisData.id,
              user_id: userId,
              codigo: proc.codigoServico,
              procedimento: proc.descricaoServico,
              valor_pago: proc.valorLiberado,
              pago: proc.valorLiberado > 0,
              guia: proc.guia,
              beneficiario: proc.nome
            }));
          
          const { error: proceduresError } = await supabase
            .from('procedures')
            .insert(proceduresChunk);
            
          if (proceduresError) throw new Error(proceduresError.message);
        }
      }
      
      return { success: true, id: analysisData.id };
      
    } catch (error: any) {
      console.error('Error saving payment statement:', error);
      return { success: false, error: error.message || 'Erro ao salvar demonstrativo de pagamento' };
    }
  }
}
