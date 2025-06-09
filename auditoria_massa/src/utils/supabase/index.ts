
// ---------------------------------------------------------------------
// Re-exporta MÓDULOS ESPECÍFICOS (sem conflitos de nomes)
// ---------------------------------------------------------------------
export * from './profileHelpers';
export * from './queryHelpers';
export * from './procedureHelpers';
export * from './analysisHelpers';
export * from './helpHelpers';

// ---------------------------------------------------------------------
// Re-exporta, um-a-um, as funções que vivem em supabaseHelpers
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
// Re-exporta o **tipo** TicketData — precisa da palavra-chave `type`
// para não disparar o erro TS1205 quando `isolatedModules` estiver ativo.
// ---------------------------------------------------------------------
export type { TicketData } from './supabaseHelpers';
