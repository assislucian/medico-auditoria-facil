
/**
 * upload/index.ts
 * 
 * Ponto de entrada para os serviços relacionados a upload e processamento de arquivos.
 * Exporta funções e utilitários dos módulos específicos do serviço.
 */

// Exportar funcionalidades do serviço de edge
export { processFiles } from './edgeService';

// Exportar funcionalidades do serviço de storage
export { 
  uploadFilesToStorage,
  getFileUrl,
  downloadFile,
  deleteFile 
} from './storageService';

// Exportar funcionalidades do serviço de análise
export { 
  setCurrentAnalysis,
  getCurrentAnalysis,
  clearCurrentAnalysis,
  fetchAnalysisById 
} from './analysisService';
