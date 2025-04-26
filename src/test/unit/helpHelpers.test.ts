
import { describe, it, expect, vi } from 'vitest'
import { fetchHelpArticles } from '@/utils/supabase/helpHelpers'
import { supabase } from '@/integrations/supabase/client'

describe('helpHelpers', () => {
  it('fetches published help articles', async () => {
    const mockArticles = [
      { id: '1', title: 'Test Article 1', published: true },
      { id: '2', title: 'Test Article 2', published: true }
    ]

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => Promise.resolve({ data: mockArticles, error: null })
      })
    }))

    const result = await fetchHelpArticles({ published: true })
    expect(result).toEqual(mockArticles)
  })

  it('returns empty array on error', async () => {
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: 'Error' } })
      })
    }))

    const result = await fetchHelpArticles()
    expect(result).toEqual([])
  })
})
