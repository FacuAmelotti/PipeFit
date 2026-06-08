"use client"

import { useCallback, useMemo } from "react"
import { useWorkoutStore } from "@/store/workout-store"
import { MuscleGroup, WorkoutExercise } from "@/types"
import { generateWorkoutPlan, getEstimatedDuration } from "@/services/workout-generator"
import { useProfileStore } from "@/store/profile-store"

export function useWorkout() {
  const store = useWorkoutStore()
  const profileStore = useProfileStore()

  const currentWorkout = store.currentWorkout
  const exercises = currentWorkout?.exercises ?? []
  const currentExercise = exercises[currentWorkout?.currentExerciseIndex ?? 0] ?? null
  const upcomingExercise = exercises[(currentWorkout?.currentExerciseIndex ?? 0) + 1] ?? null

  const progress = useMemo(() => {
    if (!exercises.length) return 0
    const completed = exercises.filter((e) => e.status === "completed").length
    return Math.round((completed / exercises.length) * 100)
  }, [exercises])

  const estimatedDuration = useMemo(
    () => getEstimatedDuration(exercises),
    [exercises]
  )

  const generateWorkout = useCallback(
    (groups: MuscleGroup[]) => {
      const plan = generateWorkoutPlan(groups)
      store.generateWorkout(plan)
    },
    [store]
  )

  const completeExercise = useCallback(() => {
    if (currentExercise) {
      store.completeExercise(currentExercise.exercise.id)
    }
  }, [store, currentExercise])

  const skipExercise = useCallback(() => {
    if (currentExercise) {
      store.skipExercise(currentExercise.exercise.id)
    }
  }, [store, currentExercise])

  const finishWorkout = useCallback(() => {
    store.finishWorkout()
    if (currentWorkout) {
      profileStore.addWorkout(
        currentWorkout.duration,
        currentWorkout.exercises.filter((e) => e.status === "completed").length,
        currentWorkout.totalSets,
        currentWorkout.totalReps,
        currentWorkout.totalVolume
      )
    }
  }, [store, profileStore, currentWorkout])

  const goToNextExercise = store.nextExercise

  return {
    ...store,
    currentExercise,
    upcomingExercise,
    progress,
    estimatedDuration,
    generateWorkout,
    completeExercise,
    skipExercise,
    finishWorkout,
    goToNextExercise,
  }
}
