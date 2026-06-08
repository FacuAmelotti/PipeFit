export type MuscleGroup =
  | 'back'
  | 'chest'
  | 'legs'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'glutes'
  | 'abs'
  | 'cardio'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'resistance-band'
  | 'ez-bar'
  | 'smith-machine'
  | 'treadmill'
  | 'bike'
  | 'elliptical'
  | 'rower'
  | 'medicine-ball'
  | 'bench'
  | 'pull-up-bar'
  | 'dip-bars'
  | 'foam-roller'
  | 'jump-rope'
  | 'ab-wheel'
  | 'captains-chair'
  | 'stationary-bike'
  | 'stair-climber'
  | 'battle-ropes'
  | 'box'
  | 'none'

export type WorkoutStatus = 'idle' | 'generating' | 'ready' | 'in-progress' | 'paused' | 'completed' | 'cancelled'

export type ExerciseStatus = 'pending' | 'current' | 'completed' | 'skipped'

export type UnitSystem = 'kg' | 'lb'

export type ThemeMode = 'dark' | 'light'

export interface Exercise {
  id: string
  slug: string
  name: string
  name_en: string
  description: string
  description_en: string
  history: string
  history_en: string
  difficulty: Difficulty
  primaryMuscles: MuscleGroup[]
  secondaryMuscles: MuscleGroup[]
  equipment: Equipment[]
  benefits: string[]
  benefits_en: string[]
  commonMistakes: string[]
  commonMistakes_en: string[]
  tips: string[]
  tips_en: string[]
  variations: string[]
  variations_en: string[]
  recommendedSets: number
  recommendedReps: string
  recommendedRest: number
  estimatedDuration: number
  image: string
  video: string
  instructions: string[]
  instructions_en: string[]
}

export interface ExerciseSet {
  id: string
  exerciseId: string
  setNumber: number
  weight: number
  reps: number
  completed: boolean
}

export interface WorkoutExercise {
  exercise: Exercise
  sets: ExerciseSet[]
  status: ExerciseStatus
  order: number
}

export interface Workout {
  id: string
  date: string
  startTime: string
  endTime: string | null
  duration: number
  status: WorkoutStatus
  muscleGroups: MuscleGroup[]
  exercises: WorkoutExercise[]
  currentExerciseIndex: number
  totalVolume: number
  totalSets: number
  totalReps: number
}

export interface WorkoutSummary {
  id: string
  date: string
  startTime: string
  endTime: string
  duration: number
  exercisesCompleted: number
  exercisesSkipped: number
  totalSets: number
  totalReps: number
  totalVolume: number
  muscleGroups: MuscleGroup[]
  performanceScore: number
  notes?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  type: 'workouts' | 'volume' | 'streak' | 'sets' | 'reps' | 'exercises' | 'first'
  unlocked: boolean
  unlockedAt?: string
  progress: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

export interface UserLevel {
  level: number
  xp: number
  xpToNextLevel: number
  totalXp: number
}

export interface UserProfile {
  name: string
  theme: ThemeMode
  unitSystem: UnitSystem
  restTimerPreference: number
  notificationsEnabled: boolean
  level: UserLevel
  achievements: Achievement[]
  badges: Badge[]
  totalWorkouts: number
  totalDuration: number
  totalExercises: number
  totalSets: number
  totalReps: number
  totalVolume: number
  currentStreak: number
  longestStreak: number
  lastWorkoutDate: string | null
}

export interface DashboardMetrics {
  totalWorkouts: number
  totalHours: number
  totalExercises: number
  totalSets: number
  totalReps: number
  totalVolume: number
  averageWorkoutTime: number
  workoutFrequency: number
  currentStreak: number
  longestStreak: number
  weeklyWorkouts: { day: string; count: number }[]
  monthlyVolume: { month: string; volume: number }[]
  muscleGroupBreakdown: { group: MuscleGroup; count: number }[]
}

export interface Notification {
  id: string
  type: 'workout-completed' | 'achievement' | 'streak' | 'level-up' | 'workout-saved'
  title: string
  message: string
  timestamp: string
  read: boolean
}
