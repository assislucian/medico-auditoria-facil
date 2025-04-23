
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from "@/components/Navbar";
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Email inválido')
});

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      emailSchema.parse({ email });
      
      setIsLoading(true);
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setError('Por favor, insira um email válido');
      } else {
        console.error('Erro ao resetar senha:', error);
        setError('Não foi possível enviar o email de recuperação. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Recuperar Senha | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-4xl font-bold mb-2 text-gradient">MedCheck</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Recupere sua senha para continuar tendo acesso ao sistema.
          </p>
          
          <Card className="w-full max-w-md mx-auto glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Recuperação de Senha</CardTitle>
              <CardDescription className="text-center">
                Digite seu email para receber instruções de recuperação de senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {isSubmitted ? (
                <div className="text-center py-4">
                  <p className="mb-4">Enviamos instruções para recuperar sua senha para:</p>
                  <p className="font-bold mb-6">{email}</p>
                  <p className="text-sm text-muted-foreground">
                    Verifique sua caixa de entrada e siga as instruções para definir uma nova senha.
                    Se não receber o email em alguns minutos, verifique sua pasta de spam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar instruções'}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Lembrou sua senha?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Voltar para o login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
