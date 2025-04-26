
import { describe, it, expect, vi } from 'vitest'
import { fetchProceduresByAnalysisId } from '@/utils/supabase/procedureHelpers'
import { supabase } from '@/integrations/supabase/client'

describe('procedureHelpers', () => {
  it('fetches procedures by analysis id', async () => {
    const mockProcedures = [
      { id: '1', codigo: 'TEST1', procedimento: 'Test Procedure 1' },
      { id: '2', codigo: 'TEST2', procedimento: 'Test Procedure 2' }
    ]

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => Promise.resolve({ data: mockProcedures, error: null })
      })
    }))

    const result = await fetchProceduresByAnalysisId('test-analysis-id')
    expect(result).toEqual(mockProcedures)
  })

  it('returns empty array on error', async () => {
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: 'Error' } })
      })
    }))

    const result = await fetchProceduresByAnalysisId('test-analysis-id')
    expect(result).toEqual([])
  })
})
