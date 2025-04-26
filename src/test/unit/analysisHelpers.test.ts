
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

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockAnalysis, error: null })
        })
      })
    } as any);

    const result = await fetchAnalysisById('test-id');
    expect(result).toEqual(mockAnalysis);
  });

  it('returns null on error', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Error' } })
        })
      })
    } as any);

    const result = await fetchAnalysisById('test-id');
    expect(result).toBeNull();
  });
});
