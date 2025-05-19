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
  info:    "bg-blue-50/40 border-blue-100/30 text-blue-900 dark:bg-blue-900/30 dark:border-blue-800/40 dark:text-blue-100",
  success: "bg-green-50/40 border-green-100/30 text-green-900 dark:bg-green-900/30 dark:border-green-800/40 dark:text-green-100",
  warning: "bg-amber-50/40 border-amber-200/40 text-amber-900 dark:bg-amber-900/30 dark:border-amber-800/40 dark:text-amber-100",
  danger:  "bg-red-50/40 border-red-100/30 text-red-900 dark:bg-red-900/30 dark:border-red-800/40 dark:text-red-100",
  neutral: "bg-white/60 border-gray-100/40 text-gray-900 dark:bg-zinc-900/60 dark:border-zinc-800/40 dark:text-gray-100",
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