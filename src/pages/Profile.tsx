
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ActivitySummary } from "@/components/profile/ActivitySummary";

const Profile = () => {
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
                  name="Dra. Ana Silva"
                  specialty="Ortopedia"
                  crm="123456/SP"
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
    </>
  );
};

export default Profile;
