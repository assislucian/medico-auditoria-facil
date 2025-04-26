
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  tooltipContent?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

export function StatusCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  tooltipContent,
  variant = 'default'
}: StatusCardProps) {
  const variantStyles = {
    default: 'border-primary/20 bg-primary/5 hover:border-primary/30',
    success: 'border-success/20 bg-success/5 hover:border-success/30',
    error: 'border-destructive/20 bg-destructive/5 hover:border-destructive/30',
    warning: 'border-warning/20 bg-warning/5 hover:border-warning/30'
  };

  return (
    <Card className={cn("overflow-hidden transition-colors", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          {title}
          {tooltipContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
        <Icon className={cn("h-4 w-4", {
          "text-primary": variant === 'default',
          "text-success": variant === 'success',
          "text-destructive": variant === 'error',
          "text-warning": variant === 'warning'
        })} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span
              className={cn(
                "mr-1",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            em relação ao mês anterior
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
