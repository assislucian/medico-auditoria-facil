
/**
 * Mock Data
 * 
 * This file contains mock data for development without requiring an actual database connection.
 */

export const mockData = {
  analysisResults: [
    {
      id: 'analysis-1',
      created_at: new Date().toISOString(),
      file_name: 'demo_analysis.pdf',
      file_type: 'complete',
      hospital: 'Hospital São Lucas',
      competencia: 'Janeiro 2025',
      numero: 'DM123456',
      status: 'processed',
      summary: {
        totalCBHPM: 5000,
        totalPago: 4500,
        totalDiferenca: 500,
        procedimentosTotal: 10,
        procedimentosNaoPagos: 2
      },
      user_id: 'mock-user-id'
    }
  ],
  procedures: [
    {
      id: 'proc-1',
      analysis_id: 'analysis-1',
      codigo: '30602246',
      procedimento: 'Reconstrução Mamária Com Retalhos Cutâneos Regionais',
      papel: 'Cirurgião',
      valor_cbhpm: 3200.50,
      valor_pago: 2800.00,
      diferenca: 400.50,
      pago: false,
      guia: '10467538',
      beneficiario: 'Maria da Silva',
      doctors: [
        { name: 'Dr. João Silva', crm: '12345', role: 'Cirurgião' }
      ],
      user_id: 'mock-user-id',
      created_at: new Date().toISOString()
    },
    {
      id: 'proc-2',
      analysis_id: 'analysis-1',
      codigo: '30602076',
      procedimento: 'Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll',
      papel: 'Cirurgião',
      valor_cbhpm: 1800.75,
      valor_pago: 1900.25,
      diferenca: 99.50,
      pago: true,
      guia: '10467538',
      beneficiario: 'Maria da Silva',
      doctors: [
        { name: 'Dr. João Silva', crm: '12345', role: 'Cirurgião' }
      ],
      user_id: 'mock-user-id',
      created_at: new Date().toISOString()
    }
  ]
};

// Type definition for the mock procedure data
export interface MockProcedure {
  id: string;
  analysis_id: string;
  codigo: string;
  procedimento: string;
  papel: string;
  valor_cbhpm: number;
  valor_pago: number;
  diferenca: number;
  pago: boolean;
  guia: string;
  beneficiario: string;
  doctors: any[];
  user_id: string;
  created_at: string;
}

// Type definition for the mock analysis result data
export interface MockAnalysisResult {
  id: string;
  created_at: string;
  file_name: string;
  file_type: string;
  hospital: string;
  competencia: string;
  numero: string;
  status: string;
  summary: {
    totalCBHPM: number;
    totalPago: number;
    totalDiferenca: number;
    procedimentosTotal: number;
    procedimentosNaoPagos: number;
  };
  user_id: string;
}
