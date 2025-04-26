
import '@testing-library/jest-dom'
import { beforeAll } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

beforeAll(() => {
  // Ensure we're using test environment
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must run in test environment')
  }
})

// Add any global test setup here
