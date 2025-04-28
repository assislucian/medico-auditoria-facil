
import { supabase } from "@/integrations/supabase/client";
import { Procedure } from '@/types/medical';

/**
 * Utilities for dealing with medical procedures
 */

// Define procedure types
export type ProcedureType = 'all' | 'surgical' | 'clinical' | 'diagnostic';

// Define a separate interface for procedures with children to avoid circular dependency
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
  
  // Map database fields to our Procedure type before building the tree
  const proceduresData = data ? data.map(item => ({
    id: item.id,
    codigo: item.codigo,
    procedimento: item.procedimento,
    papel: item.papel,
    valorCBHPM: item.valor_cbhpm,
    valorPago: item.valor_pago,
    diferenca: item.diferenca,
    pago: item.pago,
    guia: item.guia,
    beneficiario: item.beneficiario,
    doctors: item.doctors || []
  })) : [];
  
  return buildProcedureTree(proceduresData);
}

/**
 * Build a hierarchical tree of procedures based on parent-child relationships
 */
function buildProcedureTree(procedures: ProcedureWithChildren[]): ProcedureWithChildren[] {
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
    
    // In this implementation we're treating all procedures as root procedures
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
  
  // Map database fields to our Procedure type
  return data ? data.map(item => ({
    id: item.id,
    codigo: item.codigo,
    procedimento: item.procedimento,
    papel: item.papel || '',
    valorCBHPM: item.valor_cbhpm || 0,
    valorPago: item.valor_pago || 0,
    diferenca: item.diferenca || 0,
    pago: !!item.pago,
    guia: item.guia || '',
    beneficiario: item.beneficiario || '',
    doctors: item.doctors || []
  })) : [];
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
  
  // Map database fields to our Procedure type
  return {
    id: data.id,
    codigo: data.codigo,
    procedimento: data.procedimento,
    papel: data.papel || '',
    valorCBHPM: data.valor_cbhpm || 0,
    valorPago: data.valor_pago || 0,
    diferenca: data.diferenca || 0,
    pago: !!data.pago,
    guia: data.guia || '',
    beneficiario: data.beneficiario || '',
    doctors: data.doctors || []
  };
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
  
  // Map database fields to our Procedure type
  return data ? data.map(item => ({
    id: item.id,
    codigo: item.codigo,
    procedimento: item.procedimento,
    papel: item.papel || '',
    valorCBHPM: item.valor_cbhpm || 0,
    valorPago: item.valor_pago || 0,
    diferenca: item.diferenca || 0,
    pago: !!item.pago,
    guia: item.guia || '',
    beneficiario: item.beneficiario || '',
    doctors: item.doctors || []
  })) : [];
}
