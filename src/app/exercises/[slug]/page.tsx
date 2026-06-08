import { exerciseRepository } from "@/repositories/exercise-repository"
import ExerciseDetailClient from "./exercise-detail-client"

export function generateStaticParams() {
  const exercises = exerciseRepository.getAll()
  return exercises.map((ex) => ({ slug: ex.slug }))
}

export default function ExerciseDetailPage() {
  return <ExerciseDetailClient />
}