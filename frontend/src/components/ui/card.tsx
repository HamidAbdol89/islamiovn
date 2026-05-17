import * as React from "react"

import { cn } from "@/lib/utils"

// ─── Card variants ─────────────────────────────────────────────────────────
// default   — card surface từ --card variable
// glass     — glass-card utility từ index.css (backdrop-blur)
// sacred    — glass + sacred-glow (primary teal glow)
// compact   — padding nhỏ hơn cho mobile list item
// flat      — không border, không shadow — dùng trong list

type CardVariant = "default" | "glass" | "sacred" | "compact" | "flat"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

function cardVariantClasses(variant: CardVariant = "default"): string {
  const base = "text-card-foreground transition-all duration-220"

  const variants: Record<CardVariant, string> = {
    default:
      "rounded-[var(--radius)] border border-border bg-card shadow",

    glass:
      // Dùng đúng glass-card utility đã định nghĩa trong index.css
      "rounded-[var(--radius)] glass-card",

    sacred:
      // glass-card + sacred-glow
      "rounded-[var(--radius)] glass-card sacred-glow",

    // Compact: padding nhỏ, radius nhỏ hơn — phù hợp danh sách mobile
    compact:
      "rounded-[calc(var(--radius)/1.5)] border border-border bg-card shadow-sm",

    flat:
      "rounded-[var(--radius)] bg-card",
  }

  return cn(base, variants[variant])
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariantClasses(variant), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

// ─── CardHeader ────────────────────────────────────────────────────────────
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, compact, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        compact ? "p-4" : "p-6",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

// ─── CardTitle ─────────────────────────────────────────────────────────────
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// ─── CardDescription ───────────────────────────────────────────────────────
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// ─── CardContent ───────────────────────────────────────────────────────────
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, compact, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(compact ? "p-4 pt-0" : "p-6 pt-0", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

// ─── CardFooter ────────────────────────────────────────────────────────────
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, compact, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        compact ? "p-4 pt-0" : "p-6 pt-0",
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

// ─── CardDivider — dùng border từ CSS variable ─────────────────────────────
const CardDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn("border-border mx-6", className)}
    {...props}
  />
))
CardDivider.displayName = "CardDivider"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardDivider,
}
export type { CardVariant }