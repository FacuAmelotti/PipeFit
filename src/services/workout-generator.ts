import { Exercise, MuscleGroup, WorkoutExercise, ExerciseSet } from "@/types"
import { exerciseRepository } from "@/repositories/exercise-repository"
import { generateId } from "@/lib/utils"

type ExercisePriority = "compound" | "isolation" | "accessory"

const EXERCISE_PRIORITY: Record<string, ExercisePriority> = {}

function classifyExercise(exercise: Exercise): ExercisePriority {
  const name = exercise.name.toLowerCase()
  const primary = exercise.primaryMuscles

  if (
    name.includes("deadlift") ||
    name.includes("squat") ||
    name.includes("bench press") ||
    name.includes("pull-up") ||
    name.includes("row") ||
    name.includes("overhead press") ||
    name.includes("clean") ||
    name.includes("snatch") ||
    name.includes("dip") ||
    name.includes("lunge")
  ) {
    return "compound"
  }

  if (
    name.includes("curl") ||
    name.includes("extension") ||
    name.includes("fly") ||
    name.includes("raise") ||
    name.includes("pushdown") ||
    name.includes("crunch") ||
    name.includes("leg raise") ||
    name.includes("plank")
  ) {
    return "isolation"
  }

  if (
    primary.includes("abs") ||
    primary.includes("cardio")
  ) {
    return "isolation"
  }

  return "compound"
}

const MUSCLE_PAIRINGS: [MuscleGroup, MuscleGroup][] = [
  ["back", "biceps"],
  ["chest", "triceps"],
  ["legs", "glutes"],
  ["shoulders", "abs"],
]

function isPairedGroup(group: MuscleGroup, selectedGroups: MuscleGroup[]): boolean {
  return MUSCLE_PAIRINGS.some(
    ([a, b]) =>
      selectedGroups.includes(a) &&
      selectedGroups.includes(b) &&
      (group === a || group === b)
  )
}

function selectExercises(
  pool: Exercise[],
  count: number,
  priority: ExercisePriority,
  usedIds: Set<string>
): Exercise[] {
  const available = pool.filter(
    (e) => !usedIds.has(e.id) && classifyExercise(e) === priority
  )
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function generateWorkoutPlan(
  selectedGroups: MuscleGroup[]
): WorkoutExercise[] {
  const allExercises = exerciseRepository.getAll()
  const result: WorkoutExercise[] = []
  const usedIds = new Set<string>()

  const primaryGroups = [...selectedGroups]
  const isPair = isPairedGroup(primaryGroups[0], primaryGroups)

  // Phase 1: Compound exercises
  let compoundPool = allExercises.filter(
    (e) =>
      e.primaryMuscles.some((m) => primaryGroups.includes(m)) &&
      classifyExercise(e) === "compound"
  )

  // Remove exercises that target secondary groups not selected
  compoundPool = compoundPool.filter(
    (e) =>
      !e.secondaryMuscles.some(
        (m) => !primaryGroups.includes(m) && m !== "abs"
      )
  )

  const compounds = compoundPool
    .sort(() => Math.random() - 0.5)
    .slice(0, isPair ? 4 : 3)
    .filter((e) => {
      if (usedIds.has(e.id)) return false
      usedIds.add(e.id)
      return true
    })

  compounds.forEach((exercise) => {
    result.push(buildWorkoutExercise(exercise))
  })

  // Phase 2: Isolation exercises for primary groups
  for (const group of primaryGroups) {
    const isolationPool = allExercises.filter(
      (e) =>
        e.primaryMuscles.includes(group) &&
        !usedIds.has(e.id) &&
        classifyExercise(e) === "isolation"
    )

    const selected = isolationPool
      .sort(() => Math.random() - 0.5)
      .slice(0, isPair ? 2 : 2)

    selected.forEach((exercise) => {
      usedIds.add(exercise.id)
      result.push(buildWorkoutExercise(exercise))
    })
  }

  // Phase 3: Fill remaining with any suitable exercises
  const remainingCount = Math.max(0, 6 - result.length)
  const remainingPool = allExercises.filter(
    (e) =>
      !usedIds.has(e.id) &&
      e.primaryMuscles.some((m) => primaryGroups.includes(m))
  )

  const fillers = remainingPool
    .sort(() => Math.random() - 0.5)
    .slice(0, remainingCount)

  fillers.forEach((exercise) => {
    usedIds.add(exercise.id)
    result.push(buildWorkoutExercise(exercise))
  })

  return result
}

function buildWorkoutExercise(exercise: Exercise): WorkoutExercise {
  const setCount = exercise.recommendedSets || 3
  const sets: ExerciseSet[] = Array.from({ length: setCount }, (_, i) => ({
    id: generateId(),
    exerciseId: exercise.id,
    setNumber: i + 1,
    weight: 0,
    reps: 0,
    completed: false,
  }))

  return {
    exercise,
    sets,
    status: "pending",
    order: 0,
  }
}

export function getEstimatedDuration(exercises: WorkoutExercise[]): number {
  return exercises.reduce((total, ex) => {
    const restTime = ex.exercise.recommendedRest || 90
    const setTime = 30
    return total + ex.sets.length * (setTime + restTime)
  }, 0)
}
