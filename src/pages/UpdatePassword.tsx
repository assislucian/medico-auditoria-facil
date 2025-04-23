
import { Helmet } from 'react-helmet-async';
import PasswordForm from '@/components/auth/PasswordForm';

const UpdatePasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>Atualizar Senha | MedCheck</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">Atualizar Senha</h1>
          <PasswordForm />
        </div>
      </div>
    </>
  );
};

export default UpdatePasswordPage;
