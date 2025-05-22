import { ReactNode } from "react";
import clsx from "clsx";

interface InfoCardProps {
  icon?: ReactNode;
  title: string;
  value?: ReactNode;
  description?: string;
  variant?: "info" | "success" | "warning" | "danger" | "neutral";
  elevation?: "flat" | "raised" | "elevated";
  className?: string;
  children?: ReactNode;
}

const variantStyles = {
  info:    "bg-primary/15 text-primary dark:bg-primary/40 dark:text-primary",
  success: "bg-success/15 text-success dark:bg-success/40 dark:text-success",
  warning: "bg-warning/15 text-warning dark:bg-warning/40 dark:text-warning",
  danger:  "bg-danger/15 text-danger dark:bg-danger/40 dark:text-danger",
  neutral: "bg-card border-border text-body dark:bg-card-dark dark:border-border-dark dark:text-body-dark",
};

const elevationStyles = {
  flat: "shadow-none border",
  raised: "shadow-sm border",
  elevated: "shadow-lg border",
};

/**
 * InfoCard - Card de informação com ícone, título, valor, descrição e children customizáveis.
 * @param {InfoCardProps} props
 */
export function InfoCard({
  icon,
  title,
  value,
  description,
  variant = "neutral",
  elevation = "raised",
  className = "",
  children,
}: InfoCardProps) {
  return (
    <div
      tabIndex={0}
      className={clsx(
        "rounded-xl p-2 flex flex-col gap-0.5 min-w-0 transition-all duration-150 outline-none",
        variantStyles[variant],
        elevationStyles[elevation],
        "hover:shadow-md hover:scale-[1.015] focus:shadow-lg focus:scale-[1.015]",
        "focus-visible:ring-2 focus-visible:ring-brand/60",
        "cursor-pointer",
        className
      )}
      aria-label={title}
      role={variant === "danger" || variant === "warning" ? "alert" : undefined}
    >
      <div className="flex items-center gap-2 mb-0.5">
        {icon && <span className="shrink-0 text-lg md:text-xl">{icon}</span>}
        <span className="font-semibold text-sm md:text-base truncate flex-1">{title}</span>
      </div>
      {value && <div className="text-xl md:text-2xl font-extrabold text-ink mb-0.5 truncate">{value}</div>}
      {description && <div className="text-xs md:text-sm text-muted-foreground mb-0.5 truncate">{description}</div>}
      {children && <div className="mt-0.5 [&_button]:text-base">{children}</div>}
    </div>
  );
}

export default InfoCard; 