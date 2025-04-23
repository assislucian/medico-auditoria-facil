
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useProfileSecurity = () => {
  const [loading, setLoading] = useState(false);

  const updateSecurity = async (data: SecurityData): Promise<boolean> => {
    setLoading(true);
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("As senhas não conferem");
      }
      
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      toast.success("Senha atualizada", {
        description: "Sua senha foi atualizada com sucesso."
      });
      
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar senha", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar sua senha"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateSecurity
  };
};
