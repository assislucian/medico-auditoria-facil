
import { PublicLayout } from "@/components/layout/PublicLayout";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const RegisterPage = () => {
  const { session, loading } = useAuth();
  
  // Redirect to dashboard if already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PublicLayout title="Cadastro">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {loading ? (
          <LoadingSpinner text="Carregando..." />
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-2 text-gradient">MedCheck</h1>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Junte-se ao MedCheck e recupere valores glosados de forma simples e eficiente.
            </p>
            <RegisterForm />
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
