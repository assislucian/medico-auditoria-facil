
import { ExtractedData } from '@/types/upload';
import { supabase } from '@/integrations/supabase/client';

// Store the extracted data in memory for components to access
let currentExtractedData: ExtractedData | null = null;
let currentAnalysisId: string | null = null;

/**
 * Sets the current analysis data and ID
 * 
 * @param data Extracted data from analysis
 * @param id Analysis ID
 */
export function setCurrentAnalysis(data: ExtractedData, id: string | null) {
  currentExtractedData = data;
  currentAnalysisId = id;
}

/**
 * Gets the extracted data from the last analysis
 * 
 * @returns Promise resolving to extracted data
 */
export async function getExtractedData(): Promise<ExtractedData | null> {
  // If we have data in memory, return it
  if (currentExtractedData) {
    return currentExtractedData;
  }
  
  // If we have an analysis ID, try to fetch it from Supabase
  if (currentAnalysisId && !currentAnalysisId.startsWith('local-')) {
    try {
      const { data, error } = await supabase.functions.invoke('get-analysis', {
        body: { analysisId: currentAnalysisId }
      });
      
      if (!error && data) {
        currentExtractedData = data;
        return data;
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    }
  }
  
  // No data available
  return null;
}

/**
 * Gets the current analysis ID
 * 
 * @returns Current analysis ID or null
 */
export function getCurrentAnalysisId(): string | null {
  return currentAnalysisId;
}
