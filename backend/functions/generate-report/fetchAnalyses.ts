
// Query/filter logic for analysis_results

import { supabase } from './auth.ts';

export async function fetchAnalyses(userId: string, startDate?: string, endDate?: string, filters?: any) {
  let query = supabase
    .from('analysis_results')
    .select('*, procedure_results(*)')
    .eq('user_id', userId);

  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    query = query.lte('created_at', endDate);
  }
  if (filters) {
    if (filters.hospital) {
      query = query.eq('hospital', filters.hospital);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
  }

  const { data: analyses, error } = await query;
  if (error) {
    return {
      error: {
        message: error.message,
        status: 500
      }
    };
  }
  return { analyses };
}

