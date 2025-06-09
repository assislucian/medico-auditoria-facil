
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PasswordChangeFormProps {
  loading: boolean;
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

export const PasswordChangeForm = ({ loading, onSubmit }: PasswordChangeFormProps) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem", {
        description: "A nova senha e a confirmação devem ser iguais."
      });
      return;
    }

    await onSubmit(formData);
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="current">Senha Atual</Label>
        <Input
          id="current"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new">Nova Senha</Label>
        <Input
          id="new"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm">Confirmar Nova Senha</Label>
        <Input
          id="confirm"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Processando..." : "Alterar Senha"}
      </Button>
    </form>
  );
};
