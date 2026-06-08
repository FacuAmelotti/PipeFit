"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Zap,
  LayoutDashboard,
  History,
  BarChart3,
  Award,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProfileStore } from "@/store/profile-store"

const sidebarLinks = [
  { href: "/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
  { href: "/history", label: "nav.history", icon: History },
  { href: "/dashboard/stats", label: "nav.statistics", icon: BarChart3 },
  { href: "/dashboard/achievements", label: "nav.achievements", icon: Award },
  { href: "/settings", label: "nav.settings", icon: Settings },
] as const

interface SidebarProps {
  open: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { profile } = useProfileStore()
  const { level } = profile

  const xpProgress = Math.min((level.xp / level.xpToNextLevel) * 100, 100)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] transition-transform duration-300 md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-[var(--border)] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
            <Zap className="h-4.5 w-4.5 text-[var(--primary)]" />
          </div>
          <span className="text-lg font-bold text-gradient">
            PipeFit
          </span>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                  )}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  {t(link.label)}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20 text-sm font-bold text-[var(--primary)]">
              {level.level}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                {t("achievements.level")} {level.level}
              </p>
              <Progress value={xpProgress} className="mt-1 h-1.5" />
              <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">
                {level.xp} / {level.xpToNextLevel} XP
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
