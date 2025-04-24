
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>
          Gerencie suas configurações de segurança
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/update-password')}
            className="w-full md:w-auto"
          >
            Alterar Senha
          </Button>
        </div>
        <div className="border-t pt-4">
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="w-full md:w-auto"
          >
            Sair (Logout)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
