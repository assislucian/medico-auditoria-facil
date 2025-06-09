
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAnalysisDetails } from '@/services/history/analysisDetails';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn()
  }
}));

describe('fetchAnalysisDetails', () => {
  const mockUser: User = {
    id: 'test-user',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    email: 'test@example.com',
    phone: '',
    role: '',
    factors: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when user is not authenticated', async () => {
    vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({ data: { user: null }, error: null });
    
    const result = await fetchAnalysisDetails('test-id');
    expect(result).toBeNull();
  });

  it('returns analysis details with procedures', async () => {
    const mockAnalysis = {
      id: 'test-id',
      type: 'analysis',
      description: 'Test Analysis'
    };

    const mockProcedures = [{
      id: 'proc-1',
      codigo: '123',
      procedimento: 'Test Procedure',
      valor_cbhpm: 100,
      valor_pago: 90,
      diferenca: 10
    }];

    vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({ data: { user: mockUser }, error: null });
    
    // Create a more sophisticated mock implementation for the supabase.from
    const mockFromImplementation = (tableName: string) => {
      if (tableName === 'analysis_results') {
        const mockSingle = vi.fn().mockResolvedValue({ data: mockAnalysis, error: null });
        const mockEqInner = vi.fn().mockReturnValue({ single: mockSingle });
        const mockEq = vi.fn().mockReturnValue({ eq: mockEqInner });
        const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        return { select: mockSelect };
      } else {
        const mockEqInner = vi.fn().mockResolvedValue({ data: mockProcedures, error: null });
        const mockEq = vi.fn().mockReturnValue({ eq: mockEqInner });
        const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        return { select: mockSelect };
      }
    };

    // Use vi.mocked to properly type the mock
    vi.mocked(supabase.from).mockImplementation(mockFromImplementation);

    const result = await fetchAnalysisDetails('test-id');
    expect(result).toBeTruthy();
    expect(result?.procedimentos).toHaveLength(1);
    expect(result?.procedimentos[0]).toHaveProperty('codigo', '123');
  });
});
