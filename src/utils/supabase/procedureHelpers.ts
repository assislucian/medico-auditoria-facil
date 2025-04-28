
import { supabase } from "@/integrations/supabase/client";
import { Procedure } from '@/types/medical';

/**
 * Utilities for dealing with medical procedures
 */

// Define procedure types
export type ProcedureType = 'all' | 'surgical' | 'clinical' | 'diagnostic';

// Avoid circular type dependencies by properly defining the interface without recursion
export interface ProcedureWithChildren {
  id: string;
  codigo: string;
  procedimento: string;
  papel?: string;
  valorCBHPM: number;
  valorPago: number;
  diferenca: number;
  pago: boolean;
  guia?: string;
  beneficiario?: string;
  doctors: any[];
  children?: ProcedureWithChildren[] | null;
}

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
  
  return buildProcedureTree(data as Procedure[] || []);
}

/**
 * Build a hierarchical tree of procedures based on parent-child relationships
 */
function buildProcedureTree(procedures: Procedure[]): ProcedureWithChildren[] {
  // Create a map for fast lookups
  const procedureMap = new Map<string, ProcedureWithChildren>();
  
  // Initialize the map with all procedures
  procedures.forEach(proc => {
    procedureMap.set(proc.id, { ...proc, children: [] });
  });
  
  // Build the tree structure
  const rootProcedures: ProcedureWithChildren[] = [];
  
  procedures.forEach(proc => {
    const procedure = procedureMap.get(proc.id);
    
    if (!procedure) return;
    
    // Check if this procedure has a hierarchical relationship
    // Note: We're removing parent_id checks since it doesn't exist in the Procedure type
    // Instead, we're treating all procedures as root procedures for now
    rootProcedures.push(procedure);
  });
  
  return rootProcedures;
}

/**
 * Search for procedures by name, code or description
 */
export async function searchProcedures(query: string, type?: ProcedureType): Promise<Procedure[]> {
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
  
  return data as unknown as Procedure[];
}

/**
 * Get a procedure by ID
 */
export async function getProcedureById(id: string): Promise<Procedure | null> {
  const { data, error } = await supabase
    .from('procedure_results')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching procedure:', error);
    return null;
  }
  
  return data as unknown as Procedure;
}

/**
 * Fetch procedures by analysis ID
 */
export async function fetchProceduresByAnalysisId(analysisId: string): Promise<Procedure[]> {
  const { data, error } = await supabase
    .from('procedure_results')
    .select('*')
    .eq('analysis_id', analysisId);
    
  if (error) {
    console.error('Error fetching procedures by analysis ID:', error);
    return [];
  }
  
  return data as unknown as Procedure[];
}
