import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-charcoal-brown text-white filter hover:brightness-90",
        accent: "bg-mango-yellow text-charcoal-brown filter hover:brightness-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-charcoal-brown/10 text-charcoal-brown hover:bg-charcoal-brown/[0.06]",
        secondary: "bg-white text-charcoal-brown border border-honey hover:bg-charcoal-brown/[0.06]",
        ghost: "text-charcoal-brown hover:bg-charcoal-brown/[0.06]",
        link: "text-charcoal-brown underline-offset-4 hover:underline",
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

export { buttonVariants };
