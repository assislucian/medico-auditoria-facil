
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Helmet } from "react-helmet-async";
import { ProfileDashboard } from "@/components/profile/ProfileDashboard";

const Profile = () => {
  return (
    <AuthenticatedLayout title="Perfil">
      <Helmet>
        <title>Perfil | MedCheck</title>
        <meta name="description" content="Gerencie seu perfil médico e configurações" />
      </Helmet>
      <ProfileDashboard />
    </AuthenticatedLayout>
  );
};

export default Profile;
