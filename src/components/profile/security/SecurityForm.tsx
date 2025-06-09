
import { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const SecurityForm = () => {
  const { updateSecurity } = useProfile();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }

    setLoading(true);
    try {
      await updateSecurity({
        currentPassword,
        newPassword,
        confirmPassword
      });
      
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast.success("Senha atualizada com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar senha");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Alterar Senha</h3>
        <p className="text-sm text-muted-foreground">
          Atualize sua senha de acesso ao sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="currentPassword">Senha Atual</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="newPassword">Nova Senha</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <Button type="submit" disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar Senha"}
        </Button>
      </form>

      <div className="border-t pt-6">
        <Button
          variant="destructive"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};
