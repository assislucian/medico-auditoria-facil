
import { describe, it, expect, vi } from 'vitest'
import { fetchHelpArticles } from '@/utils/supabase/helpHelpers'
import { supabase } from '@/integrations/supabase/client'

describe('helpHelpers', () => {
  it('fetches published help articles', async () => {
    const mockArticles = [
      { id: '1', title: 'Test Article 1', published: true },
      { id: '2', title: 'Test Article 2', published: true }
    ]

    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: mockArticles, error: null })
    });
    
    const mockFrom = vi.fn().mockReturnValue({
      select: mockSelect
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await fetchHelpArticles({ published: true })
    expect(result).toEqual(mockArticles)
  })

  it('returns empty array on error', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } })
    });
    
    const mockFrom = vi.fn().mockReturnValue({
      select: mockSelect
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await fetchHelpArticles()
    expect(result).toEqual([])
  })
})
