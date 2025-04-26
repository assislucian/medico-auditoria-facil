import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import { getProfile } from '@/utils/supabase';
import { Profile } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Import das páginas
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import ForgotPasswordPage from '@/pages/ForgotPassword';
import ResetPasswordPage from '@/pages/ResetPassword';
import DashboardPage from '@/pages/Dashboard';
import ProfilePage from '@/pages/Profile';
import WelcomePage from '@/pages/Welcome';
import AuthCallback from '@/pages/AuthCallback';
import NewAuditPage from '@/pages/NewAudit';
import CompareContracheque from '@/pages/CompareContracheque';
import HelpPage from '@/pages/Help';
import SupportPage from '@/pages/Support';
import AnalysisPage from '@/pages/Analysis';
import UploadsPage from '@/pages/Uploads';

// Add the new pages to the router configuration
import GuiasPage from '@/pages/GuiasPage';
import DemonstrativosPage from '@/pages/DemonstrativosPage';
import CompararGuiaPage from '@/pages/CompararGuiaPage';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="medcheck-theme">
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
          <Toaster richColors />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const location = useLocation();
  
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchProfile = async () => {
      if (isLoggedIn) {
        try {
          const fetchedProfile = await getProfile(null, user.id);
          setProfile(fetchedProfile);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [isLoggedIn, user]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!isLoggedIn ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={!isLoggedIn ? <ResetPasswordPage /> : <Navigate to="/dashboard" />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <DashboardPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          isLoggedIn ? (
            <ProfilePage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/welcome"
        element={
          isLoggedIn ? (
            <WelcomePage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/new-audit"
        element={
          isLoggedIn ? (
            <NewAuditPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/compare"
        element={
          isLoggedIn ? (
            <CompareContracheque />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/analysis/:id"
        element={
          isLoggedIn ? (
            <AnalysisPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/help"
        element={
          isLoggedIn ? (
            <HelpPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/support"
        element={
          isLoggedIn ? (
            <SupportPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/uploads"
        element={
          isLoggedIn ? (
            <UploadsPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/guias"
        element={
          isLoggedIn ? (
            <GuiasPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/demonstrativos"
        element={
          isLoggedIn ? (
            <DemonstrativosPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />
      <Route
        path="/comparar/:guideId"
        element={
          isLoggedIn ? (
            <CompararGuiaPage />
          ) : (
            <Navigate to={`/login?redirect=${location.pathname}`} replace />
          )
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
