
import { HeartHandshake } from "lucide-react";

export function MissionHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <div className="bg-primary/10 p-4 rounded-full mb-6">
        <HeartHandshake className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
      <p className="text-lg text-muted-foreground max-w-2xl">
        Capacitar profissionais da saúde com tecnologia avançada para simplificar 
        a gestão de honorários médicos, permitindo que se concentrem no que realmente 
        importa: o cuidado com os pacientes.
      </p>
    </div>
  );
}
