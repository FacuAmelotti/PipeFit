"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300",
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300",
        secondary:
          "bg-[var(--secondary)] text-[var(--foreground)] shadow-sm hover:bg-[var(--accent)] transition-all duration-300",
        destructive:
          "bg-[var(--destructive)] text-white shadow-sm hover:opacity-90 transition-all duration-300",
        outline:
          "border border-[var(--border)] bg-transparent shadow-sm hover:bg-[var(--accent)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/30 transition-all duration-300",
        ghost:
          "hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-all duration-300",
        link: "text-[var(--primary)] underline-offset-4 hover:underline transition-all duration-300",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-5 py-2 rounded-xl",
        lg: "h-11 px-8 rounded-xl",
        xl: "h-13 px-10 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
