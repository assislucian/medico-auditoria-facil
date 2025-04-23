import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts";
import { useAuth } from "@/contexts";

// Import pages
import IndexPage from "@/pages/Index";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import PricingPage from "@/pages/Pricing";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ForgotPasswordPage from "@/pages/ForgotPassword";
import ResetPasswordPage from "@/pages/ResetPassword";
import WelcomePage from "@/pages/Welcome";
import CheckoutPage from "@/components/checkout/CheckoutPage";
import DashboardPage from "@/pages/Dashboard";
import UploadsPage from "@/pages/Uploads";
import HistoryPage from "@/pages/History";
import ReportsPage from "@/pages/Reports";
import ProfilePage from "@/pages/Profile";
import SettingsPage from "@/pages/Settings";
import HelpPage from "@/pages/Help";
import SupportPage from "@/pages/Support";
import ComparePage from "@/pages/CompareContracheque";
import NotFoundPage from "@/pages/NotFound";
import LockScreen from "@/pages/LockScreen";
import TrialGuard from "@/components/auth/TrialGuard";

const queryClient = new QueryClient();

const AuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback - URL completa:", window.location.href);
        
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        console.log("Auth callback - Hash params:", Object.fromEntries(hashParams.entries()));
        console.log("Auth callback - Query params:", Object.fromEntries(queryParams.entries()));
        
        if ((hashParams.get('type') === 'recovery' || queryParams.get('type') === 'recovery')) {
          console.log("Redirecionando para página de redefinição de senha");
          window.location.href = '/reset-password' + window.location.hash + window.location.search;
          return;
        }
        
        console.log("Redirecionando para dashboard");
        window.location.href = '/dashboard';
      } catch (error) {
        console.error("Erro no callback de autenticação:", error);
        window.location.href = '/login';
      }
    };
    
    handleAuthCallback();
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <span className="ml-3 text-xl font-medium">Redirecionando...</span>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-xl font-medium">Carregando...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-xl font-medium">Carregando...</span>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <BrowserRouter>
              <AuthProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<IndexPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  
                  <Route path="/login" element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
                  <Route path="/register" element={<GuestOnlyRoute><RegisterPage /></GuestOnlyRoute>} />
                  <Route path="/forgot-password" element={<GuestOnlyRoute><ForgotPasswordPage /></GuestOnlyRoute>} />
                  <Route path="/reset-password" element={<GuestOnlyRoute><ResetPasswordPage /></GuestOnlyRoute>} />
                  
                  <Route path="/lock" element={<ProtectedRoute><LockScreen /></ProtectedRoute>} />
                  <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
                  
                  <Route path="/dashboard" element={<ProtectedRoute><TrialGuard><DashboardPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/uploads" element={<ProtectedRoute><TrialGuard><UploadsPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/history" element={<ProtectedRoute><TrialGuard><HistoryPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><TrialGuard><ReportsPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><TrialGuard><ProfilePage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><TrialGuard><SettingsPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/help" element={<ProtectedRoute><TrialGuard><HelpPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/support" element={<ProtectedRoute><TrialGuard><SupportPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/compare" element={<ProtectedRoute><TrialGuard><ComparePage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><TrialGuard><CheckoutPage /></TrialGuard></ProtectedRoute>} />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
