
import { DemoRequestForm } from '@/components/DemoRequestForm';

export function DemoSection() {
  return (
    <section className="py-20 px-6" id="demo">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Agende uma Demonstração</h2>
          <p className="text-muted-foreground">
            Veja o MedCheck em ação com uma demonstração personalizada
          </p>
        </div>

        <div className="animate-fade-in">
          <DemoRequestForm />
        </div>
      </div>
    </section>
  );
}
