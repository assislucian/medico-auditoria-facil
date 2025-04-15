
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  email: string;
  telefone: string;
  crm: string;
  especialidade: string;
  hospital: string;
  bio: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationPreferences {
  email: {
    newReports: boolean;
    systemUpdates: boolean;
    tips: boolean;
    newsletter: boolean;
  };
  sms: {
    criticalAlerts: boolean;
    paymentRecovery: boolean;
    invoiceReminders: boolean;
  };
}

export const useProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: ProfileData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSecurity = async (data: SecurityData) => {
    setLoading(true);
    try {
      // Validate passwords match
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("As senhas não conferem");
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao atualizar senha",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar sua senha",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationPreferences = async (preferences: NotificationPreferences) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao atualizar preferências",
        description: "Não foi possível atualizar suas preferências. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateProfile,
    updateSecurity,
    updateNotificationPreferences
  };
};
