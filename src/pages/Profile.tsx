
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ActivitySummary } from "@/components/profile/ActivitySummary";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

interface ProfileData {
  name: string;
  specialty: string;
  crm: string;
  email: string;
  avatar_url?: string;
}

const Profile = () => {
  const { fetchProfile, uploadAvatar } = useProfile();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Dra. Ana Silva",
    specialty: "Ortopedia",
    crm: "SP 123456",
    email: "dr.anasilva@exemplo.med.br"
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile data on component mount
  useEffect(() => {
    const getProfileData = async () => {
      setLoading(true);
      try {
        const data = await fetchProfile();
        if (data) {
          setProfileData({
            name: data.name || "Usuário",
            specialty: data.specialty || "Não especificada",
            crm: data.crm || "Não informado",
            email: data.email || "",
            avatar_url: data.avatar_url
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [fetchProfile]);

  // Handle avatar update
  const handleAvatarUpdate = async (file: File) => {
    try {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl) {
        setProfileData(prev => ({
          ...prev,
          avatar_url: avatarUrl
        }));
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Perfil | MedCheck</title>
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <SideNav className="hidden md:flex" />
        <div className="flex-1">
          <Navbar isLoggedIn={true} />
          <div className="container py-8">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/3">
                <ProfileSidebar 
                  name={profileData.name}
                  specialty={profileData.specialty}
                  crm={profileData.crm}
                  avatarUrl={profileData.avatar_url}
                  onUpdateAvatar={handleAvatarUpdate}
                />
              </div>
              <div className="md:w-2/3">
                <ProfileTabs />
              </div>
            </div>
            <ActivitySummary />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Profile;
