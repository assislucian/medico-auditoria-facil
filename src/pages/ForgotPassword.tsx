
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { handlePasswordReset } from '@/contexts/auth/authUtils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await handlePasswordReset(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Erro ao enviar email de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout title="Recuperar Senha">
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <Card className="w-full max-w-md glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Recuperação de senha</CardTitle>
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
            
            {success ? (
              <Alert className="mb-4">
                <AlertDescription>
                  Enviamos um email com instruções para recuperar sua senha.
                  Por favor, verifique sua caixa de entrada.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email" 
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" /> 
                      Enviando...
                    </span>
                  ) : 'Enviar instruções'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">
                Voltar para login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default ForgotPassword;
