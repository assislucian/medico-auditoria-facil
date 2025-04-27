
import { ExtractedData, DoctorParticipation } from '@/types/upload';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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
        doctors: parseDoctors(proc.doctors)
      })),
      totais: {
        valorCBHPM: getSummaryValue(analysisData.summary, 'totalCBHPM'),
        valorPago: getSummaryValue(analysisData.summary, 'totalPago'),
        diferenca: getSummaryValue(analysisData.summary, 'totalDiferenca'),
        procedimentosNaoPagos: getSummaryValue(analysisData.summary, 'procedimentosNaoPagos')
      }
    };

    return extractedData;
  } catch (error) {
    console.error('Error in getFallbackComparisonData:', error);
    return null;
  }
};

// Helper function to safely parse summary values
function getSummaryValue(summary: Json | null, key: string): number {
  if (!summary) return 0;
  
  try {
    const obj = typeof summary === 'string' ? JSON.parse(summary) : summary;
    return typeof obj[key] === 'number' ? obj[key] : 0;
  } catch (e) {
    return 0;
  }
}

// Helper function to safely parse doctors data
function parseDoctors(doctorsJson: Json | null): DoctorParticipation[] {
  if (!doctorsJson) return [];
  
  try {
    const doctors = typeof doctorsJson === 'string' ? JSON.parse(doctorsJson) : doctorsJson;
    if (!Array.isArray(doctors)) return [];
    
    return doctors.map(doctor => ({
      code: doctor.code || '',
      name: doctor.name || '',
      role: doctor.role || '',
      startTime: doctor.startTime || '',
      endTime: doctor.endTime || '',
      status: doctor.status || ''
    }));
  } catch (e) {
    console.error('Error parsing doctors data:', e);
    return [];
  }
}

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
