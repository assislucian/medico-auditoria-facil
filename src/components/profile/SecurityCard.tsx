
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, ShieldCheck, LogOut } from "lucide-react";

export function SecurityCard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <Card className="w-full hover:bg-accent/5 transition-colors border-primary/10">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-xl">Segurança</CardTitle>
          <CardDescription>
            Gerencie suas configurações de segurança
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="text-base font-medium">Acesso e Autenticação</h3>
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            Gerencie suas credenciais de acesso e opções de segurança
          </p>
          <div className="ml-6 mt-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className="w-full md:w-auto"
            >
              Alterar Senha
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            variant="outline"
            onClick={handleSignOut}
            className="w-full md:w-auto flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
          >
            <LogOut className="h-4 w-4" />
            Sair (Logout)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
