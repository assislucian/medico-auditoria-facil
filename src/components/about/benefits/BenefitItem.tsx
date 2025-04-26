
import { motion } from "framer-motion";
import { Clock, Headphones, PieChart, Puzzle, Search, Shield, TrendingUp } from "lucide-react";

interface BenefitItemProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

export function BenefitItem({ title, description, icon, index }: BenefitItemProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trend-up':
        return <TrendingUp className="h-6 w-6 text-primary" />;
      case 'clock':
        return <Clock className="h-6 w-6 text-primary" />;
      case 'search':
        return <Search className="h-6 w-6 text-primary" />;
      case 'headset':
        return <Headphones className="h-6 w-6 text-primary" />;
      case 'shield':
        return <Shield className="h-6 w-6 text-primary" />;
      case 'puzzle':
        return <Puzzle className="h-6 w-6 text-primary" />;
      default:
        return <PieChart className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start">
        <div className="mr-4 p-2 rounded-full bg-primary/10">
          {getIcon(icon)}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
