
import { describe, it, expect, vi } from 'vitest'
import { getProfileData, updateProfile } from '@/utils/supabase/profileHelpers'
import { supabase } from '@/integrations/supabase/client'

describe('profileHelpers', () => {
  it('fetches profile data successfully', async () => {
    const mockProfile = {
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
      crm: '12345',
      specialty: 'Cardiologia'
    }

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: mockProfile, error: null })
        })
      })
    }))

    const result = await getProfileData('test-id')
    expect(result).toEqual(mockProfile)
  })

  it('returns null when profile not found', async () => {
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null })
        })
      })
    }))

    const result = await getProfileData('non-existent')
    expect(result).toBeNull()
  })
})
