
import { supabase } from '@/integrations/supabase/client';
import { ExtractedData, DoctorParticipation } from '@/types/upload';
import { toast } from 'sonner';

/**
 * Generate simulated data for demonstration purposes when backend is not available
 * @returns Mocked extracted data
 */
const generateMockData = (): ExtractedData => {
  return {
    demonstrativoInfo: {
      numero: 'DM' + Math.floor(Math.random() * 100000),
      competencia: 'Outubro/2024',
      hospital: 'Hospital São Lucas',
      data: '15/10/2024',
      beneficiario: 'Paciente Exemplo'
    },
    procedimentos: [
      {
        id: '1',
        codigo: '30602246',
        procedimento: 'Reconstrução Mamária Com Retalhos Cutâneos Regionais',
        papel: 'Cirurgião',
        valorCBHPM: 3200.50,
        valorPago: 2800.00,
        diferenca: -400.50,
        pago: true,
        guia: '10467538',
        beneficiario: 'THAYSE BORGES',
        doctors: [
          {
            code: '8425',
            name: 'FERNANDA MABEL BATISTA DE AQUINO',
            role: 'Cirurgião',
            startTime: '19/08/2024 14:09',
            endTime: '19/08/2024 15:24',
            status: 'Fechada'
          },
          {
            code: '6091',
            name: 'MOISES DE OLIVEIRA SCHOTS',
            role: 'Primeiro Auxiliar',
            startTime: '19/08/2024 14:15',
            endTime: '19/08/2024 15:17',
            status: 'Fechada'
          }
        ]
      },
      {
        id: '2',
        codigo: '30602076',
        procedimento: 'Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll',
        papel: 'Cirurgião',
        valorCBHPM: 1800.75,
        valorPago: 0,
        diferenca: -1800.75,
        pago: false,
        guia: '10467538',
        beneficiario: 'THAYSE BORGES',
        doctors: [
          {
            code: '8425',
            name: 'FERNANDA MABEL BATISTA DE AQUINO',
            role: 'Cirurgião',
            startTime: '19/08/2024 14:09',
            endTime: '19/08/2024 15:24',
            status: 'Fechada'
          }
        ]
      },
      {
        id: '3',
        codigo: '31602096',
        procedimento: 'Consulta em Cirurgia Plástica',
        papel: 'Cirurgião',
        valorCBHPM: 200.00,
        valorPago: 200.00,
        diferenca: 0,
        pago: true,
        guia: '10467539',
        beneficiario: 'THAYSE BORGES',
        doctors: [
          {
            code: '8425',
            name: 'FERNANDA MABEL BATISTA DE AQUINO',
            role: 'Cirurgião',
            startTime: '19/08/2024 13:00',
            endTime: '19/08/2024 13:15',
            status: 'Fechada'
          }
        ]
      }
    ],
    totais: {
      valorCBHPM: 5201.25,
      valorPago: 3000.00,
      diferenca: -2201.25,
      procedimentosNaoPagos: 1
    }
  };
};

/**
 * Set the current analysis in storage for later retrieval
 */
export const setCurrentAnalysis = (extractedData: ExtractedData, analysisId: string) => {
  // Store in localStorage
  localStorage.setItem('currentAnalysisId', analysisId);
  localStorage.setItem('currentAnalysisTimestamp', Date.now().toString());
  
  // For local analysis, store the full data too
  if (analysisId.startsWith('local-')) {
    localStorage.setItem(`extractedData-${analysisId}`, JSON.stringify(extractedData));
  }
};

/**
 * Get a local analysis from localStorage
 */
export const getLocalAnalysis = (analysisId: string): ExtractedData | null => {
  try {
    const storedData = localStorage.getItem(`extractedData-${analysisId}`);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error retrieving local analysis:', error);
  }
  return null;
};

/**
 * Type guard to check if the value is a valid DoctorParticipation array
 */
const isDoctorParticipationArray = (value: any): value is DoctorParticipation[] => {
  if (!Array.isArray(value)) return false;
  
  return value.every(item => 
    typeof item === 'object' && 
    item !== null &&
    'code' in item && 
    'name' in item && 
    'role' in item && 
    'startTime' in item &&
    'endTime' in item &&
    'status' in item
  );
};

/**
 * Helper function to safely extract numeric values from JSON summary
 */
