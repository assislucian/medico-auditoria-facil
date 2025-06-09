
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SecurityCard } from "@/components/profile/SecurityCard";
import { SubscriptionCard } from "@/components/profile/SubscriptionCard";
import { ProfileTabs } from '@/components/profile/ProfileTabs';

const Profile = () => {
  return (
    <AuthenticatedLayout title="Perfil">
      <div className="grid gap-8">
        <ProfileHeader />
        
        <div className="grid gap-6 md:grid-cols-2">
          <SubscriptionCard />
          <SecurityCard />
        </div>
        
        <ProfileTabs />
      </div>
    </AuthenticatedLayout>
  );
};

export default Profile;
