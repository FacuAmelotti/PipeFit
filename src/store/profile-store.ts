"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  UserProfile,
  ThemeMode,
  UnitSystem,
  UserLevel,
  Achievement,
  Notification,
} from "@/types"
import {
  LEVEL_THRESHOLDS,
  ACHIEVEMENT_DEFINITIONS,
  XP_REWARDS,
} from "@/constants"

interface ProfileState {
  profile: UserProfile
  notifications: Notification[]

  updateName: (name: string) => void
  setTheme: (theme: ThemeMode) => void
  setUnitSystem: (unit: UnitSystem) => void
  setRestTimer: (seconds: number) => void
  toggleNotifications: () => void
  addXp: (amount: number) => void
  addWorkout: (duration: number, exercises: number, sets: number, reps: number, volume: number) => void
  checkAchievements: () => void
  updateStreak: () => void
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  resetProfile: () => void
}

const defaultProfile: UserProfile = {
  name: "Athlete",
  theme: "dark",
  unitSystem: "kg",
  restTimerPreference: 90,
  notificationsEnabled: true,
  level: { level: 1, xp: 0, xpToNextLevel: LEVEL_THRESHOLDS[1], totalXp: 0 },
  achievements: ACHIEVEMENT_DEFINITIONS.map((a) => ({
    ...a,
    unlocked: false,
    progress: 0,
  })),
  badges: [],
  totalWorkouts: 0,
  totalDuration: 0,
  totalExercises: 0,
  totalSets: 0,
  totalReps: 0,
  totalVolume: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      notifications: [],

      updateName: (name) =>
        set((state) => ({
          profile: { ...state.profile, name },
        })),

      setTheme: (theme) =>
        set((state) => ({
          profile: { ...state.profile, theme },
        })),

      setUnitSystem: (unit) =>
        set((state) => ({
          profile: { ...state.profile, unitSystem: unit },
        })),

      setRestTimer: (seconds) =>
        set((state) => ({
          profile: { ...state.profile, restTimerPreference: seconds },
        })),

      toggleNotifications: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            notificationsEnabled: !state.profile.notificationsEnabled,
          },
        })),

      addXp: (amount) => {
        set((state) => {
          const profile = state.profile
          let { level, xp, totalXp } = profile.level
          xp += amount
          totalXp += amount
          let leveledUp = false
          while (
            level < LEVEL_THRESHOLDS.length - 1 &&
            xp >= LEVEL_THRESHOLDS[level]
          ) {
            xp -= LEVEL_THRESHOLDS[level]
            level++
            leveledUp = true
          }
          const xpToNextLevel =
            level < LEVEL_THRESHOLDS.length - 1
              ? LEVEL_THRESHOLDS[level]
              : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]

          const result: UserLevel = { level, xp, xpToNextLevel, totalXp }

  if (leveledUp) {
    const notification: Notification = {
      id: Math.random().toString(36).substring(2),
      type: "level-up",
      title: "Level Up!",
      message: `Congratulations! You've reached level ${level}!`,
      timestamp: new Date().toISOString(),
      read: false,
    }
    return {
      profile: { ...profile, level: result },
      notifications: [notification, ...state.notifications],
    }
  }

  return { profile: { ...profile, level: result } }
        })
      },

      addWorkout: (duration, exercises, sets, reps, volume) => {
        set((state) => {
          const p = state.profile
          return {
            profile: {
              ...p,
              totalWorkouts: p.totalWorkouts + 1,
              totalDuration: p.totalDuration + duration,
              totalExercises: p.totalExercises + exercises,
              totalSets: p.totalSets + sets,
              totalReps: p.totalReps + reps,
              totalVolume: p.totalVolume + volume,
            },
          }
        })
        get().updateStreak()
        get().addXp(XP_REWARDS.WORKOUT_COMPLETED)
        get().checkAchievements()
      },

      checkAchievements: () => {
        set((state) => {
          const p = state.profile
          const achievements = p.achievements.map((a) => {
            let progress = a.progress
            switch (a.type) {
              case "workouts":
                progress = p.totalWorkouts
                break
              case "volume":
                progress = p.totalVolume
                break
              case "streak":
                progress = p.currentStreak
                break
              case "sets":
                progress = p.totalSets
                break
              case "reps":
                progress = p.totalReps
                break
              case "exercises":
                progress = p.totalExercises
                break
              case "first":
                progress = p.totalWorkouts >= 1 ? 1 : 0
                break
            }
            const wasUnlocked = a.unlocked
            const nowUnlocked = progress >= a.requirement
            return {
              ...a,
              progress: Math.min(progress, a.requirement),
              unlocked: nowUnlocked,
              unlockedAt: nowUnlocked && !wasUnlocked ? new Date().toISOString() : a.unlockedAt,
            }
          })

          const newUnlocks = achievements.filter(
            (a, i) => a.unlocked && !state.profile.achievements[i]?.unlocked
          )

          const newNotifications = newUnlocks.map((a) => ({
            id: Math.random().toString(36).substring(2),
            type: "achievement" as const,
            title: "Achievement Unlocked!",
            message: `${a.icon} ${a.name}: ${a.description}`,
            timestamp: new Date().toISOString(),
            read: false,
          }))

          return {
            profile: { ...state.profile, achievements },
            notifications: [...newNotifications, ...state.notifications],
          }
        })
      },

      updateStreak: () => {
        const now = new Date()
        const today = now.toDateString()
        const yesterday = new Date(now.getTime() - 86400000).toDateString()
        const nowISO = now.toISOString()

        set((state) => {
          const p = state.profile
          const lastDate = p.lastWorkoutDate
            ? new Date(p.lastWorkoutDate).toDateString()
            : null

          let newStreak = p.currentStreak
          if (lastDate === today) {
            return state
          }

          if (lastDate === yesterday || lastDate === null) {
            newStreak = p.currentStreak + 1
          } else {
            newStreak = 1
          }

          return {
            profile: {
              ...p,
              currentStreak: newStreak,
              longestStreak: Math.max(p.longestStreak, newStreak),
              lastWorkoutDate: nowISO,
            },
          }
        })
      },

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Math.random().toString(36).substring(2),
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),

      resetProfile: () => set({ profile: defaultProfile, notifications: [] }),
    }),
    {
      name: "gymai-profile-storage",
    }
  )
)
