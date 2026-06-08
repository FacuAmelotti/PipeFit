"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-[var(--radius)] border p-4 pr-6 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        destructive:
          "destructive group border-red-500/30 bg-red-500/10 text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      asChild
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {props.children as React.ReactNode}
      </motion.div>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-transparent px-3 text-sm font-medium transition-colors hover:bg-[var(--secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-500/30 group-[.destructive]:hover:bg-red-500/20 group-[.destructive]:text-red-400",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-[var(--foreground)]/50 opacity-0 transition-opacity hover:text-[var(--foreground)] focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-400 group-[.destructive]:hover:text-red-300",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastActionType = {
  title: string
  description?: string
  variant?: "default" | "success" | "destructive"
  action?: {
    altText: string
    onClick: () => void
  }
}

type ToastState = {
  toasts: (ToastActionType & { id: string })[]
}

type ToastContextType = {
  toasts: (ToastActionType & { id: string })[]
  toast: (props: ToastActionType) => string
  dismiss: (id: string) => void
}

let toastCount = 0
function generateId() {
  return `toast-${++toastCount}`
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

function ToastProviderWithState({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ToastState>({ toasts: [] })

  const toast = React.useCallback((props: ToastActionType) => {
    const id = generateId()
    const newToast = { ...props, id }
    setState((prev) => ({ toasts: [...prev.toasts, newToast] }))
    return id
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== id),
    }))
  }, [])

  return (
    <ToastProvider>
      <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
        {children}
        <AnimatePresence mode="popLayout">
          {state.toasts.map((t) => (
            <Toast
              key={t.id}
              variant={t.variant}
              onOpenChange={(open) => {
                if (!open) dismiss(t.id)
              }}
            >
              <div className="grid gap-1">
                {t.title && <ToastTitle>{t.title}</ToastTitle>}
                {t.description && (
                  <ToastDescription>{t.description}</ToastDescription>
                )}
              </div>
              {t.action && (
                <ToastAction altText={t.action.altText} onClick={t.action.onClick}>
                  {t.action.altText}
                </ToastAction>
              )}
              <ToastClose />
            </Toast>
          ))}
        </AnimatePresence>
        <ToastViewport />
      </ToastContext.Provider>
    </ToastProvider>
  )
}

function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProviderWithState")
  }
  return context
}

export {
  ToastProvider,
  ToastProviderWithState,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  useToast,
}
