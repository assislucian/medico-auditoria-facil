
// Re-export all helper modules but handle name conflicts by using explicit re-exports
export * from './profileHelpers';
export * from './queryHelpers';
export * from './procedureHelpers';
export * from './analysisHelpers';
export * from './helpHelpers';

// Import supabaseHelpers and re-export with renamed conflicting exports to avoid ambiguity
import {
  getProfile,
  updateProfile as updateProfileBase,
  toJson as toJsonBase,
  fetchProceduresByAnalysisId as fetchProceduresByAnalysisIdBase,
  fetchHelpArticles as fetchHelpArticlesBase,
  fetchUserTickets,
  fetchTicketMessages,
  createSupportTicket,
  sendTicketMessage,
  TicketData
} from './supabaseHelpers';

// Re-export with renamed exports to avoid conflicts
export {
  getProfile,
  updateProfileBase,
  toJsonBase,
  fetchProceduresByAnalysisIdBase,
  fetchUserTickets,
  fetchTicketMessages,
  createSupportTicket,
  sendTicketMessage,
  TicketData
};
