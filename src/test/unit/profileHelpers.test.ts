
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfile, updateProfile } from '@/utils/supabase/profileHelpers';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'test-id' }
          }
        }
      })
    }
  }
}));

describe('profileHelpers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getProfile', () => {
    it('should return profile data when successful', async () => {
      const mockProfileData = { id: 'test-id', name: 'Test User' };
      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfileData, error: null });
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from().select().eq().single = mockSingle;

      const result = await getProfile();

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'test-id');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockProfileData);
    });

    it('should return null when there is an error', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: new Error('Test error') });
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from().select().eq().single = mockSingle;

      const result = await getProfile();

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should return data when update is successful', async () => {
      const mockUpdatedData = { id: 'test-id', name: 'Updated Name' };
      const mockSingle = vi.fn().mockResolvedValue({ data: mockUpdatedData, error: null });
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from().update().eq().select().single = mockSingle;

      const result = await updateProfile({ name: 'Updated Name' });

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.update).toHaveBeenCalledWith({ name: 'Updated Name' });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'test-id');
      expect(result).toBe(mockUpdatedData);
    });

    it('should throw error when update fails', async () => {
      const testError = new Error('Test error');
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: testError });
      
      const mockSupabase = require('@/integrations/supabase/client').supabase;
      mockSupabase.from().update().eq().select().single = mockSingle;

      await expect(updateProfile({ name: 'Updated Name' })).rejects.toThrow(testError);
    });
  });
});
