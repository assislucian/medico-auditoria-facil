
import { supabase } from '../../config/supabase';
import { logger } from '../../utils/logger';
import { HistoryItem } from '../../utils/exportService';

/**
 * Fetch history data for a user
 * @returns History data
 */
export async function fetchHistoryData(): Promise<HistoryItem[]> {
  try {
    logger.info('Fetching history data');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error('User not authenticated when fetching history');
      return [];
    }
    
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      logger.error('Error fetching history data', { error });
      return [];
    }
    
    const result = data.map((item: any) => ({
      id: item.id,
      date: formatDate(item.date),
      type: item.type,
      description: item.description,
      procedimentos: item.procedimentos || 0,
      glosados: item.glosados || 0,
      status: item.status
    }));
    
    logger.debug('History data fetched', { count: result.length });
    return result;
  } catch (error) {
    logger.error('Exception in fetchHistoryData', { error });
    return [];
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}
