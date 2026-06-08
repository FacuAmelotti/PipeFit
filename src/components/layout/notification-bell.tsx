"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bell, Dumbbell, Trophy, Flame, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useProfileStore } from "@/store/profile-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notification } from "@/types"

const notificationIcons: Record<Notification["type"], React.ReactNode> = {
  "workout-completed": (
    <Dumbbell className="h-4 w-4 text-[var(--primary)]" />
  ),
  achievement: <Trophy className="h-4 w-4 text-[#eab308]" />,
  streak: <Flame className="h-4 w-4 text-[#f97316]" />,
  "level-up": <ArrowUp className="h-4 w-4 text-[#a855f7]" />,
  "workout-saved": <Dumbbell className="h-4 w-4 text-[var(--primary)]" />,
}

function formatTimeAgo(timestamp: string): string {
  const now = Date.now()
  const diff = now - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NotificationBell() {
  const { notifications, markNotificationRead } = useProfileStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-[var(--foreground)]" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-0.5"
              >
                <Badge
                  variant="danger"
                  className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            Notifications
          </span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Bell className="h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="text-sm text-[var(--muted-foreground)]">
              No notifications yet
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--accent)]",
                  !notification.read && "bg-[var(--primary)]/5"
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {notificationIcons[notification.type]}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p
                    className={cn(
                      "text-sm",
                      notification.read
                        ? "text-[var(--muted-foreground)]"
                        : "font-medium text-[var(--foreground)]"
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="line-clamp-2 text-xs text-[var(--muted-foreground)]">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)]/60">
                    {formatTimeAgo(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
                )}
              </button>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