const getSafeNumericValue = (summary: any, key: string): number => {
  if (!summary || typeof summary !== 'object') return 0;
  
  const value = summary[key];
  if (value === undefined || value === null) return 0;
  
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

/**
 * Get the extracted data from the server
 * @param analysisId Optional analysis ID to fetch specific data
 * @returns The extracted data
 */
export const getExtractedData = async (analysisId?: string | null): Promise<ExtractedData> => {
  console.log('Getting extracted data with analysisId:', analysisId);
  
  try {
    // For "local-" prefixed IDs, retrieve from localStorage
    if (analysisId && analysisId.startsWith('local-')) {
      console.log('Retrieving local analysis data');
      const localData = getLocalAnalysis(analysisId);
      if (localData) {
        return localData;
      }
      // If local data not found, continue with mock data as fallback
    }

    // If there's a valid analysisId, try to fetch it from the server
    if (analysisId && !analysisId.startsWith('local-')) {
      console.log('Attempting to fetch analysis from database...');
      
      // First query the analysis_results table
      const { data: analysisData, error: analysisError } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('id', analysisId)
        .single();
      
      if (analysisError) {
        console.error('Error fetching analysis:', analysisError);
        throw new Error('Failed to fetch analysis data');
      }
      
      console.log('Fetched analysis:', analysisData);
      
      // Then query the related procedure_results
      const { data: proceduresData, error: proceduresError } = await supabase
        .from('procedure_results')
        .select('*')
        .eq('analysis_id', analysisId);
      
      if (proceduresError) {
        console.error('Error fetching procedures:', proceduresError);
        throw new Error('Failed to fetch procedure data');
      }
      
      console.log(`Fetched ${proceduresData.length} procedures`);
      
      if (analysisData && proceduresData && proceduresData.length > 0) {
        // Transform database data to ExtractedData format
        const extractedData: ExtractedData = {
          demonstrativoInfo: {
            numero: analysisData.numero || '',
            competencia: analysisData.competencia || '',
            hospital: analysisData.hospital || '',
            data: new Date(analysisData.created_at).toLocaleDateString('pt-BR'),
            beneficiario: proceduresData[0]?.beneficiario || 'Paciente'
          },
          procedimentos: proceduresData.map(proc => {
            // Process doctors with proper type safety
            let doctors: DoctorParticipation[] = [];
            
            if (proc.doctors) {
              if (isDoctorParticipationArray(proc.doctors)) {
                doctors = proc.doctors;
              } else if (Array.isArray(proc.doctors)) {
                // Convert each item to the expected format with explicit type casting
                doctors = (proc.doctors as any[])
                  .filter(d => 
                    typeof d === 'object' && 
                    d !== null &&
                    'code' in d && 
                    'name' in d && 
                    'role' in d &&
                    'startTime' in d &&
                    'endTime' in d &&
                    'status' in d
                  )
                  .map(d => ({
                    code: String(d.code || ''),
                    name: String(d.name || ''),
                    role: String(d.role || ''),
                    startTime: String(d.startTime || ''),
                    endTime: String(d.endTime || ''),
                    status: String(d.status || '')
                  }));
              }
            }
              
            return {
              id: proc.id,
              codigo: proc.codigo,
              procedimento: proc.procedimento,
              papel: proc.papel || '',
              valorCBHPM: proc.valor_cbhpm || 0,
              valorPago: proc.valor_pago || 0,
              diferenca: proc.diferenca || 0,
              pago: !!proc.pago,
              guia: proc.guia || '',
              beneficiario: proc.beneficiario || '',
              doctors
            };
          }),
          totais: {
            valorCBHPM: getSafeNumericValue(analysisData.summary, 'totalCBHPM'),
            valorPago: getSafeNumericValue(analysisData.summary, 'totalPago'),
            diferenca: getSafeNumericValue(analysisData.summary, 'totalDiferenca'),
            procedimentosNaoPagos: getSafeNumericValue(analysisData.summary, 'procedimentosNaoPagos')
          }
        };
        
        console.log('Successfully transformed data:', extractedData);
        return extractedData;
      }
    }
    
    console.log('Generating mock data as fallback');
    return generateMockData();
  } catch (error) {
    console.error('Error in getExtractedData:', error);
    toast.error('Erro ao carregar dados da análise', {
      description: 'Usando dados de demonstração.',
    });
    return generateMockData();
  }
};
