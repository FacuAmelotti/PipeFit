import type { Exercise } from "@/types"
import type { Locale } from "@/store/locale-store"

export function getLocalizedExercise(
  exercise: Exercise,
  locale: Locale
): Exercise {
  if (locale === "es") return exercise

  return {
    ...exercise,
    name: exercise.name_en,
    description: exercise.description_en,
    history: exercise.history_en,
    benefits: exercise.benefits_en,
    commonMistakes: exercise.commonMistakes_en,
    tips: exercise.tips_en,
    variations: exercise.variations_en,
    instructions: exercise.instructions_en,
  }
}

export function getLocalizedExercises(
  exercises: Exercise[],
  locale: Locale
): Exercise[] {
  if (locale === "es") return exercises
  return exercises.map((e) => getLocalizedExercise(e, locale))
}
