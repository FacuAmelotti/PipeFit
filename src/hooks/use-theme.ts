"use client"

import { useEffect } from "react"
import { useProfileStore } from "@/store/profile-store"

export function useTheme() {
  const theme = useProfileStore((s) => s.profile.theme)
  const setTheme = useProfileStore((s) => s.setTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return { theme, setTheme }
}
