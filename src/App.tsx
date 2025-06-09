
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import CompareContracheque from "./pages/CompareContracheque";
import HistoryPage from "./pages/History";
import HelpPage from "./pages/Help";
import NotificationsPage from "./pages/Notifications";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";
import NotFoundPage from "./pages/NotFound";
import SupportPage from "./pages/Support";
import AuthCallback from "./pages/AuthCallback";
import GuidesPage from "./pages/Guides";
import DemonstrativesPage from "./pages/Demonstratives";
import UnpaidProceduresPage from "./pages/UnpaidProcedures";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import PublicHelpPage from "./pages/PublicHelp";
import PricingPage from "./pages/Pricing";

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/help" element={<PublicHelpPage />} />
                
                {/* Todas as rotas agora são públicas para testes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/help/private" element={<HelpPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/demonstratives" element={<DemonstrativesPage />} />
                <Route path="/unpaid-procedures" element={<UnpaidProceduresPage />} />
                <Route path="/compare" element={<CompareContracheque />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                
                <Route path="/about" element={<AboutPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
