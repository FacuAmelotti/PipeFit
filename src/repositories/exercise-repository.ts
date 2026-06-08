import { Exercise, MuscleGroup } from "@/types"
import { IExerciseRepository } from "@/interfaces"
import { exercises } from "@/data/exercises"

export class ExerciseRepository implements IExerciseRepository {
  private exercises: Exercise[] = exercises

  getAll(): Exercise[] {
    return this.exercises
  }

  getById(id: string): Exercise | undefined {
    return this.exercises.find((e) => e.id === id)
  }

  getBySlug(slug: string): Exercise | undefined {
    return this.exercises.find((e) => e.slug === slug)
  }

  getByMuscleGroup(groups: string[]): Exercise[] {
    return this.exercises.filter((e) =>
      groups.some((g) => e.primaryMuscles.includes(g as MuscleGroup))
    )
  }

  getByDifficulty(difficulty: string): Exercise[] {
    return this.exercises.filter((e) => e.difficulty === difficulty)
  }

  search(query: string): Exercise[] {
    const q = query.toLowerCase()
    return this.exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.primaryMuscles.some((m) => m.toLowerCase().includes(q))
    )
  }
}

export const exerciseRepository = new ExerciseRepository()
