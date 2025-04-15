
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import RegisterForm from "@/components/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Cadastro | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-4xl font-bold mb-2 text-gradient">MedCheck</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Junte-se ao MedCheck e recupere valores glosados de forma simples e eficiente.
          </p>
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
