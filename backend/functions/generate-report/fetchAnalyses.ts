
import { supabase } from './auth.ts';

/**
 * Fetch analyses filtered by crm and role, with license validation
 */
export async function fetchAnalyses(
  crm: string,
  role: string,
  startDate?: string,
  endDate?: string,
  filters?: any
) {
  // Validate license
  const { data: license, error: licenseError } = await supabase
    .from('licenses')
    .select('crm, active, expires_at')
    .eq('crm', crm)
    .eq('active', true)
    .lte('expires_at', new Date().toISOString())
    .maybeSingle();

  if (!license || licenseError) {
    return { error: { message: 'Licença inativa ou não encontrada', status: 403 } };
  }

  let query = supabase
    .from('analysis_results')
    .select('*, procedure_results(*)')
    .eq('crm', crm)
    .eq('role', role);

  if (startDate) {
    query = query.gte('competence_date', startDate);
  }
  if (endDate) {
    query = query.lte('competence_date', endDate);
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
    return { error: { message: error.message, status: 500 } };
  }
  return { analyses };
}
