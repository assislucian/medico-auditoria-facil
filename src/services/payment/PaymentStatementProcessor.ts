
import { PaymentStatementDetailed } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class PaymentStatementProcessor {
  static async processPaymentStatement(file: File): Promise<{ data?: PaymentStatementDetailed; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data, error } = await supabase.functions.invoke('process-payment-statement', {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('No data returned from processing');
      
      return { data: data as PaymentStatementDetailed };
      
    } catch (error: any) {
      console.error('Error processing payment statement:', error);
      return { error: error.message || 'Erro ao processar demonstrativo de pagamento' };
    }
  }
}
