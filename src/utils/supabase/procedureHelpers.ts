
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';

/**
 * Utilities for dealing with medical procedures
 */

// Define procedure types
export type ProcedureType = 'all' | 'surgical' | 'clinical' | 'diagnostic';

// Define a DoctorParticipation type to use with procedures
export interface DoctorParticipation {
  id: string;
  name?: string;
  role?: string;
  crm?: string;
  value?: number;
}

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
  doctors: DoctorParticipation[];
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
    valorCBHPM: item.valor_cbhpm || 0,
    valorPago: item.valor_pago || 0,
    diferenca: item.diferenca || 0,
    pago: !!item.pago,
    guia: item.guia,
    beneficiario: item.beneficiario,
    doctors: mapDoctorsData(item.doctors)
  })) : [];
  
  return buildProcedureTree(proceduresData);
}

/**
 * Helper function to safely map doctors data
 */
function mapDoctorsData(doctorsData: Json | null): DoctorParticipation[] {
  if (!doctorsData) return [];
  
  if (Array.isArray(doctorsData)) {
    return doctorsData.map(doctor => ({
      id: typeof doctor.id === 'string' ? doctor.id : '',
      name: typeof doctor.name === 'string' ? doctor.name : undefined,
      role: typeof doctor.role === 'string' ? doctor.role : undefined,
      crm: typeof doctor.crm === 'string' ? doctor.crm : undefined,
      value: typeof doctor.value === 'number' ? doctor.value : undefined
    }));
  }
  
  return [];
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
export async function searchProcedures(query: string, type?: ProcedureType): Promise<ProcedureWithChildren[]> {
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
    doctors: mapDoctorsData(item.doctors)
  })) : [];
}

/**
 * Get a procedure by ID
 */
export async function getProcedureById(id: string): Promise<ProcedureWithChildren | null> {
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
    doctors: mapDoctorsData(data.doctors)
  };
}

/**
 * Fetch procedures by analysis ID
 */
export async function fetchProceduresByAnalysisId(analysisId: string): Promise<ProcedureWithChildren[]> {
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
    doctors: mapDoctorsData(item.doctors)
  })) : [];
}
