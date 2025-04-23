
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, SkipForward } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  path: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Bem-vindo ao Dashboard",
    description: "Aqui você encontra uma visão geral dos seus pagamentos e glosas.",
    path: "/dashboard"
  },
  {
    title: "Envie seus Documentos",
    description: "Clique em 'Uploads' no menu lateral para enviar seus contracheques e guias.",
    path: "/uploads"
  },
  {
    title: "Acompanhe seu Histórico",
    description: "Visualize todas as suas análises anteriores e seus resultados.",
    path: "/history"
  },
  {
    title: "Configure seu Perfil",
    description: "Personalize suas informações e preferências de notificação.",
    path: "/profile"
  }
];

export function GuidedTour() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to the current step's path
    if (isOpen && tourSteps[currentStep]) {
      navigate(tourSteps[currentStep].path);
    }
  }, [currentStep, isOpen, navigate]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleSkip = () => {
    handleComplete();
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
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {currentStep < tourSteps.length - 1 ? (
              <>
                Próximo
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              'Começar a usar'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
