
import { CircleCheck } from "lucide-react";

interface BenefitItemProps {
  text: string;
}

export function BenefitItem({ text }: BenefitItemProps) {
  return (
    <div className="flex items-start gap-3">
      <CircleCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
      <span className="text-lg">{text}</span>
    </div>
  );
}
