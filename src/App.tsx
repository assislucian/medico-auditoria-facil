import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './hooks/use-theme';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Uploads from './pages/Uploads';
import History from './pages/History';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import LockScreen from './pages/LockScreen';
import NewAudit from './pages/NewAudit';
import Settings from './pages/Settings';
import Help from './pages/Help';
import CompareContracheque from './pages/CompareContracheque';
import Welcome from './pages/Welcome';
import Support from './pages/Support';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <HelmetProvider>
        <ThemeProvider>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/lock-screen" element={<LockScreen />} />
            <Route path="/new-audit" element={<NewAudit />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/uploads" element={<Uploads />} />
              <Route path="/history" element={<History />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/help" element={<Help />} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/compare/:id" element={<CompareContracheque />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;
