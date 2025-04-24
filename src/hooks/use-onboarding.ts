
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
        
        // If the user hasn't completed onboarding and no explicit startTour state
        // is provided, show the tour
        if (!data?.onboarding_completed && !state?.hasOwnProperty('startTour')) {
          setShowTour(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboardingStatus();
  }, [location, user]);

  const completeTour = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('update_onboarding_status', {
        completed: true
      });

      if (error) throw error;

      setOnboardingCompleted(true);
      setShowTour(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const skipTour = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('update_onboarding_status', {
        completed: false
      });

      if (error) throw error;

      setShowTour(false);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const resetTour = () => {
    setShowTour(true);
  };

  return {
    showTour,
    onboardingCompleted,
    completeTour,
    skipTour,
    resetTour
  };
}
