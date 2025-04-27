
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfile, updateProfile } from '@/utils/supabase/profileHelpers';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

describe('profileHelpers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getProfile', () => {
    it('should return profile data when successful', async () => {
      const mockProfileData = { id: 'test-id', name: 'Test User' };
      mockSupabase.single.mockResolvedValue({ data: mockProfileData, error: null });

      const result = await getProfile(mockSupabase, 'test-id');

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'test-id');
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockProfileData);
    });

    it('should return null when there is an error', async () => {
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Test error') });

      const result = await getProfile(mockSupabase, 'test-id');

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should return true when update is successful', async () => {
      mockSupabase.update.mockResolvedValue({ error: null });

      const result = await updateProfile(mockSupabase, 'test-id', { name: 'Updated Name' });

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.update).toHaveBeenCalledWith({ name: 'Updated Name' });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'test-id');
      expect(result).toBe(true);
    });

    it('should return false when there is an error', async () => {
      mockSupabase.update.mockResolvedValue({ error: new Error('Test error') });

      const result = await updateProfile(mockSupabase, 'test-id', { name: 'Updated Name' });

      expect(result).toBe(false);
    });
  });
});
