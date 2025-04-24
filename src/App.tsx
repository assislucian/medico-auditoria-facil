
/**
 * App.tsx
 * 
 * Definição principal das rotas e configurações da aplicação.
 * Configura o React Router, provedores de contexto e layout básico.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ResetPasswordPage from "./pages/Auth/ResetPassword";
import ProfilePage from "./pages/Profile";
import DashboardPage from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFound";
import NewAuditPage from "./pages/NewAudit";
import HistoryPage from "./pages/History";
import ComparePage from "./pages/ComparePage";
import HelpPage from "./pages/Help";
import PrivacyPage from "./pages/legal/Privacy";
import TermsPage from "./pages/legal/Terms";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { useAuth } from "./contexts/AuthContext";

/**
 * Componente de proteção de rotas autenticadas
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Se está carregando, não faz nada ainda
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }
  
  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Se está autenticado, renderiza o conteúdo
  return <>{children}</>;
}

/**
 * Componente principal da aplicação
 */
function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | MedCheck" defaultTitle="MedCheck - Auditoria Médica" />
      <ThemeProvider defaultTheme="light" storageKey="medcheck-theme">
        <AuthProvider>
          <OnboardingProvider>
            <Toaster position="top-right" richColors />
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
              {/* Rotas Protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nova-auditoria" 
                element={
                  <ProtectedRoute>
                    <NewAuditPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/historico" 
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/compare" 
                element={
                  <ProtectedRoute>
                    <ComparePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ajuda" 
                element={
                  <ProtectedRoute>
                    <HelpPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota de fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
