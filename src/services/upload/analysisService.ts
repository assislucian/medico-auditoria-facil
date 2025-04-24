
/**
 * Set current analysis data (ID and extracted data)
 */
export function setCurrentAnalysis(extractedData: any, analysisId: string) {
  console.log('Setting current analysis:', analysisId);
  
  localStorage.setItem('currentAnalysisId', analysisId);
  localStorage.setItem('currentAnalysisTimestamp', Date.now().toString());
  
  // Store extracted data for local fallback
  if (analysisId.startsWith('local-')) {
    localStorage.setItem(`extractedData-${analysisId}`, JSON.stringify(extractedData));
  }
}

// Helper function to safely get numeric values from JSON data
function getSafeNumericValue(data: any, property: string): number {
  if (!data || typeof data !== 'object') {
    return 0;
  }
  
  // Handle array vs object data
  if (Array.isArray(data)) {
    return 0; // Arrays don't have the expected properties
  }
  
  const value = data[property];
  
  if (value === undefined || value === null) {
    return 0;
  }
  
  const numericValue = Number(value);
  return isNaN(numericValue) ? 0 : numericValue;
}

// Export the helper function for use elsewhere
export { getSafeNumericValue };
