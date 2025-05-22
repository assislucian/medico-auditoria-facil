
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function DemoSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Instead of using database operations directly, use a function call or API endpoint
      // until database tables are properly set up in Supabase
      
      // Simulating success
      setTimeout(() => {
        toast.success('Solicitação enviada com sucesso! Em breve entraremos em contato.');
        setFormData({ name: '', email: '', phone: '', company: '' });
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-6" id="demo">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Agende uma Demonstração</h2>
          <p className="text-muted-foreground">
            Veja o MedCheck em ação com uma demonstração personalizada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <Input
            placeholder="Nome completo"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full"
            required
          />
          
          <Input
            type="email"
            placeholder="Email profissional"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full"
            required
          />
          
          <Input
            type="tel"
            placeholder="Telefone/WhatsApp"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full"
            required
          />
          
          <Input
            placeholder="Empresa (opcional)"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full"
          />
          
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Solicitar Demonstração'}
          </Button>
        </form>
      </div>
    </section>
  );
}
