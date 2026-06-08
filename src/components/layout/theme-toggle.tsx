"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProfileStore } from "@/store/profile-store"

export function ThemeToggle() {
  const { profile, setTheme } = useProfileStore()
  const isDark = profile.theme === "dark"

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const toggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-[var(--foreground)]" />
        ) : (
          <Sun className="h-5 w-5 text-[var(--foreground)]" />
        )}
      </motion.div>
    </Button>
  )
}
