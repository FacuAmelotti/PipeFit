"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  Workout,
  WorkoutStatus,
  MuscleGroup,
  WorkoutExercise,
  ExerciseSet,
  ExerciseStatus,
  Exercise,
} from "@/types"
import { generateId, calculateTotalVolume } from "@/lib/utils"

interface WorkoutState {
  currentWorkout: Workout | null
  workoutHistory: Workout[]
  status: WorkoutStatus

  setMuscleGroups: (groups: MuscleGroup[]) => void
  generateWorkout: (exercises: WorkoutExercise[]) => void
  startWorkout: () => void
  pauseWorkout: () => void
  resumeWorkout: () => void
  completeExercise: (exerciseId: string) => void
  skipExercise: (exerciseId: string) => void
  previousExercise: () => void
  nextExercise: () => void
  updateSet: (exerciseId: string, setId: string, data: Partial<ExerciseSet>) => void
  addSet: (exerciseId: string) => void
  removeSet: (exerciseId: string, setId: string) => void
  finishWorkout: () => void
  cancelWorkout: () => void
  getWorkoutById: (id: string) => Workout | undefined
  clearHistory: () => void
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentWorkout: null,
      workoutHistory: [],
      status: "idle",

      setMuscleGroups: (groups) => {
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? { ...state.currentWorkout, muscleGroups: groups }
            : null,
        }))
      },

      generateWorkout: (exercises) => {
        const workout: Workout = {
          id: generateId(),
          date: new Date().toISOString(),
          startTime: "",
          endTime: null,
          duration: 0,
          status: "ready",
          muscleGroups: [],
          exercises: exercises.map((ex, i) => ({
            ...ex,
            status: i === 0 ? "current" : ("pending" as ExerciseStatus),
            order: i,
          })),
          currentExerciseIndex: 0,
          totalVolume: 0,
          totalSets: 0,
          totalReps: 0,
        }
        set({ currentWorkout: workout, status: "ready" })
      },

      startWorkout: () => {
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? {
                ...state.currentWorkout,
                status: "in-progress",
                startTime: new Date().toISOString(),
                exercises: state.currentWorkout.exercises.map((ex, i) => ({
                  ...ex,
                  status: (i === 0 ? "current" : "pending") as ExerciseStatus,
                })),
              }
            : null,
          status: "in-progress",
        }))
      },

      pauseWorkout: () => {
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? { ...state.currentWorkout, status: "paused" }
            : null,
          status: "paused",
        }))
      },

      resumeWorkout: () => {
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? { ...state.currentWorkout, status: "in-progress" }
            : null,
          status: "in-progress",
        }))
      },

      completeExercise: (exerciseId) => {
        set((state) => {
          if (!state.currentWorkout) return state
          const exercises = state.currentWorkout.exercises.map((ex) =>
            ex.exercise.id === exerciseId
              ? { ...ex, status: "completed" as ExerciseStatus }
              : ex
          )
          const currentIndex = state.currentWorkout.currentExerciseIndex
          const nextIndex = currentIndex + 1
          if (nextIndex < exercises.length) {
            exercises[nextIndex] = {
              ...exercises[nextIndex],
              status: "current" as ExerciseStatus,
            }
          }

          const currentEx = exercises.find(
            (ex) => ex.exercise.id === exerciseId
          )
          const totalSets = exercises.reduce(
            (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
            0
          )
          const totalReps = exercises.reduce(
            (sum, ex) =>
              sum +
              ex.sets
                .filter((s) => s.completed)
                .reduce((s, set) => s + set.reps, 0),
            0
          )
          const totalVolume = exercises.reduce(
            (sum, ex) =>
              sum +
              calculateTotalVolume(
                ex.sets.filter((s) => s.completed)
              ),
            0
          )

          return {
            currentWorkout: {
              ...state.currentWorkout,
              exercises,
              currentExerciseIndex: nextIndex,
              totalSets,
              totalReps,
              totalVolume,
            },
          }
        })
      },

      skipExercise: (exerciseId) => {
        set((state) => {
          if (!state.currentWorkout) return state
          const exercises = state.currentWorkout.exercises.map((ex) =>
            ex.exercise.id === exerciseId
              ? { ...ex, status: "skipped" as ExerciseStatus }
              : ex
          )
          const currentIndex = state.currentWorkout.currentExerciseIndex
          const nextIndex = currentIndex + 1
          if (nextIndex < exercises.length) {
            exercises[nextIndex] = {
              ...exercises[nextIndex],
              status: "current" as ExerciseStatus,
            }
          }
          return {
            currentWorkout: {
              ...state.currentWorkout,
              exercises,
              currentExerciseIndex: nextIndex,
            },
          }
        })
      },

      previousExercise: () => {
        set((state) => {
          if (!state.currentWorkout) return state
          const prevIndex = Math.max(
            0,
            state.currentWorkout.currentExerciseIndex - 1
          )
          return {
            currentWorkout: {
              ...state.currentWorkout,
              currentExerciseIndex: prevIndex,
            },
          }
        })
      },

      nextExercise: () => {
        set((state) => {
          if (!state.currentWorkout) return state
          const nextIndex = Math.min(
            state.currentWorkout.exercises.length - 1,
            state.currentWorkout.currentExerciseIndex + 1
          )
          return {
            currentWorkout: {
              ...state.currentWorkout,
              currentExerciseIndex: nextIndex,
            },
          }
        })
      },

      updateSet: (exerciseId, setId, data) => {
        set((state) => {
          if (!state.currentWorkout) return state
          const exercises = state.currentWorkout.exercises.map((ex) => {
            if (ex.exercise.id !== exerciseId) return ex
            return {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, ...data } : s
              ),
            }
          })
          return { currentWorkout: { ...state.currentWorkout, exercises } }
        })
      },

      addSet: (exerciseId) => {
        set((state) => {
          if (!state.currentWorkout) return state
          const exercises = state.currentWorkout.exercises.map((ex) => {
            if (ex.exercise.id !== exerciseId) return ex
            const newSet: ExerciseSet = {
              id: generateId(),
              exerciseId,
              setNumber: ex.sets.length + 1,
              weight: 0,
              reps: 0,
              completed: false,
            }
            return { ...ex, sets: [...ex.sets, newSet] }
          })
          return { currentWorkout: { ...state.currentWorkout, exercises } }
        })
      },

      removeSet: (exerciseId, setId) => {
        set((state) => {
          if (!state.currentWorkout) return state
          const exercises = state.currentWorkout.exercises.map((ex) => {
            if (ex.exercise.id !== exerciseId) return ex
            return {
              ...ex,
              sets: ex.sets
                .filter((s) => s.id !== setId)
                .map((s, i) => ({ ...s, setNumber: i + 1 })),
            }
          })
          return { currentWorkout: { ...state.currentWorkout, exercises } }
        })
      },

      finishWorkout: () => {
        set((state) => {
          if (!state.currentWorkout) return state
          const finished: Workout = {
            ...state.currentWorkout,
            status: "completed",
            endTime: new Date().toISOString(),
            duration: Math.floor(
              (Date.now() -
                new Date(state.currentWorkout.startTime || Date.now()).getTime()) /
                60000
            ),
          }
          return {
            currentWorkout: finished,
            workoutHistory: [finished, ...state.workoutHistory],
            status: "completed",
          }
        })
      },

      cancelWorkout: () => {
        set({ currentWorkout: null, status: "idle" })
      },

      getWorkoutById: (id) => {
        return get().workoutHistory.find((w) => w.id === id)
      },

      clearHistory: () => {
        set({ workoutHistory: [] })
      },
    }),
    {
      name: "gymai-workout-storage",
      partialize: (state) => ({
        workoutHistory: state.workoutHistory,
        currentWorkout: state.currentWorkout,
      }),
    }
  )
)
