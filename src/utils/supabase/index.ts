
// ---------------------------------------------------------------------
// Re-export SPECIFIC MODULES (no name conflicts)
// ---------------------------------------------------------------------
export * from './profileHelpers';
export * from './queryHelpers';
export * from './procedureHelpers';
export * from './analysisHelpers';
export * from './helpHelpers';

// ---------------------------------------------------------------------
// Re-export functions from supabaseHelpers one by one
// ---------------------------------------------------------------------
import {
  getProfile,
  updateProfile,
  toJson,
  fetchProceduresByAnalysisId,
  fetchHelpArticles,
  fetchUserTickets,
  fetchTicketMessages,
  createSupportTicket,
  sendTicketMessage,
  fetchAnalysisById,
} from './supabaseHelpers';

export {
  getProfile,
  updateProfile,
  toJson,
  fetchProceduresByAnalysisId,
  fetchHelpArticles,
  fetchUserTickets,
  fetchTicketMessages,
  createSupportTicket,
  sendTicketMessage,
  fetchAnalysisById,
};

// ---------------------------------------------------------------------
// Re-export the **type** TicketData — needs `type` keyword
// to avoid TS1205 when `isolatedModules` is active.
// ---------------------------------------------------------------------
export type { TicketData } from './supabaseHelpers';
