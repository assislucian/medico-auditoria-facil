
import { ExtractedData } from '@/types/upload';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get fallback comparison data from database when edge function fails
 */
export const getFallbackComparisonData = async (analysisId: string): Promise<ExtractedData | null> => {
  try {
    // Get analysis result
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (analysisError) {
      console.error('Error fetching analysis:', analysisError);
      return null;
    }

    // Get procedure results
    const { data: procedureData, error: procedureError } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);

    if (procedureError) {
      console.error('Error fetching procedures:', procedureError);
      return null;
    }

    // Transform data to ExtractedData format
    const extractedData: ExtractedData = {
      demonstrativoInfo: {
        numero: analysisData.numero || '',
        competencia: analysisData.competencia || '',
        hospital: analysisData.hospital || '',
        data: new Date(analysisData.created_at).toLocaleDateString('pt-BR'),
        beneficiario: procedureData[0]?.beneficiario || ''
      },
      procedimentos: procedureData.map(proc => ({
        id: proc.id,
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        papel: proc.papel || '',
        valorCBHPM: proc.valor_cbhpm || 0,
        valorPago: proc.valor_pago || 0,
        diferenca: proc.diferenca || 0,
        pago: proc.pago || false,
        guia: proc.guia || '',
        beneficiario: proc.beneficiario || '',
        doctors: Array.isArray(proc.doctors) ? proc.doctors : []
      })),
      totais: {
        valorCBHPM: analysisData.summary?.totalCBHPM || 0,
        valorPago: analysisData.summary?.totalPago || 0,
        diferenca: analysisData.summary?.totalDiferenca || 0,
        procedimentosNaoPagos: analysisData.summary?.procedimentosNaoPagos || 0
      }
    };

    return extractedData;
  } catch (error) {
    console.error('Error in getFallbackComparisonData:', error);
    return null;
  }
};

/**
 * Create simulation data for local development
 */
export const createSimulationData = (): ExtractedData => {
  // Generate some mock data
  return {
    demonstrativoInfo: {
      numero: 'SIM-12345',
      competencia: '04/2023',
      hospital: 'Hospital Simulado',
      data: new Date().toLocaleDateString('pt-BR'),
      beneficiario: 'Paciente Simulado'
    },
    procedimentos: Array(5).fill(null).map((_, i) => ({
      id: `sim-${i}`,
      codigo: `${10000 + i}`,
      procedimento: `Procedimento Simulado ${i + 1}`,
      papel: i % 2 === 0 ? 'Cirurgião' : 'Anestesista',
      valorCBHPM: 1000 + (i * 100),
      valorPago: (800 + (i * 70)) * (i % 3 === 0 ? 0 : 1), // Some procedures not paid
      diferenca: 200 + (i * 30),
      pago: i % 3 !== 0,
      guia: `G-${100000 + i}`,
      beneficiario: 'Paciente Simulado',
      doctors: [
        {
          code: `CRM-${1000 + i}`,
          name: `Dr. Simulação ${i + 1}`,
          role: i % 2 === 0 ? 'Cirurgião' : 'Anestesista',
          startTime: '09:00',
          endTime: '11:00',
          status: 'confirmado'
        }
      ]
    })),
    totais: {
      valorCBHPM: 5500,
      valorPago: 3340,
      diferenca: 2160,
      procedimentosNaoPagos: 2
    }
  };
};
