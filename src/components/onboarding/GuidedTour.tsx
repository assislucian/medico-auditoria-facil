
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TourNavigation } from './TourNavigation';
import { useOnboarding } from '@/hooks/use-onboarding';
import { tourSteps } from './tourSteps';

export function GuidedTour() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { updateOnboardingStatus } = useOnboarding();

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      navigate(tourSteps[currentStep + 1].path);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await updateOnboardingStatus(true);
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleSkip = async () => {
    await updateOnboardingStatus(false);
    setIsOpen(false);
    navigate('/dashboard');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tourSteps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {tourSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        
        <TourNavigation 
          currentStep={currentStep}
          totalSteps={tourSteps.length}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </DialogContent>
    </Dialog>
  );
}
