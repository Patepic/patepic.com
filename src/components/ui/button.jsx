import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-jade text-mint filter hover:brightness-90",
        accent: "bg-blush text-void filter hover:brightness-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-void/10 text-jade hover:bg-jade/[0.06]",
        secondary: "bg-bone text-jade border border-hairline hover:bg-void/[0.06]",
        ghost: "text-void hover:bg-void/[0.06]",
        link: "text-jade underline-offset-4 hover:underline",
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
