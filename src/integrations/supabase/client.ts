
/**
 * Mock Supabase Client
 * 
 * This file provides a mock implementation of the Supabase client for development
 * without requiring an actual Supabase backend connection.
 */

import { mockData } from '../mock/mockData';
import { createClient } from '@supabase/supabase-js';

// Mock implementation of the Supabase client
export const supabase = {
  from: (table: string) => {
    return {
      select: (columns: string = '*') => {
        return {
          eq: (column: string, value: any) => {
            if (table === 'procedures') {
              const filteredData = mockData.procedures.filter(item => item[column] === value);
              return {
                data: filteredData,
                error: null
              };
            } else if (table === 'analysis_results') {
              if (value) {
                const result = mockData.analysisResults.find(item => item[column] === value);
                return {
                  data: result,
                  error: null,
                  single: () => ({ data: result, error: null })
                };
              }
              return {
                data: mockData.analysisResults,
                error: null,
                single: () => ({ 
                  data: mockData.analysisResults[0], 
                  error: null 
                })
              };
            }
            return { data: [], error: null };
          },
          maybeSingle: () => {
            if (table === 'analysis_results') {
              return { 
                data: mockData.analysisResults[0], 
                error: null 
              };
            }
            return { data: null, error: null };
          },
          single: () => {
            if (table === 'analysis_results') {
              return { 
                data: mockData.analysisResults[0], 
                error: null 
              };
            }
            return { data: null, error: null };
          },
          order: () => {
            return {
              data: mockData[table] || [],
              error: null
            };
          },
          data: mockData[table] || [],
          error: null
        };
      },
      insert: (data: any) => {
        console.log(`Mock inserting into ${table}:`, data);
        return {
          select: () => ({
            single: () => ({
              data: { ...data, id: `mock-${Math.random().toString(36).substring(2, 9)}` },
              error: null
            })
          })
        };
      },
      update: (data: any) => {
        console.log(`Mock updating ${table}:`, data);
        return {
          eq: () => ({
            select: () => ({
              single: () => ({
                data: { ...data, id: 'mock-id' },
                error: null
              })
            })
          })
        };
      },
      delete: () => {
        console.log(`Mock deleting from ${table}`);
        return {
          eq: () => ({
            error: null
          })
        };
      }
    };
  },
  auth: {
    getUser: async () => {
      return {
        data: {
          user: {
            id: 'mock-user-id',
            email: 'mock@example.com',
          }
        },
        error: null
      };
    },
    getSession: async () => {
      return {
        data: {
          session: {
            access_token: 'mock-token'
          }
        },
        error: null
      };
    },
    onAuthStateChange: (callback: Function) => {
      // Do nothing in the mock
      return {
        data: { subscription: { unsubscribe: () => {} } },
        error: null
      };
    }
  },
  functions: {
    setAuth: (token: string) => {
      console.log('Mock setting auth token', token);
    }
  }
};

// Real Supabase client implementation (not used but exported for type compatibility)
const SUPABASE_URL = "https://example.com";
const SUPABASE_PUBLISHABLE_KEY = "dummy-key";

// This is only used for type compatibility
export const realSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
