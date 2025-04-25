
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
import { Shield } from "lucide-react";

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
    <Card className="w-full bg-card hover:bg-accent/5 transition-colors">
      <CardHeader className="flex flex-row items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <div>
          <CardTitle className="text-xl">Segurança</CardTitle>
          <CardDescription>
            Gerencie suas configurações de segurança
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/update-password')}
            className="w-full md:w-auto"
          >
            Alterar Senha
          </Button>
        </div>
        <div className="pt-4 border-t">
          <Button 
            variant="outline"
            onClick={handleSignOut}
            className="w-full md:w-auto text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
          >
            Sair (Logout)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
