
// ---------------------------------------------------------------------
// Re-export all helper modules (no name conflicts)
// ---------------------------------------------------------------------
// Export everything from profileHelpers
export * from './profileHelpers';
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
  sendTicketMessage,
  TicketData
};
