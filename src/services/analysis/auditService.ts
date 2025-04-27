
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches payment audit data for a specific guide
 * 
 * @param guideNumber Guide number to audit
 * @returns Payment audit data
 */
export async function fetchPaymentAudit(guideNumber: string) {
  try {
    const { data, error } = await supabase
      .from('v_payment_audit')
      .select('*')
      .eq('guide_number', guideNumber);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching payment audit data:', error);
    throw error;
  }
}

/**
 * Generates a contestation document for underpaid procedures
 * 
 * @param participationIds IDs of participations to contest
 * @returns URL to the generated document
 */
export async function generateContestation(participationIds: string[]) {
  try {
    const { data, error } = await supabase.functions.invoke('generate-contestation', {
      body: { participationIds }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error generating contestation:', error);
    throw error;
  }
}
