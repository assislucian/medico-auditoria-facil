
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Por favor, insira um email válido'),
});

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { resetPassword } = useAuth();

  const validateEmail = () => {
    try {
      emailSchema.parse({ email });
      setEmailError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      console.log("Email de recuperação enviado para:", email);
      toast.success('Email de recuperação enviado com sucesso!');
      setEmailSent(true);
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      toast.error('Erro ao enviar email de recuperação. Tente novamente.');
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
            Recupere o acesso à sua conta
          </p>
          
          <Card className="w-full max-w-md mx-auto glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Recuperar senha</CardTitle>
              <CardDescription className="text-center">
                {emailSent 
                  ? 'Verifique seu email para redefinir sua senha' 
                  : 'Insira seu email abaixo para receber um link de recuperação'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {emailSent ? (
                <div className="text-center space-y-4">
                  <p>
                    Enviamos um link de recuperação para <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                    O link é válido por 24 horas.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setEmailSent(false)}
                  >
                    Tentar com outro email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={emailError ? "border-destructive" : ""}
                    />
                    {emailError && (
                      <p className="text-sm text-destructive">{emailError}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                  </Button>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
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

export default ForgotPassword;
