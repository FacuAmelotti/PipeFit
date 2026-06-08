import { Exercise, Workout, WorkoutSummary, UserProfile, DashboardMetrics } from "@/types"

export interface IExerciseRepository {
  getAll(): Exercise[]
  getById(id: string): Exercise | undefined
  getBySlug(slug: string): Exercise | undefined
  getByMuscleGroup(groups: string[]): Exercise[]
  getByDifficulty(difficulty: string): Exercise[]
  search(query: string): Exercise[]
}

export interface IWorkoutService {
  generateWorkout(groups: string[]): Workout
  calculateSummary(workout: Workout): WorkoutSummary
  getVolume(workout: Workout): number
  getDuration(workout: Workout): number
}

export interface IProfileService {
  getProfile(): UserProfile
  updateProfile(data: Partial<UserProfile>): void
  getMetrics(): DashboardMetrics
  calculateStreak(): number
}

export interface IExportService {
  exportAsPNG(element: HTMLElement): Promise<Blob>
  exportAsJPG(element: HTMLElement): Promise<Blob>
  downloadBlob(blob: Blob, filename: string): void
}

export interface IFutureAuthService {
  login(email: string, password: string): Promise<void>
  register(email: string, password: string, name: string): Promise<void>
  logout(): Promise<void>
  getSession(): Promise<unknown>
}

export interface IFutureSyncService {
  syncWorkouts(): Promise<void>
  syncProfile(): Promise<void>
  pullFromCloud(): Promise<void>
  pushToCloud(): Promise<void>
}

export interface IFutureAIService {
  generatePersonalizedWorkout(preferences: unknown): Promise<Workout>
  getRecommendations(): Promise<Exercise[]>
  analyzeForm(videoUrl: string): Promise<unknown>
}
