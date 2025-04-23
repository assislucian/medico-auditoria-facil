import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Helmet } from 'react-helmet-async';

import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import WelcomePage from "./pages/Welcome";
import ResetPasswordPage from "./pages/ResetPassword";
import UpdatePasswordPage from "./pages/UpdatePassword";
import CompareView from "./components/ComparisonView";
import NewAuditPage from "./pages/NewAudit";

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Helmet>
          <title>MedCheck | Auditoria Médica Inteligente</title>
        </Helmet>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/welcome"
              element={<WelcomePage />}
            />
            <Route
              path="/compare"
              element={
                <PrivateRoute>
                  <CompareView />
                </PrivateRoute>
              }
            />
            <Route
              path="/new-audit"
              element={
                <PrivateRoute>
                  <NewAuditPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
