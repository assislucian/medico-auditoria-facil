
import { describe, it, expect } from 'vitest'
import { hasError, hasData, extractData } from '@/utils/supabase/queryHelpers'

describe('queryHelpers', () => {
  it('detects error in response', () => {
    const response = { error: { message: 'Test error' }, data: null }
    expect(hasError(response)).toBe(true)
  })

  it('detects data in response', () => {
    const response = { error: null, data: { test: 'data' } }
    expect(hasData(response)).toBe(true)
  })

  it('extracts data correctly', () => {
    const data = { test: 'data' }
    const response = { error: null, data }
    expect(extractData(response)).toEqual(data)
  })

  it('returns null when error exists', () => {
    const response = { error: { message: 'Test error' }, data: { test: 'data' } }
    expect(extractData(response)).toBeNull()
  })
})
