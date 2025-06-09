
import { MainLayout } from '@/components/layout/MainLayout';
import { ReferenceTablesSettings } from '@/components/settings/ReferenceTablesSettings';

const ReferenceTablesPage = () => {
  return (
    <MainLayout title="Tabelas de Referência">
      <ReferenceTablesSettings />
    </MainLayout>
  );
};

export default ReferenceTablesPage;
