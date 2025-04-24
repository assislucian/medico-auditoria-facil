
import { PublicLayout } from "@/components/layout/PublicLayout";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const LoginPage = () => {
  const { session, loading } = useAuth();
  
  // Redirect to dashboard if already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PublicLayout title="Login">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {loading ? (
          <LoadingSpinner text="Carregando..." />
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-2 text-gradient">MedCheck</h1>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Auditoria de pagamentos médicos simplificada.
              Faça login para continuar.
            </p>
            <LoginForm />
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
