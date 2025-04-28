
// ---------------------------------------------------------------------
// Re-export all helper modules (no name conflicts)
// ---------------------------------------------------------------------
// Export everything from profileHelpers
export { getProfile, updateProfile, toJson } from './profileHelpers';

// Export everything from queryHelpers
export * from './queryHelpers';

// Export everything from procedureHelpers
export * from './procedureHelpers';

// Export everything from helpHelpers
export * from './helpHelpers';

// Rename and export analysisHelpers functions to avoid conflicts
export { 
  fetchAnalysisById,
  // Rename this function to avoid conflict with procedureHelpers.ts
  fetchProceduresByAnalysisId as fetchProceduresByAnalysisIdFromAnalysis
} from './analysisHelpers';

// ---------------------------------------------------------------------
// Re-export functions from supabaseHelpers that aren't already exported
// ---------------------------------------------------------------------
import {
  fetchHelpArticles,
  fetchUserTickets,
  fetchTicketMessages,
  createSupportTicket,
  sendTicketMessage,
  TicketData
} from './supabaseHelpers';

export {
  fetchHelpArticles,
  fetchUserTickets,
  fetchTicketMessages,
  createSupportTicket,
  sendTicketMessage
};

// Type re-export
export type { TicketData };
