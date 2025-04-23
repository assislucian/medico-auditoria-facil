
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/components/auth/validation';
import { supabase } from '@/integrations/supabase/client';
import ErrorAlert from '@/components/auth/ErrorAlert';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import { z } from 'zod';  // Added missing import for 'z'

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();

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
      
      const { data } = await signInWithPassword(email, password);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('trial_status')
        .eq('id', data.user?.id)
        .single();

      if (!profileData?.trial_status) {
        navigate('/welcome');
      } else {
        navigate('/dashboard');
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
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
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
