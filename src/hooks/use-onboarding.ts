
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useOnboarding() {
  const location = useLocation();
  const { user } = useAuth();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      setShowTour(location.state?.startTour || (profile && !profile.onboarding_completed));
    };

    checkOnboardingStatus();
  }, [location.state?.startTour, user]);

  const updateOnboardingStatus = async (completed: boolean) => {
    try {
      const { data, error } = await supabase.rpc('update_onboarding_status', { 
        completed 
      });

      if (error) throw error;

      if (!data) {
        throw new Error('Failed to update onboarding status');
      }

      return true;
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      toast.error('Erro ao salvar progresso do tour');
      return false;
    }
  };

  return {
    showTour,
    updateOnboardingStatus
  };
}
