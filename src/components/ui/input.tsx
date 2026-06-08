"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-[var(--radius)] border border-[var(--input)] bg-transparent px-3 py-1 text-sm text-[var(--foreground)] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-xs text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
