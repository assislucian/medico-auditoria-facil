
import { Button } from "@/components/ui/button";
import { ArrowRight, SkipForward } from "lucide-react";

interface TourNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
  dontShowAgain?: boolean;
}

export function TourNavigation({ currentStep, totalSteps, onNext, onSkip, dontShowAgain }: TourNavigationProps) {
  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="flex items-center justify-between mt-6 gap-4">
      <Button
        variant="outline"
        onClick={handleSkip}
        className="flex items-center gap-2"
      >
        <SkipForward className="h-4 w-4" />
        Pular Tour
      </Button>
      
      <Button
        onClick={onNext}
        className="flex items-center gap-2"
      >
        {currentStep < totalSteps - 1 ? (
          <>
            Próximo
            <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          'Começar a usar'
        )}
      </Button>
    </div>
  );
}
