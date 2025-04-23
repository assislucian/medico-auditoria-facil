
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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

// Create a QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to handle auth callbacks
const AuthCallback = () => {
  const navigate = useNavigate();
  
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
          navigate('/reset-password' + window.location.hash + window.location.search, { replace: true });
          return;
        }
        
        console.log("Redirecionando para dashboard");
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error("Erro no callback de autenticação:", error);
        navigate('/login', { replace: true });
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <span className="ml-3 text-xl font-medium">Redirecionando...</span>
    </div>
  );
};

// Protected route with better loading handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !user) {
      console.log('Not authenticated, should redirect to login');
    }
  }, [loading, user]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-xl font-medium">Carregando...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Guest only route that redirects to dashboard if authenticated
const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-xl font-medium">Carregando...</span>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to={from} replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    // Ensure consistent light theme
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    // Add console logging to track route changes
    const logPageView = () => {
      console.log('Page view:', window.location.pathname);
    };
    
    window.addEventListener('popstate', logPageView);
    
    return () => {
      window.removeEventListener('popstate', logPageView);
    };
  }, []);

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
                  
                  <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
                  <Route path="/lock" element={<ProtectedRoute><LockScreen /></ProtectedRoute>} />
                  
                  <Route path="/dashboard" element={<ProtectedRoute><TrialGuard><DashboardPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/uploads" element={<ProtectedRoute><TrialGuard><UploadsPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/history" element={<ProtectedRoute><TrialGuard><HistoryPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><TrialGuard><ReportsPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><TrialGuard><ProfilePage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><TrialGuard><SettingsPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/help" element={<ProtectedRoute><TrialGuard><HelpPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/support" element={<ProtectedRoute><TrialGuard><SupportPage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/compare" element={<ProtectedRoute><TrialGuard><ComparePage /></TrialGuard></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  
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
