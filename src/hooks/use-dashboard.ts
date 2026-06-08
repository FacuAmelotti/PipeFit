/* eslint-disable react-hooks/purity */
import { useMemo } from "react"
import { useWorkoutStore } from "@/store/workout-store"
import { useProfileStore } from "@/store/profile-store"
import { DashboardMetrics, MuscleGroup } from "@/types"

export function useDashboard(): DashboardMetrics {
  const profile = useProfileStore((s) => s.profile)
  const history = useWorkoutStore((s) => s.workoutHistory)
  const now = Date.now()

  return useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weeklyWorkouts = days.map((day) => ({
      day,
      count: 0,
    }))

    const monthlyMap: Record<string, number> = {}
    const muscleMap: Record<string, number> = {}

    for (const w of history) {
      const date = new Date(w.date)
      const dayName = days[date.getDay()]
      const weekDay = weeklyWorkouts.find((d) => d.day === dayName)
      if (weekDay) weekDay.count++

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + w.totalVolume

      for (const g of w.muscleGroups) {
        muscleMap[g] = (muscleMap[g] || 0) + 1
      }
    }

    const monthlyVolume = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, volume]) => ({
        month,
        volume,
      }))

    const muscleGroupBreakdown = Object.entries(muscleMap)
      .sort(([, a], [, b]) => b - a)
      .map(([group, count]) => ({
        group: group as MuscleGroup,
        count,
      }))

    const lastDate = history.length > 0 ? new Date(history[history.length - 1]?.date || now).getTime() : now
    const weeksSince = Math.max(1, Math.ceil((now - lastDate) / (86400000 * 7)))
    const workoutFrequency = history.length > 0
      ? Math.round((history.length / weeksSince) * 100) / 100
      : 0

    const averageWorkoutTime = profile.totalWorkouts > 0
      ? Math.round(profile.totalDuration / profile.totalWorkouts)
      : 0

    return {
      totalWorkouts: profile.totalWorkouts,
      totalHours: Math.round(profile.totalDuration / 60),
      totalExercises: profile.totalExercises,
      totalSets: profile.totalSets,
      totalReps: profile.totalReps,
      totalVolume: profile.totalVolume,
      averageWorkoutTime,
      workoutFrequency,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      weeklyWorkouts,
      monthlyVolume,
      muscleGroupBreakdown,
    }
  }, [profile, history, now])
}
