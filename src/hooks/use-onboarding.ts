
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useOnboarding() {
  const [showTour, setShowTour] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if the tour should be shown based on URL state
    const state = location.state as { startTour?: boolean } | null;
    if (state?.startTour) {
      setShowTour(true);
      return;
    }
    
    // Check if the user has already completed onboarding
    const checkOnboardingStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setOnboardingCompleted(!!data?.onboarding_completed);
        
        // If the user hasn't completed onboarding, show the tour
        if (!data?.onboarding_completed) {
          setShowTour(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboardingStatus();
  }, [location, user]);

  const updateOnboardingStatus = async (completed: boolean) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('update_onboarding_status', {
        completed
      });

      if (error) throw error;

      setOnboardingCompleted(completed);
      return data;
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      throw error;
    }
  };

  const completeTour = async (dontShowAgain = false) => {
    if (dontShowAgain) {
      await updateOnboardingStatus(true);
    }
    setShowTour(false);
  };

  const skipTour = async (dontShowAgain = false) => {
    if (dontShowAgain) {
      await updateOnboardingStatus(true);
    }
    setShowTour(false);
  };

  const resetTour = () => {
    updateOnboardingStatus(false);
    setShowTour(true);
  };

  return {
    showTour,
    onboardingCompleted,
    updateOnboardingStatus,
    completeTour,
    skipTour,
    resetTour
  };
}
