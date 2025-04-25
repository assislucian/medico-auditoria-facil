
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import UploadPage from './pages/Uploads';
import HistoryPage from './pages/History';
import ReportsPage from './pages/Reports';
import ComparePage from './pages/CompareContracheque';
import PricingPage from './pages/Pricing';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import SupportPage from './pages/Support';
import HelpPage from './pages/Help';
import PrivateRoute from './components/PrivateRoute';
import { useTheme } from "@/hooks/use-theme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import NotFoundPage from './pages/NotFound';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'sonner';
import NotificationsPage from './pages/Notifications';
import { AlertDialogProvider } from './components/ui/alert-dialog-provider';

const queryClient = new QueryClient();

// Theme provider implementation
const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AlertDialogProvider>
            <ThemeProviderWrapper>
              <QueryClientProvider client={queryClient}>
                <HelmetProvider>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<LoginPage />} />
                    
                    {/* Private routes - use element prop with PrivateRoute component */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/uploads" element={<UploadPage />} />
                      <Route path="/history" element={<HistoryPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/support" element={<SupportPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                    </Route>
                    
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                  <Toaster position="top-right" expand={true} richColors closeButton />
                </HelmetProvider>
              </QueryClientProvider>
            </ThemeProviderWrapper>
          </AlertDialogProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
