
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
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    } />
                    <Route path="/uploads" element={
                      <PrivateRoute>
                        <UploadPage />
                      </PrivateRoute>
                    } />
                    <Route path="/history" element={
                      <PrivateRoute>
                        <HistoryPage />
                      </PrivateRoute>
                    } />
                    <Route path="/reports" element={
                      <PrivateRoute>
                        <ReportsPage />
                      </PrivateRoute>
                    } />
                    <Route path="/compare" element={
                      <PrivateRoute>
                        <ComparePage />
                      </PrivateRoute>
                    } />
                    <Route path="/pricing" element={
                      <PrivateRoute>
                        <PricingPage />
                      </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    } />
                    <Route path="/settings" element={
                      <PrivateRoute>
                        <SettingsPage />
                      </PrivateRoute>
                    } />
                    <Route path="/support" element={
                      <PrivateRoute>
                        <SupportPage />
                      </PrivateRoute>
                    } />
                    <Route path="/help" element={
                      <PrivateRoute>
                        <HelpPage />
                      </PrivateRoute>
                    } />
                    <Route path="/notifications" element={
                      <PrivateRoute>
                        <NotificationsPage />
                      </PrivateRoute>
                    } />
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
