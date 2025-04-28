
import { supabase } from "@/integrations/supabase/client";
import type { ProcedureType, ProcedureFlat, ProcedureWithChildren } from '../types/procedures';
import { mapProcedureData } from '../mappers/procedureMappers';
import { safeDbQuery } from '../sharedHelpers';

/**
 * Fetch all procedures from the database
 */
export async function fetchProcedures(type: ProcedureType = 'all'): Promise<ProcedureWithChildren[]> {
  try {
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
  } catch (error) {
    console.error('Error in fetchProcedures:', error);
    return [];
  }
}

/**
 * Search for procedures by name, code or description
 */
export async function searchProcedures(query: string, type?: ProcedureType): Promise<ProcedureFlat[]> {
  try {
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
  } catch (error) {
    console.error('Error in searchProcedures:', error);
    return [];
  }
}

/**
 * Get a procedure by ID
 */
export async function getProcedureById(id: string): Promise<ProcedureFlat | null> {
  try {
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
  } catch (error) {
    console.error('Error in getProcedureById:', error);
    return null;
  }
}

/**
 * Fetch procedures by analysis ID
 */
export async function fetchProceduresByAnalysisId(analysisId: string): Promise<ProcedureFlat[]> {
  try {
    const { data, error } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);
      
    if (error) {
      console.error('Error fetching procedures by analysis ID:', error);
      return [];
    }
    
    return data ? data.map(mapProcedureData) : [];
  } catch (error) {
    console.error('Error in fetchProceduresByAnalysisId:', error);
    return [];
  }
}

/**
 * Build a hierarchical tree of procedures based on parent-child relationships
 */
function buildProcedureTree(procedures: ProcedureFlat[]): ProcedureWithChildren[] {
  // Create a map of all procedures by their ID
  const procedureMap = new Map<string, ProcedureWithChildren>();
  
  // First pass: Initialize the map with all procedures
  procedures.forEach(proc => {
    procedureMap.set(proc.id, { ...proc, children: [] });
  });
  
  // Second pass: Build the tree structure
  const rootProcedures: ProcedureWithChildren[] = [];
  
  // Add all procedures as root level since we're not handling parent-child relationships yet
  procedures.forEach(proc => {
    const procedure = procedureMap.get(proc.id);
    if (!procedure) return;
    rootProcedures.push(procedure);
  });
  
  return rootProcedures;
}
