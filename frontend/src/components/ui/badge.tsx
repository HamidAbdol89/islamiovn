import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",

        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80",

        outline:
          "border-border text-foreground bg-transparent",

        accent:
          "border-transparent bg-accent text-accent-foreground shadow-sm hover:bg-accent/80",

        glass:
          "border-white/10 bg-white/[0.045] text-foreground backdrop-blur-md",

        verified:
          "border-transparent bg-primary/20 text-primary shadow-sm",

        prayer:
          "border-transparent bg-amber-500/15 text-amber-300 shadow-sm",

        muted:
          "border-transparent bg-muted text-muted-foreground",
      },

      size: {
        default: "rounded-[calc(var(--radius)/3)] h-5",
        sm: "rounded-[calc(var(--radius)/4)] h-4 text-[10px] px-1.5",
        lg: "rounded-[calc(var(--radius)/2.5)] h-6 text-sm px-3",
        pill: "rounded-full h-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }