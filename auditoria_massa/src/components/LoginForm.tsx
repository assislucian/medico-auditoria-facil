
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/components/auth/validation';
import ErrorAlert from '@/components/auth/ErrorAlert';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import { z } from 'zod';
import GoogleLoginButton from './auth/GoogleLoginButton';
import LoginButton from './auth/LoginButton';
import FormDivider from './auth/FormDivider';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signInWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        // Mock profile retrieval while database tables aren't properly set up
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast.success('Login realizado com sucesso!');
        navigate(redirectUrl);
      } catch (profileError) {
        console.error('Erro ou timeout ao buscar perfil:', profileError);
        toast.success('Login realizado com sucesso!');
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
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        throw error;
      }
      
    } catch (error: any) {
      console.error('Erro ao fazer login com Google:', error);
      setAuthError('Erro ao fazer login com Google. Tente novamente mais tarde.');
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
          
          <LoginButton isLoading={isLoading} />

          <FormDivider />

          <GoogleLoginButton onGoogleLogin={handleGoogleLogin} />
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
