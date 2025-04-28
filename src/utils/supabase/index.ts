
// ---------------------------------------------------------------------
// Re-export all helper modules (no name conflicts)
// ---------------------------------------------------------------------
// Export everything from profileHelpers
export { getProfile, updateProfile, toJson } from './profileHelpers';

// Export everything from queryHelpers
export * from './queryHelpers';

// Export everything from procedureHelpers
export * from './procedureHelpers';

// Export everything from analysisHelpers
export * from './analysisHelpers';

// Export everything from helpHelpers
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
