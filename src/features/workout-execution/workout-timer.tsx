"use client"

import { useState, useEffect, useRef } from "react"
import { Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkoutTimerProps {
  isRunning: boolean
  onTick?: (seconds: number) => void
}

export function WorkoutTimer({ isRunning, onTick }: WorkoutTimerProps) {
  const [seconds, setSeconds] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (isRunning) {
      if (startRef.current === null) {
        startRef.current = Date.now() - seconds * 1000
      }
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startRef.current!) / 1000)
        setSeconds(elapsed)
        onTick?.(elapsed)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      startRef.current = null
    }
  }, [isRunning])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`

  return (
    <div className="flex items-center gap-2">
      <Timer className="h-4 w-4 text-[var(--primary)]" />
      <span className={cn("text-sm font-mono tabular-nums font-medium", seconds > 0 ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]")}>
        {display}
      </span>
    </div>
  )
}
