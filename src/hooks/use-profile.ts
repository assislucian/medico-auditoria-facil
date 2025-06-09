
import { useProfileAvatar } from "./profile/use-profile-avatar";
import { useProfileData } from "./profile/use-profile-data";
import { useProfileSecurity } from "./profile/use-profile-security";
import { useProfileNotifications } from "./profile/use-profile-notifications";

export const useProfile = () => {
  const { uploading: avatarLoading, avatarUrl, uploadAvatar } = useProfileAvatar();
  const { loading: profileLoading, fetchProfile, updateProfile: updateProfileBase } = useProfileData();
  const { loading: securityLoading, updateSecurity: updateSecurityBase } = useProfileSecurity();
  const { loading: notificationsLoading, updateNotificationPreferences } = useProfileNotifications();

  const loading = avatarLoading || profileLoading || securityLoading || notificationsLoading;

  // Create wrapper functions that handle the Promise<boolean> to Promise<void> conversion
  const updateProfile = async (data: any, avatarFile?: File | null): Promise<void> => {
    await updateProfileBase(data, avatarFile);
  };

  const updateSecurity = async (data: any): Promise<void> => {
    await updateSecurityBase(data);
  };

  return {
    loading,
    avatarUrl,
    fetchProfile,
    uploadAvatar,
    updateProfile,
    updateSecurity,
    updateNotificationPreferences
  };
};
