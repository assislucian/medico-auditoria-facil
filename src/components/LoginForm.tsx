
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
});

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'magic' | 'password'>('magic');
  const { signIn, signInWithPassword } = useAuth();

  // For demonstration purposes - creates a test user with no email confirmation needed
  const createTestUser = async () => {
    setIsLoading(true);
    try {
      const testEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
      const testPassword = "Password123!";
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });
      
      if (error) throw error;
      
      toast.success(`Usuário de teste criado: ${testEmail} / ${testPassword}`);
      setEmail(testEmail);
      setPassword(testPassword);
      
      console.log("Usuário de teste criado:", { email: testEmail, password: testPassword });
    } catch (error: any) {
      console.error('Erro ao criar usuário de teste:', error);
      toast.error('Erro ao criar usuário de teste');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    try {
      if (loginMethod === 'magic') {
        z.object({ email: z.string().email('Email inválido') }).parse({ email });
      } else {
        loginSchema.parse({ email, password });
      }
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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log(`Iniciando processo de login ${loginMethod} para:`, email);
      
      // Teste de conectividade com o Supabase
      try {
        const { data: pingData, error: pingError } = await supabase.from('profiles').select('count');
        console.log("Teste de conectividade com Supabase:", pingError ? "Falha" : "Sucesso", pingData, pingError);
      } catch (pingError) {
        console.error("Erro ao testar conectividade com Supabase:", pingError);
      }
      
      if (loginMethod === 'magic') {
        await signIn(email);
        toast.success('Verifique seu email para o link de login mágico!');
      } else {
        await signInWithPassword(email, password);
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      if (error.message && error.message.includes('Invalid login')) {
        toast.error('Email ou senha incorretos. Verifique suas credenciais.');
      } else if (error.message && error.message.includes('Email not confirmed')) {
        toast.error('Email ainda não confirmado. Verifique sua caixa de entrada.');
      } else {
        toast.error('Erro ao fazer login. Tente novamente mais tarde.');
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
        <Tabs defaultValue="magic" onValueChange={(value) => setLoginMethod(value as 'magic' | 'password')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="magic">Link Mágico</TabsTrigger>
            <TabsTrigger value="password">Senha</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
                required
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            {loginMethod === 'password' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                    required={loginMethod === 'password'}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    <span className="sr-only">
                      {showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : loginMethod === 'magic' ? 'Enviar link de login' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={createTestUser}
              disabled={isLoading}
            >
              Criar usuário de teste
            </Button>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Cria um usuário temporário para testes sem precisar de confirmação por email
            </p>
          </div>
        </Tabs>
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
