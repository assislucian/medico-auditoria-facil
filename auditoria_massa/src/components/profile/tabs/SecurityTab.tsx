
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SecurityForm } from "../security/SecurityForm";
import { Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export const SecurityTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Segurança da Conta
        </CardTitle>
        <CardDescription>
          Gerencie suas credenciais e configurações de segurança
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-muted border-primary/20">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle>Proteção de dados médicos</AlertTitle>
          <AlertDescription className="text-sm">
            Recomendamos utilizar senhas fortes e ativar a autenticação em duas etapas para 
            proteger seus dados médicos e dos pacientes conforme exigências da LGPD e CFM.
          </AlertDescription>
        </Alert>
        
        <SecurityForm />
      </CardContent>
    </Card>
  );
};
