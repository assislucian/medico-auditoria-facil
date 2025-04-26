
import { describe, it, expect, vi } from 'vitest'
import { fetchProceduresByAnalysisId } from '@/utils/supabase/procedureHelpers'
import { supabase } from '@/integrations/supabase/client'

describe('procedureHelpers', () => {
  it('fetches procedures by analysis id', async () => {
    const mockProcedures = [
      { id: '1', codigo: 'TEST1', procedimento: 'Test Procedure 1' },
      { id: '2', codigo: 'TEST2', procedimento: 'Test Procedure 2' }
    ]

    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: mockProcedures, error: null })
    });
    
    const mockFrom = vi.fn().mockReturnValue({
      select: mockSelect
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await fetchProceduresByAnalysisId('test-analysis-id')
    expect(result).toEqual(mockProcedures)
  })

  it('returns empty array on error', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } })
    });
    
    const mockFrom = vi.fn().mockReturnValue({
      select: mockSelect
    });

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom);

    const result = await fetchProceduresByAnalysisId('test-analysis-id')
    expect(result).toEqual([])
  })
})
