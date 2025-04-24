
import { createContext, useState, useContext, ReactNode } from 'react';

interface OnboardingContextProps {
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const skipOnboarding = () => {
    setShowOnboarding(false);
    setCurrentStep(0);
    localStorage.setItem('onboarding-skipped', 'true');
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setCurrentStep(0);
    localStorage.setItem('onboarding-completed', 'true');
  };

  return (
    <OnboardingContext.Provider
      value={{
        showOnboarding,
        setShowOnboarding,
        currentStep,
        setCurrentStep,
        skipOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
