
import { TestimonialCard } from "./testimonials/TestimonialCard";
import { TestimonialsHeader } from "./testimonials/TestimonialsHeader";

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
        <TestimonialsHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
