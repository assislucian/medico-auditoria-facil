
import { Card, CardContent } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";

interface ProblemCardProps {
  title: string;
  description: string;
  index: number;
}

export function ProblemCard({ title, description, index }: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <div className="mr-4 p-2 rounded-full bg-destructive/10">
              <AlertOctagon className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
