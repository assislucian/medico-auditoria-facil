
import { MessageSquare } from "lucide-react";

export function TestimonialsHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <MessageSquare className="w-8 h-8 text-primary mb-4" />
      <h2 className="text-3xl font-bold">O que dizem nossos usuários</h2>
    </div>
  );
}
