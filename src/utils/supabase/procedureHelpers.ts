
import { supabase } from "@/integrations/supabase/client";
import { Procedure, ProcedureType } from '@/types';

/**
 * Utilities for dealing with medical procedures
 */

// Avoid circular type dependencies by properly defining the interface without recursion
export interface ProcedureWithChildren extends Procedure {
  children?: ProcedureWithChildren[] | null;
}

/**
 * Fetch all procedures from the database
 */
export async function fetchProcedures(type: ProcedureType = 'all'): Promise<ProcedureWithChildren[]> {
  let query = supabase.from('procedures').select('*');
  
  if (type !== 'all') {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query.order('code');
  
  if (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
  
  return buildProcedureTree(data || []);
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
    
    if (proc.parent_id) {
      const parent = procedureMap.get(proc.parent_id);
      
      if (parent && parent.children) {
        parent.children.push(procedure);
      } else {
        rootProcedures.push(procedure);
      }
    } else {
      rootProcedures.push(procedure);
    }
  });
  
  return rootProcedures;
}

/**
 * Search for procedures by name, code or description
 */
export async function searchProcedures(query: string, type?: ProcedureType): Promise<Procedure[]> {
  const searchQuery = query.toLowerCase();
  
  let dbQuery = supabase
    .from('procedures')
    .select('*')
    .or(`name.ilike.%${searchQuery}%,code.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    
  if (type) {
    dbQuery = dbQuery.eq('type', type);
  }
  
  const { data, error } = await dbQuery.limit(20);
  
  if (error) {
    console.error('Error searching procedures:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get a procedure by ID
 */
export async function getProcedureById(id: string): Promise<Procedure | null> {
  const { data, error } = await supabase
    .from('procedures')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching procedure:', error);
    return null;
  }
  
  return data;
}
