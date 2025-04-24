
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
