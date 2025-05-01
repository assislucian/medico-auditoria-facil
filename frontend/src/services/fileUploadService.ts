import { FileWithStatus, FileType } from "@/types/upload";
import { determineProcessingMode } from "./uploadModeUtils";
import { processWithEdgeFunction } from "./fileUploadEdge";
import { createSimulatedResults } from "./simulatedUploadService";
import axios from 'axios';

/**
 * Service for processing uploaded files
 */
export const FileUploadService = () => {

  /**
   * Process uploaded files
   * Tries Edge Function first, then falls back to simulated results
   */
  const processUploadedFiles = async (
    files: FileWithStatus[],
    setProgress?: (progress: number) => void,
    setStage?: (stage: string) => void,
    setMsg?: (msg: string) => void,
    crmRegistrado?: string,
    fileTypes?: FileType[]
  ) => {
    // Novo: upload individual para cada arquivo
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const fileWithStatus = files[i];
      const formData = new FormData();
      formData.append('file', fileWithStatus.file, fileWithStatus.name);
      if (crmRegistrado) formData.append('crm', crmRegistrado);
      // Adicione outros campos se necessário (ex: periodo, lote)
      try {
        if (setProgress) setProgress(Math.round((i / files.length) * 100));
        if (setStage) setStage('uploading');
        if (setMsg) setMsg(`Enviando arquivo ${fileWithStatus.name} (${i+1}/${files.length})...`);
        const response = await axios.post('/api/v1/demonstrativos/upload', formData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        results.push({ success: true, ...response.data });
      } catch (err) {
        results.push({ success: false, error: err, file: fileWithStatus.name });
      }
    }
    if (setProgress) setProgress(100);
    if (setStage) setStage('complete');
    if (setMsg) setMsg('Processamento concluído!');
    return results;
  };
  
  return {
    determineProcessingMode,
    processUploadedFiles
  };
};
