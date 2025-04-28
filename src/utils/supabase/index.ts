
// ---------------------------------------------------------------------
// Central export file for all Supabase utilities
// ---------------------------------------------------------------------

// Export common shared helpers
export * from './sharedHelpers';

// Export profile helpers
export { getProfile, updateProfile } from './profileHelpers';

// Export procedure helpers
export { 
  fetchProcedures, 
  searchProcedures,
  getProcedureById,
  fetchProceduresByAnalysisId,
  type ProcedureType,
  type ProcedureWithChildren,
  type DoctorParticipation
} from './procedureHelpers';

// Export help helpers
export * from './helpHelpers';

// Export analysis helpers (avoiding name conflicts)
export { 
  fetchAnalysisById,
  // Use a different name to avoid conflicts
  fetchProceduresByAnalysisId as fetchProceduresByAnalysisIdFromAnalysis
} from './analysisHelpers';
