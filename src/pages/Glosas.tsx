
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import GlosasTab from "@/components/dashboard/tabs/GlosasTab";

const GlosasPage = () => {
  return (
    <AuthenticatedLayout 
      title="Glosas" 
      description="Analise e conteste as glosas dos planos de saúde"
    >
      <div className="space-y-6">
        <GlosasTab />
      </div>
    </AuthenticatedLayout>
  );
};

export default GlosasPage;
