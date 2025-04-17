
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { compareWithPayslips } from '../services/reportService';
import { supabase } from '../config/supabase';

// Mock the supabase client
vi.mock('../config/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  }
}));

// Mock the cbhpmData functions
vi.mock('../data/cbhpmData', () => ({
  findProcedureByCodigo: vi.fn((code) => {
    const mockData = {
      '30602246': {
        codigo: '30602246',
        descricao: 'Reconstrução Mamária Com Retalhos Cutâneos Regionais',
        valorBase: 2771.40,
        porteAnestesico: 456.40,
        custoOperacional: 545.08
      },
      '30602076': {
        codigo: '30602076',
        descricao: 'Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll',
        valorBase: 1895.25,
        porteAnestesico: 230.40,
        custoOperacional: 325.00
      }
    };
    return mockData[code];
  }),
  calculateTotalCBHPM: vi.fn((procedure) => {
    if (!procedure) return 0;
    return procedure.valorBase + (procedure.porteAnestesico || 0) + (procedure.custoOperacional || 0);
  })
}));

describe('compareWithPayslips', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should handle a procedure with payment that matches CBHPM exactly', async () => {
    // Mock the supabase responses
    const mockAnalysis = { id: 'mock-analysis-id', user_id: 'user-123' };
    const mockProcedures = [
      {
        id: 'proc-1',
        codigo: '30602246',
        procedimento: 'Reconstrução Mamária',
        valor_pago: 3772.88, // Exactly matches CBHPM total (2771.40 + 456.40 + 545.08)
        pago: true,
        papel: 'Cirurgião'
      }
    ];

    // Set up mock responses
    supabase.from().select().eq().single.mockResolvedValueOnce({ data: mockAnalysis, error: null });
    supabase.from().select().eq().mockResolvedValueOnce({ data: mockProcedures, error: null });

    // Call the function
    const result = await compareWithPayslips('mock-analysis-id');

    // Check expectations
    expect(result.summary.total).toBe(1);
    expect(result.summary.conforme).toBe(1);
    expect(result.summary.abaixo).toBe(0);
    expect(result.summary.acima).toBe(0);

    expect(result.details[0].status).toBe('conforme');
    expect(result.details[0].papel).toBe('Cirurgião');
  });

  it('should handle a procedure with payment below CBHPM', async () => {
    // Mock the supabase responses
    const mockAnalysis = { id: 'mock-analysis-id', user_id: 'user-123' };
    const mockProcedures = [
      {
        id: 'proc-2',
        codigo: '30602246',
        procedimento: 'Reconstrução Mamária',
        valor_pago: 3000.00, // Below CBHPM total (3772.88)
        pago: true,
        papel: 'Primeiro Auxiliar'
      }
    ];

    supabase.from().select().eq().single.mockResolvedValueOnce({ data: mockAnalysis, error: null });
    supabase.from().select().eq().mockResolvedValueOnce({ data: mockProcedures, error: null });

    const result = await compareWithPayslips('mock-analysis-id');

    expect(result.summary.total).toBe(1);
    expect(result.summary.conforme).toBe(0);
    expect(result.summary.abaixo).toBe(1);
    expect(result.summary.acima).toBe(0);

    expect(result.details[0].status).toBe('abaixo');
    expect(result.details[0].papel).toBe('Primeiro Auxiliar');
  });

  it('should handle a procedure with payment above CBHPM', async () => {
    // Mock the supabase responses
    const mockAnalysis = { id: 'mock-analysis-id', user_id: 'user-123' };
    const mockProcedures = [
      {
        id: 'proc-3',
        codigo: '30602246',
        procedimento: 'Reconstrução Mamária',
        valor_pago: 4000.00, // Above CBHPM total (3772.88)
        pago: true,
        papel: 'Segundo Auxiliar'
      }
    ];

    supabase.from().select().eq().single.mockResolvedValueOnce({ data: mockAnalysis, error: null });
    supabase.from().select().eq().mockResolvedValueOnce({ data: mockProcedures, error: null });

    const result = await compareWithPayslips('mock-analysis-id');

    expect(result.summary.total).toBe(1);
    expect(result.summary.conforme).toBe(0);
    expect(result.summary.abaixo).toBe(0);
    expect(result.summary.acima).toBe(1);

    expect(result.details[0].status).toBe('acima');
    expect(result.details[0].papel).toBe('Segundo Auxiliar');
  });

  it('should handle a procedure that was not paid', async () => {
    // Mock the supabase responses
    const mockAnalysis = { id: 'mock-analysis-id', user_id: 'user-123' };
    const mockProcedures = [
      {
        id: 'proc-4',
        codigo: '30602076',
        procedimento: 'Exérese De Lesão',
        valor_pago: 0,
        pago: false,
        papel: 'Cirurgião'
      }
    ];

    supabase.from().select().eq().single.mockResolvedValueOnce({ data: mockAnalysis, error: null });
    supabase.from().select().eq().mockResolvedValueOnce({ data: mockProcedures, error: null });

    const result = await compareWithPayslips('mock-analysis-id');

    expect(result.summary.total).toBe(1);
    expect(result.summary.conforme).toBe(0);
    expect(result.summary.abaixo).toBe(0);
    expect(result.summary.acima).toBe(0);

    expect(result.details[0].status).toBe('não_pago');
  });
});
