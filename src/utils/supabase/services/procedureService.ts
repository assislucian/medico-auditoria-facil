
import { supabase } from "@/integrations/supabase/client";
import { ProcedureType, ProcedureFlat, ProcedureWithChildren } from '../types/procedures';
import { mapProcedureData } from '../mappers/procedureMappers';
import { safeDbQuery } from '../sharedHelpers';

/**
 * Fetch all procedures from the database
 */
export async function fetchProcedures(type: ProcedureType = 'all'): Promise<ProcedureWithChildren[]> {
  let query = supabase.from('procedure_results').select('*');
  
  if (type !== 'all') {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query.order('codigo');
  
  if (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
  
  const proceduresData = data ? data.map(mapProcedureData) : [];
  return buildProcedureTree(proceduresData);
}

/**
 * Search for procedures by name, code or description
 */
export async function searchProcedures(query: string, type?: ProcedureType): Promise<ProcedureFlat[]> {
  const searchQuery = query.toLowerCase();
  
  let dbQuery = supabase
    .from('procedure_results')
    .select('*')
    .or(`procedimento.ilike.%${searchQuery}%,codigo.ilike.%${searchQuery}%`);
    
  if (type) {
    dbQuery = dbQuery.eq('type', type);
  }
  
  const { data, error } = await dbQuery.limit(20);
  
  if (error) {
    console.error('Error searching procedures:', error);
    return [];
  }
  
  return data ? data.map(mapProcedureData) : [];
}

/**
 * Get a procedure by ID
 */
export async function getProcedureById(id: string): Promise<ProcedureFlat | null> {
  const { data, error } = await supabase
    .from('procedure_results')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching procedure:', error);
    return null;
  }
  
  return mapProcedureData(data);
}

/**
 * Fetch procedures by analysis ID
 */
export async function fetchProceduresByAnalysisId(analysisId: string): Promise<ProcedureFlat[]> {
  const { data, error } = await supabase
    .from('procedure_results')
    .select('*')
    .eq('analysis_id', analysisId);
    
  if (error) {
    console.error('Error fetching procedures by analysis ID:', error);
    return [];
  }
  
  return data ? data.map(mapProcedureData) : [];
}

/**
 * Build a hierarchical tree of procedures based on parent-child relationships
 */
function buildProcedureTree(procedures: ProcedureFlat[]): ProcedureWithChildren[] {
  const procedureMap = new Map<string, ProcedureWithChildren>();
  
  procedures.forEach(proc => {
    procedureMap.set(proc.id, { ...proc, children: [] });
  });
  
  const rootProcedures: ProcedureWithChildren[] = [];
  
  procedures.forEach(proc => {
    const procedure = procedureMap.get(proc.id);
    if (!procedure) return;
    rootProcedures.push(procedure);
  });
  
  return rootProcedures;
}
