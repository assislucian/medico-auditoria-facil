
import { describe, it, expect, vi } from 'vitest';
import { fetchAnalysisById } from '@/utils/supabase/analysisHelpers';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('analysisHelpers', () => {
  it('fetches analysis by id successfully', async () => {
    const mockAnalysis = {
      id: 'test-id',
      summary: { total: 100 },
      created_at: '2025-01-01'
    };

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockAnalysis, error: null })
        })
      })
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await fetchAnalysisById('test-id');
    expect(result).toEqual(mockAnalysis);
  });

  it('returns null on error', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } })
        })
      })
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await fetchAnalysisById('test-id');
    expect(result).toBeNull();
  });
});
