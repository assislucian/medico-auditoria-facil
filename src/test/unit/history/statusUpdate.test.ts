
import { describe, it, expect, vi } from 'vitest';
import { updateAnalysisStatus } from '@/services/history/statusUpdate';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('updateAnalysisStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true on successful status update', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      })
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await updateAnalysisStatus('test-id', 'complete');
    expect(result).toBe(true);
  });

  it('returns false when update fails', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: new Error('Update failed') })
      })
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await updateAnalysisStatus('test-id', 'complete');
    expect(result).toBe(false);
  });

  it('returns false on exception', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockRejectedValue(new Error('Network error'))
      })
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await updateAnalysisStatus('test-id', 'complete');
    expect(result).toBe(false);
  });
});
