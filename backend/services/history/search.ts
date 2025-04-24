
import { supabase } from '../../config/supabase';
import { logger } from '../../utils/logger';
import { HistoryItem } from '../../utils/exportService';

/**
 * Search in history by text and optional date range
 * @param searchText Search text
 * @param startDate Optional start date for filtering (ISO string)
 * @param endDate Optional end date for filtering (ISO string)
 * @returns Filtered history items
 */
export async function searchHistory(
  searchText: string,
  startDate?: string,
  endDate?: string
): Promise<HistoryItem[]> {
  try {
    logger.info('Searching history', { searchText, startDate, endDate });
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error('User not authenticated when searching history');
      return [];
    }
    
    // Start building the query
    let query = supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id);
    
    // Add text search if provided
    if (searchText && searchText.trim() !== '') {
      query = query.or(`description.ilike.%${searchText}%,type.ilike.%${searchText}%,hospital.ilike.%${searchText}%`);
    }
    
    // Add date filters if provided
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      // Add one day to include the end date fully
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query = query.lt('date', nextDay.toISOString());
    }
    
    // Execute the query with ordering
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      logger.error('Error searching history', { searchText, startDate, endDate, error });
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
    
    logger.debug('History search completed', { 
      searchText, 
      startDate, 
      endDate, 
      resultsCount: result.length 
    });
    return result;
  } catch (error) {
    logger.error('Exception in searchHistory', { searchText, startDate, endDate, error });
    return [];
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}
