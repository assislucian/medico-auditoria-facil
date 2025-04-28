
// ---------------------------------------------------------------------
// Re-export all helper modules (no name conflicts)
// ---------------------------------------------------------------------
// Export everything from profileHelpers
import { getProfile, updateProfile, toJson as profileToJson } from './profileHelpers';
export { getProfile, updateProfile };
// Explicitly export toJson from profileHelpers with a renamed export to avoid ambiguity
export { profileToJson as toJson };

// Export everything from queryHelpers
export * from './queryHelpers';

// Explicitly re-export from procedureHelpers to avoid ambiguity
import { fetchProceduresByAnalysisId as fetchProcedures } from './procedureHelpers';
export { fetchProcedures };
export * from './analysisHelpers';
export * from './helpHelpers';

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
