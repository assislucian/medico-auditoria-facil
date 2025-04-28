
/**
 * historyService.ts
 * 
 * Service for managing analysis history operations.
 * This file re-exports functionality from the modular history services.
 */

export {
  fetchHistoryData,
  searchHistory,
  getAuditDetails as fetchAnalysisDetails,
  updateAnalysisStatus
} from './history';
