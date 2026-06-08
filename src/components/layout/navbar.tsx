"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dumbbell,
  Home,
  LayoutDashboard,
  History,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"
import { NotificationBell } from "./notification-bell"

const navLinks = [
  { href: "/", label: "nav.home", icon: Home },
  { href: "/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
  { href: "/history", label: "nav.history", icon: History },
  { href: "/settings", label: "nav.settings", icon: Settings },
] as const

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--glass-border)] glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-[var(--primary)]" />
          <span className="text-lg font-bold text-[var(--foreground)]">
            PipeFit
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-[var(--primary)]/10"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <link.icon className="h-4 w-4" />
                {t(link.label)}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          <Avatar size="sm" fallback="U" className="hidden md:flex" />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[var(--border)] md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {t(link.label)}
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
