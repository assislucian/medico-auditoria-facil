
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SecurityCard } from "@/components/profile/SecurityCard";
import { SubscriptionCard } from "@/components/profile/SubscriptionCard";
import { ProfileTabs } from '@/components/profile/ProfileTabs';

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Perfil | MedCheck</title>
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <SideNav className="hidden lg:flex" />
        <div className="flex-1">
          <Navbar isLoggedIn={true} />
          <div className="container max-w-6xl py-8">
            <div className="grid gap-8">
              <ProfileHeader />
              
              <div className="grid gap-6 md:grid-cols-2">
                <SubscriptionCard />
                <SecurityCard />
              </div>
              
              <ProfileTabs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
