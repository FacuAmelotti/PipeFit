import { Exercise, MuscleGroup, WorkoutExercise, ExerciseSet } from "@/types"
import { exerciseRepository } from "@/repositories/exercise-repository"
import { generateId } from "@/lib/utils"

type ExercisePriority = "compound" | "isolation"

const COMPOUND_KEYWORDS = [
  "deadlift", "squat", "bench press", "pull-up", "pullup",
  "row", "overhead press", "clean", "snatch", "dip", "lunge",
  "press de banca", "peso muerto", "sentadilla", "dominada",
  "remo", "press militar", "cargada", "arrancada", "fondo",
  "estocada", "zancada",
]

const ISOLATION_KEYWORDS = [
  "curl", "extension", "fly", "raise", "pushdown", "crunch",
  "leg raise", "plank", "apertura", "elevación", "patada",
  "puente", "levantamiento", "elevacion",
]

function classifyExercise(exercise: Exercise): ExercisePriority {
  const nameEn = (exercise.name_en ?? exercise.name).toLowerCase()
  const nameEs = exercise.name.toLowerCase()
  const primary = exercise.primaryMuscles

  const isCompound = COMPOUND_KEYWORDS.some(
    (kw) => nameEn.includes(kw) || nameEs.includes(kw)
  )
  if (isCompound) return "compound"

  const isIsolation = ISOLATION_KEYWORDS.some(
    (kw) => nameEn.includes(kw) || nameEs.includes(kw)
  )
  if (isIsolation) return "isolation"

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

function hasPairedGroup(selectedGroups: MuscleGroup[]): boolean {
  return MUSCLE_PAIRINGS.some(
    ([a, b]) =>
      selectedGroups.includes(a) &&
      selectedGroups.includes(b)
  )
}

function pickRandom<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count)
}

export function generateWorkoutPlan(
  selectedGroups: MuscleGroup[]
): WorkoutExercise[] {
  const allExercises = exerciseRepository.getAll()
  const result: WorkoutExercise[] = []
  const usedIds = new Set<string>()

  const primaryGroups = [...selectedGroups]
  const isPair = hasPairedGroup(primaryGroups)

  const targetSize = isPair ? 8 : 6
  const targetCompounds = isPair ? 4 : 3

  // Phase 1: Compound exercises across all selected groups
  const compoundPool = allExercises.filter(
    (e) =>
      e.primaryMuscles.some((m) => primaryGroups.includes(m)) &&
      classifyExercise(e) === "compound" &&
      !usedIds.has(e.id)
  )

  // Try to pick 1 compound per selected group first, then fill with rest
  const primaryGroupCompounds: Exercise[] = []
  for (const group of primaryGroups) {
    const groupEx = compoundPool.find(
      (e) => e.primaryMuscles.includes(group) && !usedIds.has(e.id)
    )
    if (groupEx) {
      primaryGroupCompounds.push(groupEx)
      usedIds.add(groupEx.id)
    }
  }

  const remainingCompounds = compoundPool.filter((e) => !usedIds.has(e.id))
  const extraCompounds = pickRandom(
    remainingCompounds,
    Math.max(0, targetCompounds - primaryGroupCompounds.length)
  )
  extraCompounds.forEach((e) => usedIds.add(e.id))

  ;[...primaryGroupCompounds, ...extraCompounds].forEach((exercise) => {
    result.push(buildWorkoutExercise(exercise))
  })

  // Phase 2: Isolation exercises for each selected group
  for (const group of primaryGroups) {
    const isolationPool = allExercises.filter(
      (e) =>
        e.primaryMuscles.includes(group) &&
        !usedIds.has(e.id) &&
        classifyExercise(e) === "isolation"
    )

    const selected = pickRandom(isolationPool, 2)

    selected.forEach((exercise) => {
      usedIds.add(exercise.id)
      result.push(buildWorkoutExercise(exercise))
    })
  }

  // Phase 3: Fill remaining with any suitable exercises
  const remainingCount = Math.max(0, targetSize - result.length)
  const remainingPool = allExercises.filter(
    (e) =>
      !usedIds.has(e.id) &&
      e.primaryMuscles.some((m) => primaryGroups.includes(m))
  )

  const fillers = pickRandom(remainingPool, remainingCount)

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
  return Math.ceil(
    exercises.reduce((totalSeconds, ex) => {
      const restTime = ex.exercise.recommendedRest || 90
      const setTime = 30
      return totalSeconds + ex.sets.length * (setTime + restTime)
    }, 0) / 60
  )
}
