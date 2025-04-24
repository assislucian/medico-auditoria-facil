
/**
 * App.tsx
 * 
 * Componente raiz da aplicação que define as rotas e
 * configura os providers globais como autenticação e tema.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './hooks/use-theme';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';

// Páginas
import Index from './pages/Index';                  // Página inicial
import About from './pages/About';                  // Página sobre
import Contact from './pages/Contact';              // Página de contato
import Login from './pages/Login';                  // Página de login
import Register from './pages/Register';            // Página de registro
import Dashboard from './pages/Dashboard';          // Dashboard principal
import Profile from './pages/Profile';              // Perfil do usuário
import Uploads from './pages/Uploads';              // Página de uploads
import History from './pages/History';              // Histórico de análises
import Reports from './pages/Reports';              // Relatórios
import NotFound from './pages/NotFound';            // Página 404
import ForgotPassword from './pages/ForgotPassword';// Recuperação de senha
import ResetPassword from './pages/ResetPassword';  // Redefinição de senha
import UpdatePassword from './pages/UpdatePassword';// Atualização de senha
import LockScreen from './pages/LockScreen';        // Tela de bloqueio
import NewAudit from './pages/NewAudit';            // Nova auditoria
import Settings from './pages/Settings';            // Configurações
import Help from './pages/Help';                    // Ajuda
import CompareContracheque from './pages/CompareContracheque'; // Comparativo
import Welcome from './pages/Welcome';              // Boas-vindas
import Support from './pages/Support';              // Suporte
import Pricing from './pages/Pricing';              // Preços
import Checkout from './pages/Checkout';            // Checkout

// Componentes
import PrivateRoute from './components/PrivateRoute';  // Proteção de rotas privadas

/**
 * Componente principal da aplicação.
 * Configura o roteamento e os providers globais.
 */
function App() {
  return (
    <Router>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            {/* Sistema de notificações toast */}
            <Toaster position="top-center" richColors closeButton />
            
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Rotas protegidas (requer autenticação) */}
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
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/lock-screen" element={<LockScreen />} />
                <Route path="/new-audit" element={<NewAudit />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/compare/:id" element={<CompareContracheque />} />
              </Route>
              
              {/* Rota de fallback (404) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;
