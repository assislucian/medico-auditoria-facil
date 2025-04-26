
import { describe, it, expect, vi } from 'vitest';
import { fetchHistoryData } from '@/services/history/fetchHistory';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn()
  }
}));

describe('fetchHistoryData', () => {
  it('returns empty array when user is not authenticated', async () => {
    vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({ data: { user: null }, error: null });
    
    const result = await fetchHistoryData();
    expect(result).toEqual([]);
  });

  it('returns mapped history items on successful fetch', async () => {
    const mockUser = { id: 'test-user' };
    const mockHistoryData = [{
      id: '1',
      date: '2025-01-01',
      type: 'analysis',
      description: 'Test',
      procedimentos: 5,
      glosados: 2,
      status: 'complete'
    }];

    vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({ data: { user: mockUser }, error: null });
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: mockHistoryData, error: null })
        })
      })
    } as any);

    const result = await fetchHistoryData();
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id', '1');
  });
});
