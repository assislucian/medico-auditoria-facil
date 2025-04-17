
import { ExtractedData } from '@/types/upload';

// Dados simulados para demonstração - representando o que seria extraído dos PDFs
const mockExtractedData: ExtractedData = {
  demonstrativoInfo: {
    numero: "DEM-2024-001",
    competencia: "Agosto/2024",
    hospital: "Liga Norteriog Cancer Policlinic",
    data: "2024-08-19",
    beneficiario: "00620040000604690"
  },
  procedimentos: [
    {
      id: "proc-1",
      codigo: "30602246",
      procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
      papel: "Cirurgião",
      valorCBHPM: 3772.88,
      valorPago: 457.64,
      diferenca: -3315.24,
      pago: true,
      guia: "10467538",
      beneficiario: "00620040000604690",
      doctors: [
        {
          code: "8425",
          name: "FERNANDA MABEL BATISTA DE AQUINO",
          role: "Cirurgião",
          startTime: "2024-08-19T14:09:00",
          endTime: "2024-08-19T15:24:00",
          status: "Fechada"
        },
        {
          code: "6091",
          name: "MOISES DE OLIVEIRA SCHOTS",
          role: "Primeiro Auxiliar",
          startTime: "2024-08-19T14:15:00",
          endTime: "2024-08-19T15:17:00",
          status: "Fechada"
        },
        {
          code: "4127",
          name: "LILIANE ANNUZA DA SILVA",
          role: "Anestesista",
          startTime: "2024-08-19T15:17:00",
          endTime: "2024-08-19T15:43:00",
          status: "Fechada"
        }
      ]
    },
    {
      id: "proc-2",
      codigo: "30801036",
      procedimento: "Reconstrução com Retalho Miocutâneo",
      papel: "Cirurgião",
      valorCBHPM: 2981.75,
      valorPago: 596.35,
      diferenca: -2385.40,
      pago: true,
      guia: "10467538",
      beneficiario: "00620040000604690",
      doctors: [
        {
          code: "8425",
          name: "FERNANDA MABEL BATISTA DE AQUINO",
          role: "Cirurgião",
          startTime: "2024-08-19T15:30:00",
          endTime: "2024-08-19T16:45:00",
          status: "Fechada"
        }
      ]
    },
    {
      id: "proc-3",
      codigo: "40809048",
      procedimento: "Consulta em Pronto-Socorro",
      papel: "Cirurgião",
      valorCBHPM: 264.00,
      valorPago: 0.00,
      diferenca: -264.00,
      pago: false,
      guia: "10467649",
      beneficiario: "00620040000604690",
      doctors: [
        {
          code: "8425",
          name: "FERNANDA MABEL BATISTA DE AQUINO",
          role: "Cirurgião",
          startTime: "2024-08-20T08:30:00",
          endTime: "2024-08-20T09:00:00",
          status: "Fechada"
        }
      ]
    }
  ],
  totais: {
    valorCBHPM: 7018.63,
    valorPago: 1053.99,
    diferenca: -5964.64,
    procedimentosNaoPagos: 1
  }
};

/**
 * Retorna os dados de mock para simulação
 */
export function getExtractedMockData(): ExtractedData {
  return mockExtractedData;
}
