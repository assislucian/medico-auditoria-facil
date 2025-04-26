
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
import { Shield, Key, LogOut } from "lucide-react";

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
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-xl">Segurança</CardTitle>
          <CardDescription>
            Gerencie suas configurações de acesso
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 rounded-lg border bg-card">
            <Key className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <h3 className="font-medium">Senha</h3>
              <p className="text-sm text-muted-foreground">
                Altere sua senha de acesso ao sistema
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/update-password')}
              className="ml-auto"
            >
              Alterar Senha
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            variant="outline"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
          >
            <LogOut className="h-4 w-4" />
            Sair (Logout)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
