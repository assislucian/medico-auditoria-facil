
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Uploads from "./pages/Uploads";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Pricing from "./pages/Pricing";
import CheckoutPage from "./components/checkout/CheckoutPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import About from "./pages/About";
import CompareContracheque from "./pages/CompareContracheque";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

// Componente de callback para autenticação
const AuthCallback = () => {
  useEffect(() => {
    // Extraindo parâmetros da URL após redirecionamento do Supabase
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback - URL completa:", window.location.href);
        
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        console.log("Auth callback - Hash params:", Object.fromEntries(hashParams.entries()));
        console.log("Auth callback - Query params:", Object.fromEntries(queryParams.entries()));
        
        // Se for um redirecionamento de recuperação de senha
        if ((hashParams.get('type') === 'recovery' || queryParams.get('type') === 'recovery')) {
          console.log("Redirecionando para página de redefinição de senha");
          window.location.href = '/reset-password' + window.location.hash + window.location.search;
          return;
        }
        
        // Para outros tipos de autenticação, redirecionar para dashboard
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

// Protected Route component
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

// Guest Only Route component (prevents authenticated users from accessing login/register)
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
  // Force light theme at app start
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
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* Auth callback route */}
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  
                  {/* Guest-only routes */}
                  <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
                  <Route path="/register" element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />
                  <Route path="/forgot-password" element={<GuestOnlyRoute><ForgotPassword /></GuestOnlyRoute>} />
                  <Route path="/reset-password" element={<GuestOnlyRoute><ResetPassword /></GuestOnlyRoute>} />
                  
                  {/* Protected routes */}
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/uploads" element={<ProtectedRoute><Uploads /></ProtectedRoute>} />
                  <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
                  <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                  <Route path="/compare" element={<ProtectedRoute><CompareContracheque /></ProtectedRoute>} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
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
