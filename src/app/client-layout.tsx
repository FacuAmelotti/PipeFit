"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { ToastProviderWithState } from "@/components/ui/toast"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem("gymai-profile-storage")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const theme = parsed?.state?.profile?.theme
        if (theme === "dark" || theme === "light") {
          document.documentElement.classList.toggle("dark", theme === "dark")
        }
      } catch {}
    }
  }, [])

  return (
    <ToastProviderWithState>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </ToastProviderWithState>
  )
}
