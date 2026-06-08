"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeMap[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt ?? ""}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : fallback ? (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] font-medium">
            {fallback}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--secondary)]">
            <svg
              className="h-1/2 w-1/2 text-[var(--muted-foreground)]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
