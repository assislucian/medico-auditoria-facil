
import { useProfileAvatar } from "./profile/use-profile-avatar";
import { useProfileData } from "./profile/use-profile-data";
import { useProfileSecurity } from "./profile/use-profile-security";
import { useProfileNotifications } from "./profile/use-profile-notifications";

export const useProfile = () => {
  const { loading: avatarLoading, avatarUrl, uploadAvatar } = useProfileAvatar();
  const { loading: profileLoading, fetchProfile, updateProfile } = useProfileData();
  const { loading: securityLoading, updateSecurity } = useProfileSecurity();
  const { loading: notificationsLoading, updateNotificationPreferences } = useProfileNotifications();

  const loading = avatarLoading || profileLoading || securityLoading || notificationsLoading;

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
