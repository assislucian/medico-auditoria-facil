import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { z } from 'zod';
import { LoadingSpinner } from './ui/loading-spinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const registerSchema = z.object({
  uf: z.string().min(2, 'Selecione a UF'),
  crm: z.string().min(4, 'Informe o CRM'),
  nome: z.string().min(2, 'Informe o nome completo'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter símbolo'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

const TERMS_VERSION = "2025-05-05"; // Atualize conforme a versão/data dos termos

const RegisterForm = () => {
  const [uf, setUf] = useState('');
  const [crm, setCrm] = useState('');
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{uf?: string, crm?: string, nome?: string, password?: string, confirmPassword?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    try {
      registerSchema.parse({ uf, crm, nome, password, confirmPassword });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {uf?: string, crm?: string, nome?: string, password?: string, confirmPassword?: string} = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'uf') newErrors.uf = err.message;
          if (err.path[0] === 'crm') newErrors.crm = err.message;
          if (err.path[0] === 'nome') newErrors.nome = err.message;
          if (err.path[0] === 'password') newErrors.password = err.message;
          if (err.path[0] === 'confirmPassword') newErrors.confirmPassword = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setAcceptError(null);
    if (!acceptedTerms) {
      setAcceptError('É necessário aceitar os Termos de Uso e a Política de Privacidade para se cadastrar.');
      return;
    }
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/v1/register`, {
        uf,
        crm,
        nome,
        senha: password,
        terms_accepted: acceptedTerms,
        terms_version: TERMS_VERSION
      });
      toast.success('Cadastro realizado com sucesso! Faça login abaixo.');
      navigate('/login');
    } catch (error: any) {
      setRegisterError(error?.response?.data?.detail || 'Erro ao realizar cadastro. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Cadastro</CardTitle>
        <CardDescription className="text-center">
          Crie sua conta para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {registerError && (
          <div className="mb-4 text-red-600 text-center text-sm">{registerError}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="uf" className="block text-sm font-medium mb-1">UF</label>
            <select
              id="uf"
              value={uf}
              onChange={e => setUf(e.target.value)}
              className="input input-bordered w-full"
              disabled={isLoading}
            >
              <option value="">Selecione</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
            {errors.uf && <div className="text-xs text-red-600 mt-1">{errors.uf}</div>}
          </div>
          <div>
            <label htmlFor="crm" className="block text-sm font-medium mb-1">CRM</label>
            <input
              id="crm"
              type="text"
              value={crm}
              onChange={e => setCrm(e.target.value)}
              className="input input-bordered w-full"
              autoComplete="username"
              disabled={isLoading}
            />
            {errors.crm && <div className="text-xs text-red-600 mt-1">{errors.crm}</div>}
          </div>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome completo</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="input input-bordered w-full"
              autoComplete="name"
              disabled={isLoading}
            />
            {errors.nome && <div className="text-xs text-red-600 mt-1">{errors.nome}</div>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input input-bordered w-full"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirme a senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.confirmPassword && <div className="text-xs text-red-600 mt-1">{errors.confirmPassword}</div>}
          </div>
          <div className="flex items-start gap-2 mt-2">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={e => setAcceptedTerms(e.target.checked)}
              className="mt-1"
              disabled={isLoading}
              required
            />
            <label htmlFor="acceptTerms" className="text-xs text-muted-foreground select-none">
              Declaro que li e concordo com os <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Termos de Uso</a> e a <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Política de Privacidade</a> do MedCheck, e estou ciente do tratamento de dados conforme LGPD.
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-2 mt-1">
            <strong>Atenção:</strong> O uso do MedCheck não substitui a análise profissional. O usuário é responsável pelos dados inseridos e pelas decisões tomadas a partir dos relatórios da plataforma.
          </p>
          {acceptError && <div className="text-xs text-red-600 mt-1">{acceptError}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" /> 
                Cadastrando...
              </span>
            ) : 'Cadastrar'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Já tem uma conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link></span>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
