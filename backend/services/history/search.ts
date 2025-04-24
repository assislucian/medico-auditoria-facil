
import { supabase } from '../../config/supabase';
import { logger } from '../../utils/logger';
import { HistoryItem } from '../../utils/exportService';

/**
 * Search in history by text
 * @param searchText Search text
 * @returns Filtered history items
 */
export async function searchHistory(searchText: string): Promise<HistoryItem[]> {
  try {
    logger.info('Searching history', { searchText });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error('User not authenticated when searching history');
      return [];
    }
    
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .or(`description.ilike.%${searchText}%,type.ilike.%${searchText}%,hospital.ilike.%${searchText}%`)
      .order('date', { ascending: false });
    
    if (error) {
      logger.error('Error searching history', { searchText, error });
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
    
    logger.debug('History search completed', { searchText, resultsCount: result.length });
    return result;
  } catch (error) {
    logger.error('Exception in searchHistory', { searchText, error });
    return [];
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}
