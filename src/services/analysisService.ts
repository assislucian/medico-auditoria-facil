
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
  // Store in localStorage or state management
  localStorage.setItem('currentAnalysisId', analysisId);
  localStorage.setItem('currentAnalysisTimestamp', Date.now().toString());
};

/**
 * Get the extracted data from the server
 * @param analysisId Optional analysis ID to fetch specific data
 * @returns The extracted data
 */
export const getExtractedData = async (analysisId?: string | null): Promise<ExtractedData> => {
  console.log('Getting extracted data with analysisId:', analysisId);
  
  try {
    // If there's a valid analysisId, try to fetch it from the server
    if (analysisId) {
      console.log('Attempting to fetch analysis from database...');
      
      // Try to fetch the analysis from the backend
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
      
      // Get the procedure results
      const { data: proceduresData, error: proceduresError } = await supabase
        .from('procedures')
        .select('*')
        .eq('analysis_id', analysisId);
      
      if (proceduresError) {
        console.error('Error fetching procedures:', proceduresError);
        throw new Error('Failed to fetch procedure data');
      }
      
      console.log(`Fetched ${proceduresData.length} procedures`);
      
      if (analysisData && proceduresData) {
        // Transform database data to ExtractedData format
        const extractedData: ExtractedData = {
          demonstrativoInfo: {
            numero: analysisData.numero || '',
            competencia: analysisData.competencia || '',
            hospital: analysisData.hospital || '',
            data: new Date(analysisData.created_at).toLocaleDateString('pt-BR'),
            beneficiario: proceduresData[0]?.beneficiario || ''
          },
          procedimentos: proceduresData.map(proc => {
            // Ensure doctors field is properly typed
            const doctors: DoctorParticipation[] = Array.isArray(proc.doctors) 
              ? proc.doctors as DoctorParticipation[] 
              : [];
              
            return {
              id: proc.id,
              codigo: proc.codigo,
              procedimento: proc.procedimento,
              papel: proc.papel || '',
              valorCBHPM: proc.valor_cbhpm,
              valorPago: proc.valor_pago,
              diferenca: proc.diferenca,
              pago: proc.pago,
              guia: proc.guia || '',
              beneficiario: proc.beneficiario || '',
              doctors
            };
          }),
          totais: {
            valorCBHPM: analysisData.summary?.totalCBHPM ? Number(analysisData.summary.totalCBHPM) : 0,
            valorPago: analysisData.summary?.totalPago ? Number(analysisData.summary.totalPago) : 0,
            diferenca: analysisData.summary?.totalDiferenca ? Number(analysisData.summary.totalDiferenca) : 0,
            procedimentosNaoPagos: analysisData.summary?.procedimentosNaoPagos ? Number(analysisData.summary.procedimentosNaoPagos) : 0
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
