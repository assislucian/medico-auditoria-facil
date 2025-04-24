
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TourNavigation } from './TourNavigation';
import { useOnboarding } from '@/hooks/use-onboarding';
import { tourSteps } from './tourSteps';

export function GuidedTour() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const navigate = useNavigate();
  const { completeTour, skipTour } = useOnboarding();

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      navigate(tourSteps[currentStep + 1].path);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await completeTour(dontShowAgain);
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleSkip = async () => {
    await skipTour(dontShowAgain);
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
        
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="dontShowAgain" 
            checked={dontShowAgain} 
            onCheckedChange={(checked) => setDontShowAgain(checked === true)}
          />
          <Label htmlFor="dontShowAgain">Não mostrar novamente</Label>
        </div>
        
        <TourNavigation 
          currentStep={currentStep}
          totalSteps={tourSteps.length}
          onNext={handleNext}
          onSkip={handleSkip}
          dontShowAgain={dontShowAgain}
        />
      </DialogContent>
    </Dialog>
  );
}
