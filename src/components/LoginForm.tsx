
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/components/auth/validation';
import { supabase } from '@/integrations/supabase/client';
import ErrorAlert from '@/components/auth/ErrorAlert';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import { z } from 'zod';
import { LoadingSpinner } from './ui/loading-spinner';
import { showAlert } from '@/utils/alertUtils';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signInWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract redirect URL from query parameters if it exists
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {email?: string, password?: string} = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') newErrors.email = err.message;
          if (err.path[0] === 'password') newErrors.password = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log(`Iniciando login para: ${email}`);
      
      const result = await signInWithPassword(email, password);
      
      if (result.error) {
        throw result.error;
      }

      if (!result.data?.user) {
        throw new Error('Não foi possível autenticar. Usuário não encontrado.');
      }
      
      console.log('Login bem-sucedido, buscando perfil do usuário');
      
      try {
        // Use uma consulta com timeout para evitar que a página fique presa
        const profilePromise = supabase
          .from('profiles')
          .select('trial_status')
          .eq('id', result.data.user.id)
          .single();
          
        // Set a timeout to prevent getting stuck
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        
        const profileResult = await Promise.race([profilePromise, timeoutPromise]) as any;
        
        if (profileResult.error) {
          console.error('Erro ao buscar perfil:', profileResult.error);
          // Se não conseguirmos obter o perfil, vamos para o dashboard
          showAlert('Sucesso', 'Login realizado com sucesso!', 'success');
          navigate(redirectUrl);
          return;
        }

        if (!profileResult.data?.trial_status || profileResult.data.trial_status === 'not_started') {
          console.log('Usuário sem trial ativo, redirecionando para welcome');
          showAlert('Sucesso', 'Login realizado com sucesso!', 'success');
          navigate('/welcome', { state: { returnTo: redirectUrl } });
        } else {
          console.log('Usuário com trial ativo, redirecionando para dashboard');
          showAlert('Sucesso', 'Login realizado com sucesso!', 'success');
          navigate(redirectUrl);
        }
      } catch (profileError) {
        console.error('Erro ou timeout ao buscar perfil:', profileError);
        // Em caso de erro ou timeout na busca do perfil, vamos para o dashboard
        showAlert('Sucesso', 'Login realizado com sucesso!', 'success');
        navigate(redirectUrl);
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      if (error.message && error.message.includes('Invalid login')) {
        setAuthError('Email ou senha incorretos. Verifique suas credenciais.');
      } else if (error.message && error.message.includes('Email not confirmed')) {
        setAuthError('Email ainda não confirmado. Verifique sua caixa de entrada e confirme seu email.');
      } else {
        setAuthError('Erro ao fazer login. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        throw error;
      }
      
      // No need for success toast here as the redirect will happen automatically
      // The success message will be shown in the callback handler
    } catch (error: any) {
      console.error('Erro ao fazer login com Google:', error);
      setAuthError('Erro ao fazer login com Google. Tente novamente mais tarde.');
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-center">
          Faça login na sua conta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorAlert message={authError} />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailField 
            email={email}
            setEmail={setEmail}
            error={errors.email}
          />
          
          <PasswordField 
            password={password}
            setPassword={setPassword}
            error={errors.password}
          />
          
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" /> 
                Entrando...
              </span>
            ) : 'Entrar'}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" /> 
                Conectando com Google...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Entrar com Google
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Ainda não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
