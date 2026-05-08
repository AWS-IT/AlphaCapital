"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-950",
  {
    variants: {
      variant: {
        gold:
          "text-midnight-950 shadow-[0_18px_40px_-16px_rgba(201,168,106,0.55)] [background:linear-gradient(135deg,#e3cb98_0%,#c9a86a_60%,#a4854c_100%)] hover:-translate-y-px hover:shadow-[0_22px_55px_-18px_rgba(201,168,106,0.7)]",
        ghost:
          "border border-white/15 text-white/85 hover:border-white/30 hover:bg-white/5 hover:text-white",
        outline:
          "border border-gold/40 text-gold hover:bg-gold/10 hover:text-gold-soft",
        dark:
          "bg-midnight-900/80 text-white border border-white/10 hover:bg-midnight-800",
        link: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-[15px]",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
