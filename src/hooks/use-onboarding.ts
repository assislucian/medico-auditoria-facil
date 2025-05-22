
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function useOnboarding() {
  const [showTour, setShowTour] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  /**
   * Effect that checks if the tour should be shown based on URL state
   * or the user's onboarding status.
   */
  useEffect(() => {
    // Check if there is a parameter in the URL indicating to start the tour
    const state = location.state as { startTour?: boolean } | null;
    if (state?.startTour) {
      setShowTour(true);
      return;
    }
    
    // Check the onboarding status for the current user
    const checkOnboardingStatus = async () => {
      if (!user) return;
      
      try {
        // Mock onboarding status check
        // In a real implementation, this would fetch from the database
        const mockOnboardingCompleted = false; // Default to not completed
        
        // Update state based on the fetched value
        setOnboardingCompleted(mockOnboardingCompleted);
        
        // Show tour if the user hasn't completed onboarding
        if (!mockOnboardingCompleted) {
          setShowTour(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboardingStatus();
  }, [location, user]);

  /**
   * Updates the onboarding status
   */
  const updateOnboardingStatus = async (completed: boolean) => {
    if (!user) return;

    try {
      // Mock the RPC function call
      // This would be replaced with a real function call once database is set up
      console.log(`Setting onboarding status to: ${completed}`);
      
      setOnboardingCompleted(completed);
      return { success: true };
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      throw error;
    }
  };

  /**
   * Marks the tour as complete and optionally updates the status
   */
  const completeTour = async (dontShowAgain = false) => {
    if (dontShowAgain) {
      await updateOnboardingStatus(true);
    }
    setShowTour(false);
  };

  /**
   * Skips the tour and optionally updates the status
   */
  const skipTour = async (dontShowAgain = false) => {
    if (dontShowAgain) {
      await updateOnboardingStatus(true);
    }
    setShowTour(false);
  };

  /**
   * Resets the tour, setting the status to not completed
   */
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
