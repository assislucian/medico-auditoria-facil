
// Re-export types from their source files to avoid ambiguity
export type { ProcedureType, ProcedureWithChildren } from './types/procedures';

// Export from procedureService directly to avoid duplicated exports
export {
  fetchProcedures,
  searchProcedures,
  getProcedureById,
  fetchProceduresByAnalysisId,
  getProceduresByGuide,
  type DoctorParticipation,
  type ProcedureFlat,
  type ProcedureQueryResult
} from './services/procedureService';
