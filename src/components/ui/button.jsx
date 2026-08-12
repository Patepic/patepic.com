import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-scarlet text-off-white filter hover:brightness-90",
        accent: "bg-gold text-surface filter hover:brightness-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-off-white/10 text-scarlet hover:bg-scarlet/[0.06]",
        secondary: "bg-surface text-scarlet hover:bg-surface/70",
        ghost: "text-off-white hover:bg-off-white/[0.05]",
        link: "text-scarlet underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-md",
        sm: "h-8 px-3.5 text-xs rounded-md",
        default: "h-10 px-5",
        lg: "h-12 px-7",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
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
