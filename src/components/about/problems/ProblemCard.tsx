
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProblemCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ProblemCard({ icon: Icon, title, description }: ProblemCardProps) {
  return (
    <Card className="border-2 hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
