
import { describe, it, expect, vi } from 'vitest';
import { fetchHistoryData } from '@/services/history/fetchHistory';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

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
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: mockHistoryData, error: null })
        })
      })
    } as any));

    const result = await fetchHistoryData();
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id', '1');
  });
});
