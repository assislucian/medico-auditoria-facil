
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "O MedCheck transformou completamente a maneira como gerencio meus honorários. É uma ferramenta indispensável.",
      author: "Dra. Maria Silva",
      role: "Cardiologista",
    },
    {
      quote: "Recuperei valores que nem sabia que estava perdendo. O retorno sobre o investimento foi impressionante.",
      author: "Dr. João Santos",
      role: "Cirurgião Geral",
    },
    {
      quote: "A automatização do processo de auditoria me permite focar mais tempo no atendimento aos pacientes.",
      author: "Dra. Ana Oliveira",
      role: "Pediatra",
    }
  ];

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <MessageSquare className="w-8 h-8 text-primary mb-4" />
          <h2 className="text-3xl font-bold">O que dizem nossos usuários</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="backdrop-blur-sm">
              <CardContent className="p-6">
                <blockquote className="mb-4 text-lg italic">
                  "{testimonial.quote}"
                </blockquote>
                <footer>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
