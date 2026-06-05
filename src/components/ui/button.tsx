import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-6 py-3 text-base font-semibold transition duration-300 ease-smooth active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-navy-800 text-white shadow-soft hover:bg-navy-900 focus-visible:shadow-focus",
        secondary:
          "border-2 border-navy-800 bg-transparent text-navy-800 hover:bg-navy-800 hover:text-white",
        accent:
          "bg-mint-500 text-navy-900 shadow-soft hover:bg-mint-300",
        ghost:
          "px-2 py-2 text-navy-800 hover:underline hover:underline-offset-4",
        light:
          "bg-white text-navy-900 shadow-soft hover:bg-cloud",
      },
      size: {
        sm: "min-h-10 px-4 py-2 text-sm",
        md: "min-h-11 px-6 py-3",
        lg: "min-h-12 px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
