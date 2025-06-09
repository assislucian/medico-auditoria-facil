
import { Card, CardContent } from "@/components/ui/card";

interface MissionCardProps {
  title: string;
  content: string;
}

export function MissionCard({ title, content }: MissionCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
}
