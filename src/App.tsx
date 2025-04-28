
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import About from "@/pages/About";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Uploads from "@/pages/Uploads";
import History from "@/pages/History";
import CompareContracheque from "@/pages/CompareContracheque";
import Help from "@/pages/Help";
import UnpaidProcedures from "@/pages/UnpaidProcedures";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Support from "@/pages/Support";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/AuthCallback";

// Import the new GuideAnalysisPage
import GuideAnalysisPage from './pages/GuideAnalysis';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Pode ser substituído por um spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/uploads" element={<PrivateRoute><Uploads /></PrivateRoute>} />
      <Route path="/analysis/:id" element={<PrivateRoute><GuideAnalysisPage /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/compare" element={<PrivateRoute><CompareContracheque /></PrivateRoute>} />
      <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />
      <Route path="/divergences" element={<PrivateRoute><UnpaidProcedures /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
