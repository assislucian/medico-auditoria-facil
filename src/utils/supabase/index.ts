
// ---------------------------------------------------------------------
// Re-export all helper modules (no name conflicts)
// ---------------------------------------------------------------------
export * from './profileHelpers';
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
  sendTicketMessage
} from './supabaseHelpers';

export {
  fetchHelpArticles,
  fetchUserTickets,
  fetchTicketMessages,
  createSupportTicket,
  sendTicketMessage
};

// ---------------------------------------------------------------------
// Re-export the TicketData type
// ---------------------------------------------------------------------
export type { TicketData } from './supabaseHelpers';
