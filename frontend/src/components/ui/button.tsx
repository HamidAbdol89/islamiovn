import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — transition đồng nhất với CSS system (180ms/220ms)
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium select-none disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.985] transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        // Primary — dùng --primary (sacred teal)
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // Outline — dùng border từ CSS variable
        outline:
          "border border-border bg-transparent hover:bg-secondary hover:text-foreground",

        ghost:
          "bg-transparent hover:bg-secondary hover:text-foreground",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",

        // Glass — dùng glass utility từ index.css
        glass:
          "border border-white/10 bg-white/[0.045] text-foreground backdrop-blur-md hover:bg-white/[0.08] hover:border-white/15",

        // Sacred glow — dùng primary với glow effect
        sacred:
          "bg-primary text-primary-foreground shadow-[0_0_0_1px_rgb(45_212_191/0.08),0_0_16px_rgb(45_212_191/0.15)] hover:shadow-[0_0_0_1px_rgb(45_212_191/0.12),0_0_24px_rgb(45_212_191/0.22)] hover:bg-primary/90",
      },

      size: {
        default: "h-10 px-4 rounded-[calc(var(--radius)/1.5)]",
        sm:      "h-9  px-3 rounded-[calc(var(--radius)/2)] text-xs",
        lg:      "h-11 px-6 rounded-[calc(var(--radius)/1.2)] text-base",
        xl:      "h-13 px-8 rounded-[var(--radius)] text-base",
        icon:    "h-10 w-10 rounded-[calc(var(--radius)/1.5)]",
        "icon-sm": "h-8 w-8 rounded-[calc(var(--radius)/2)]",
      },

      // Tone — bỏ emerald hardcode, thay bằng accent từ CSS system
      tone: {
        default: "",
        // Dùng --accent (moonlight aqua) thay emerald-600 hardcode
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm",
        // Soft tint dùng primary teal của hệ thống
        soft:
          "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
        // Muted tone cho action thứ yếu
        muted:
          "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
      },
    },

    // Compound: glass + icon thì không cần border chặt
    compoundVariants: [
      {
        variant: "glass",
        size: ["icon", "icon-sm"],
        className: "rounded-full",
      },
    ],

    defaultVariants: {
      variant: "default",
      size: "default",
      tone: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, tone, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, tone, className }))}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }