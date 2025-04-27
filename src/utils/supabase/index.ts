
// ---------------------------------------------------------------------
// Re-export all helper modules (no name conflicts)
// ---------------------------------------------------------------------
export * from './profileHelpers';
export * from './queryHelpers';
export * from './procedureHelpers';
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
  toJson,
  TicketData
} from './supabaseHelpers';

export {
  fetchHelpArticles,
  fetchUserTickets,
  fetchTicketMessages,
  createSupportTicket,
  sendTicketMessage,
  toJson
};

// ---------------------------------------------------------------------
// Re-export the TicketData type
// ---------------------------------------------------------------------
export type { TicketData };
