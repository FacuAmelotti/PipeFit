import { MuscleGroup } from "@/types"
import React from "react"
import {
  Dumbbell,
  Heart,
  ArmchairIcon as Arm,
  PersonStanding,
  ArrowUpFromLine,
  ArrowDownFromLine,
  CircleDot,
  Triangle,
  HeartPulse,
} from "lucide-react"

export const MUSCLE_GROUPS: {
  value: MuscleGroup
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  descKey: string
}[] = [
  {
    value: "back",
    labelKey: "muscle.back",
    icon: ArrowUpFromLine,
    color: "#22c55e",
    descKey: "muscle.back_desc",
  },
  {
    value: "chest",
    labelKey: "muscle.chest",
    icon: Heart,
    color: "#ef4444",
    descKey: "muscle.chest_desc",
  },
  {
    value: "legs",
    labelKey: "muscle.legs",
    icon: PersonStanding,
    color: "#a855f7",
    descKey: "muscle.legs_desc",
  },
  {
    value: "shoulders",
    labelKey: "muscle.shoulders",
    icon: CircleDot,
    color: "#f97316",
    descKey: "muscle.shoulders_desc",
  },
  {
    value: "biceps",
    labelKey: "muscle.biceps",
    icon: Arm,
    color: "#3b82f6",
    descKey: "muscle.biceps_desc",
  },
  {
    value: "triceps",
    labelKey: "muscle.triceps",
    icon: ArrowDownFromLine,
    color: "#06b6d4",
    descKey: "muscle.triceps_desc",
  },
  {
    value: "glutes",
    labelKey: "muscle.glutes",
    icon: Triangle,
    color: "#ec4899",
    descKey: "muscle.glutes_desc",
  },
  {
    value: "abs",
    labelKey: "muscle.abs",
    icon: Dumbbell,
    color: "#eab308",
    descKey: "muscle.abs_desc",
  },
  {
    value: "cardio",
    labelKey: "muscle.cardio",
    icon: HeartPulse,
    color: "#14b8a6",
    descKey: "muscle.cardio_desc",
  },
]

export const DIFFICULTY_COLORS = {
  beginner: "#22c55e",
  intermediate: "#f97316",
  advanced: "#ef4444",
}

export const XP_REWARDS = {
  EXERCISE_COMPLETED: 25,
  WORKOUT_COMPLETED: 100,
  SET_COMPLETED: 10,
  STREAK_DAY: 50,
  ACHIEVEMENT_UNLOCKED: 200,
  FIRST_WORKOUT: 150,
  PERFECT_WORKOUT: 300,
}

export const LEVEL_THRESHOLDS = [
  0, 500, 1200, 2200, 3500, 5200, 7400, 10000, 13200, 17000, 21500, 26800,
  33000, 40200, 48500, 58000, 68800, 81000, 94800, 110000,
]

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: "first-workout",
    name: "First Step",
    description: "Complete your first workout",
    icon: "🌟",
    requirement: 1,
    type: "first" as const,
  },
  {
    id: "7-day-streak",
    name: "Week Warrior",
    description: "Train 7 days in a row",
    icon: "🔥",
    requirement: 7,
    type: "streak" as const,
  },
  {
    id: "30-workouts",
    name: "Dedicated",
    description: "Complete 30 workouts",
    icon: "💪",
    requirement: 30,
    type: "workouts" as const,
  },
  {
    id: "100-workouts",
    name: "Century Club",
    description: "Complete 100 workouts",
    icon: "🏆",
    requirement: 100,
    type: "workouts" as const,
  },
  {
    id: "100k-volume",
    name: "Heavy Lifter",
    description: "Lift 100,000 kg total volume",
    icon: "🏋️",
    requirement: 100000,
    type: "volume" as const,
  },
  {
    id: "500k-volume",
    name: "Half Ton",
    description: "Lift 500,000 kg total volume",
    icon: "🦍",
    requirement: 500000,
    type: "volume" as const,
  },
  {
    id: "1m-volume",
    name: "Millionaire",
    description: "Lift 1,000,000 kg total volume",
    icon: "👑",
    requirement: 1000000,
    type: "volume" as const,
  },
  {
    id: "1000-sets",
    name: "Set Master",
    description: "Complete 1,000 sets",
    icon: "📊",
    requirement: 1000,
    type: "sets" as const,
  },
  {
    id: "10000-reps",
    name: "Rep Machine",
    description: "Complete 10,000 reps",
    icon: "⚡",
    requirement: 10000,
    type: "reps" as const,
  },
  {
    id: "500-exercises",
    name: "Exercise Guru",
    description: "Complete 500 exercises",
    icon: "🧠",
    requirement: 500,
    type: "exercises" as const,
  },
]

export const MOTIVATIONAL_QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Strength does not come from the body. It comes from the will.",
  "Don't limit your challenges. Challenge your limits.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Success starts with self-discipline.",
  "It never gets easier. You just get stronger.",
  "Be stronger than your strongest excuse.",
  "Push yourself because no one else is going to do it for you.",
  "The harder you work, the luckier you get.",
  "There is no substitute for hard work.",
  "Strive for progress, not perfection.",
  "Fall in love with taking care of yourself.",
  "Rise up. Grind. Repeat.",
  "Your only limit is you.",
]

export const APP_NAME = "PipeFit"
export const APP_TAGLINE = "Intelligent workouts, tailored to you."
