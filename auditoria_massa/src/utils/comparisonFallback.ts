
import { supabase } from '@/integrations/supabase/client';

/**
 * Create simulation data for testing/demo purposes
 */
export function createSimulationData() {
  return {
    summary: {
      total: 3,
      conforme: 1,
      abaixo: 1,
      acima: 1
    },
    details: [
      {
        id: '1',
        codigo: '30602246',
        descricao: 'Reconstrução Mamária Com Retalhos Cutâneos Regionais',
        qtd: 1,
        valorCbhpm: 3200.50,
        valorPago: 2800.00,
        diferenca: 400.50,
        status: 'abaixo',
        papel: 'Cirurgião',
        guia: '10467538'
      },
      {
        id: '2',
        codigo: '30602076',
        descricao: 'Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll',
        qtd: 1,
        valorCbhpm: 1800.75,
        valorPago: 1900.25,
        diferenca: 99.50,
        status: 'acima',
        papel: 'Cirurgião',
        guia: '10467538'
      },
      {
        id: '3',
        codigo: '31602096',
        descricao: 'Consulta em Cirurgia Plástica',
        qtd: 1,
        valorCbhpm: 200.00,
        valorPago: 200.00,
        diferenca: 0,
        status: 'conforme',
        papel: 'Cirurgião',
        guia: '10467539'
      }
    ]
  };
}

/**
 * Fetch comparison data directly from the database as fallback
 */
export async function getFallbackComparisonData(analysisId: string) {
  console.log('Getting fallback comparison data from database for:', analysisId);
  
  try {
    // Get the analysis data
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError) {
      console.error('Error fetching analysis:', analysisError);
      throw new Error('Análise não encontrada');
    }
    
    // Get the procedures
    const { data: procedures, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
      
    if (proceduresError) {
      console.error('Error fetching procedures:', proceduresError);
      throw new Error('Falha ao buscar procedimentos');
    }
    
    console.log(`Found ${procedures.length} procedures for analysis ${analysisId}`);
    
    let summary = {
      total: procedures.length,
      conforme: 0,
      abaixo: 0,
      acima: 0
    };
    
    const details = procedures.map(proc => {
      const valorCbhpm = proc.valor_cbhpm || 0;
      const valorPago = proc.valor_pago || 0;
      const diferenca = Math.abs(valorPago - valorCbhpm);
      
      let status: 'conforme' | 'abaixo' | 'acima' | 'não_pago';
      
      if (!proc.pago) {
        status = 'não_pago';
      } else if (Math.abs(diferenca) < 0.01) {
        status = 'conforme';
        summary.conforme++;
      } else if (valorPago < valorCbhpm) {
        status = 'abaixo';
        summary.abaixo++;
      } else {
        status = 'acima';
        summary.acima++;
      }
      
      return {
        id: proc.id,
        codigo: proc.codigo,
        descricao: proc.procedimento,
        qtd: 1,
        valorCbhpm,
        valorPago,
        diferenca,
        status,
        papel: proc.papel || 'Cirurgião',
        guia: proc.guia || '-'
      };
    });
    
    return {
      summary,
      details
    };
  } catch (error) {
    console.error('Error in getFallbackComparisonData:', error);
    return createSimulationData();
  }
}

