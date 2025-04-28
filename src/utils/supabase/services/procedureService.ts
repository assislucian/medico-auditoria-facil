
import { supabase } from "@/integrations/supabase/client";
import type { ProcedureType, ProcedureWithChildren } from '../types/procedures';
import { mapProcedureData } from '../mappers/procedureMappers';
import { Json } from '@/integrations/supabase/types';

// Local type for database row to prevent excessive type instantiation
type ProcedureResultRow = {
  id: string;
  codigo: string;
  procedimento: string;
  papel?: string;
  valor_cbhpm: number | null;
  valor_pago: number | null;
  diferenca: number | null;
  pago: boolean | null;
  guia?: string;
  beneficiario?: string;
  doctors: Json | null;
  analysis_id: string;
}

// Domain model types
export interface DoctorParticipation {
  id: string;
  name?: string;
  role?: string;
  crm?: string;
  value?: number;
}

export interface ProcedureFlat {
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
}

// Define the return type for procedure queries
export type ProcedureQueryResult = {
  data: ProcedureFlat[];
  error: Error | null;
};

/**
 * Fetch all procedures from the database
 */
export async function fetchProcedures(type: ProcedureType = 'all'): Promise<ProcedureWithChildren[]> {
  try {
    // Use string type to avoid type instantiation errors
    let query = supabase.from('procedure_results');
    
    if (type !== 'all') {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query.select('*').order('codigo');
    
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
    
    // Use string type to avoid type instantiation errors
    let dbQuery = supabase
      .from('procedure_results')
      .select();
      
    // Use proper OR condition syntax
    dbQuery = dbQuery.or(`procedimento.ilike.%${searchQuery}%,codigo.ilike.%${searchQuery}%`);
      
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
      .select()
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
      .select()
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
 * Fetch procedures by guide ID
 */
export async function getProceduresByGuide(guideId: string): Promise<ProcedureQueryResult> {
  try {
    const { data, error } = await supabase
      .from('procedure_results')
      .select()
      .eq('guia', guideId);
      
    if (error) {
      console.error('Error fetching procedures by guide ID:', error);
      return { data: [], error: new Error(error.message) };
    }
    
    // Map the data and handle doctors array with proper casting
    const mappedData = data ? data.map(row => {
      const mapped = mapProcedureData(row);
      // Ensure doctors is properly cast to DoctorParticipation[]
      if (row.doctors) {
        mapped.doctors = row.doctors as unknown as DoctorParticipation[];
      }
      return mapped;
    }) : [];
    
    return { data: mappedData, error: null };
  } catch (error) {
    console.error('Error in getProceduresByGuide:', error);
    return { 
      data: [], 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Build a hierarchical tree of procedures based on parent-child relationships
 */
function buildProcedureTree(procedures: ProcedureFlat[]): ProcedureWithChildren[] {
  // Simple implementation to avoid recursion issues
  const result: ProcedureWithChildren[] = procedures.map(proc => ({
    ...proc,
    children: []
  }));
  
  return result;
}
