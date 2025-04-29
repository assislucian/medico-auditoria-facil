
import React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "1" | "2" | "3" | "4" | "5" | "6";
}

/**
 * Heading component with consistent styling
 */
export function Heading({
  as: Component = "h2",
  size,
  className,
  children,
  ...props
}: HeadingProps) {
  // Determine which size class to use
  const sizeToClass = {
    "1": "text-4xl font-bold tracking-tight",
    "2": "text-3xl font-semibold tracking-tight",
    "3": "text-2xl font-semibold tracking-tight",
    "4": "text-xl font-semibold tracking-tight",
    "5": "text-lg font-semibold tracking-tight",
    "6": "text-base font-semibold tracking-tight",
  };
  
  // Default to size based on component type if not specified
  const resolvedSize = size || (Component === "h1" ? "1" : Component === "h2" ? "2" : Component === "h3" ? "3" : Component === "h4" ? "4" : Component === "h5" ? "5" : "6");
  
  return (
    <Component 
      className={cn(sizeToClass[resolvedSize as keyof typeof sizeToClass], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "lead" | "large" | "small" | "muted";
}

/**
 * Text component with consistent styling
 */
export function Text({
  variant = "default",
  className,
  children,
  ...props
}: TextProps) {
  const variantClasses = {
    default: "text-base leading-7",
    lead: "text-lg leading-7 text-foreground",
    large: "text-lg font-medium",
    small: "text-sm leading-tight",
    muted: "text-sm text-muted-foreground",
  };

  return (
    <p 
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {children}
    </p>
  );
}

export interface BlockquoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {}

/**
 * Blockquote component with consistent styling
 */
export function Blockquote({
  className,
  children,
  ...props
}: BlockquoteProps) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground", className)}
      {...props}
    >
      {children}
    </blockquote>
  );
}

export interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * InlineCode component with consistent styling
 */
export function InlineCode({
  className,
  children,
  ...props
}: InlineCodeProps) {
  return (
    <code
      className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </code>
  );
}
