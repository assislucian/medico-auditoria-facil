
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-4xl font-bold mb-2 text-gradient">MedCheck</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Auditoria de pagamentos médicos simplificada.
            Faça login para continuar.
          </p>
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
