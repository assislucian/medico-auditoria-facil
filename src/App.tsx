
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import NewAuditPage from "./pages/NewAudit";
import AnalysisPage from "./pages/Analysis";
import CompareContracheque from "./pages/CompareContracheque";
import HistoryPage from "./pages/History";
import ReferenceTablesPage from "./pages/ReferenceTables";
import HelpPage from "./pages/Help";
import NotificationsPage from "./pages/Notifications";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";
import NotFoundPage from "./pages/NotFound";
import SupportPage from "./pages/Support";

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <NotificationProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/uploads" element={<NewAuditPage />} />
                  <Route path="/analysis/:id" element={<AnalysisPage />} />
                  <Route path="/compare" element={<CompareContracheque />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/reference-tables" element={<ReferenceTablesPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Toaster richColors position="top-right" />
              </NotificationProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
