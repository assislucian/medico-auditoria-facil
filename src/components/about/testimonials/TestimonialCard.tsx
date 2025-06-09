
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card className="backdrop-blur-sm">
      <CardContent className="p-6">
        <blockquote className="mb-4 text-lg italic">"{quote}"</blockquote>
        <footer>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </footer>
      </CardContent>
    </Card>
  );
}
