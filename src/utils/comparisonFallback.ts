
import { supabase } from '@/integrations/supabase/client';
import { ExtractedData, Procedure } from '@/types/upload';

interface ProcedureData {
  id: string;
  codigo: string;
  procedimento?: string;
  descricao?: string;
  papel?: string;
  valorCBHPM?: number;
  valor_cbhpm?: number;
  valorPago?: number;
  valor_pago?: number;
  diferenca?: number;
  pago?: boolean;
  guia?: string;
  beneficiario?: string;
  doctors?: any[];
  quantidade?: number;
}

/**
 * Get a fallback comparison result for testing or when server is unavailable
 */
export const getComparisonFallback = async (analysisId?: string): Promise<ExtractedData> => {
  try {
    // Try to fetch real data if analysisId is provided
    if (analysisId) {
      const { data: analysis } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (analysis) {
        const { data: procedures } = await supabase
          .from('procedure_results')
          .select('*')
          .eq('analysis_id', analysisId);

        if (procedures && procedures.length > 0) {
          // Map database results to ExtractedData format
          const formattedProcedures: Procedure[] = procedures.map((proc: any) => ({
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
            doctors: proc.doctors || []
          }));

          const totals = {
            valorCBHPM: formattedProcedures.reduce((sum, proc) => sum + (proc.valorCBHPM || 0), 0),
            valorPago: formattedProcedures.reduce((sum, proc) => sum + (proc.valorPago || 0), 0),
            diferenca: 0,
            procedimentosNaoPagos: formattedProcedures.filter(p => !p.pago).length
          };

          totals.diferenca = totals.valorCBHPM - totals.valorPago;

          return {
            demonstrativoInfo: {
              numero: analysis.numero || '',
              competencia: analysis.competencia || '',
              hospital: analysis.hospital || '',
              data: new Date(analysis.created_at).toLocaleDateString('pt-BR'),
              beneficiario: formattedProcedures[0]?.beneficiario || ''
            },
            procedimentos: formattedProcedures,
            totais: totals
          };
        }
      }
    }

    // If no real data is found, return fallback data
    return getFallbackData();
  } catch (error) {
    console.error('Error in getComparisonFallback:', error);
    return getFallbackData();
  }
};

/**
 * Generate fallback data for demonstration
 */
const getFallbackData = (): ExtractedData => {
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
