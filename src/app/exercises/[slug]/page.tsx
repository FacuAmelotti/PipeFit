"use client"

import { useMemo } from "react"
import { useParams, notFound } from "next/navigation"
import { motion } from "framer-motion"
import {
  Dumbbell, Clock, Target, Activity, TrendingUp, Award, ChevronRight, Zap, BarChart3,
} from "lucide-react"
import { exerciseRepository } from "@/repositories/exercise-repository"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils"
import { MUSCLE_GROUPS, DIFFICULTY_COLORS } from "@/constants"
import { useTranslation } from "@/i18n"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const MUSCLE_COLORS: Record<string, string> = {}
MUSCLE_GROUPS.forEach((mg) => {
  MUSCLE_COLORS[mg.value] = mg.color
})

export default function ExerciseDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const slug = params.slug as string

  const exercise = useMemo(() => exerciseRepository.getBySlug(slug), [slug])

  if (!exercise) {
    notFound()
  }

  const allExercises = useMemo(() => exerciseRepository.getAll(), [])
  const related = useMemo(
    () =>
      allExercises
        .filter(
          (e) =>
            e.id !== exercise.id &&
            e.primaryMuscles.some((m) => exercise.primaryMuscles.includes(m))
        )
        .slice(0, 6),
    [exercise, allExercises]
  )

  const difficultyLabel = (d: string) =>
    d === "beginner" ? t("difficulty.beginner")
    : d === "intermediate" ? t("difficulty.intermediate")
    : t("difficulty.advanced")

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-black"
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${MUSCLE_COLORS[exercise.primaryMuscles[0]] ?? "#22c55e"}20 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div variants={item} className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className="text-xs px-3 py-1"
                style={{
                  backgroundColor: `${DIFFICULTY_COLORS[exercise.difficulty]}20`,
                  color: DIFFICULTY_COLORS[exercise.difficulty],
                  borderColor: `${DIFFICULTY_COLORS[exercise.difficulty]}40`,
                }}
              >
                {difficultyLabel(exercise.difficulty)}
              </Badge>
              {exercise.primaryMuscles.map((m) => {
                const mg = MUSCLE_GROUPS.find((g) => g.value === m)
                return (
                  <Badge
                    key={m}
                    variant="outline"
                    className="text-xs"
                    style={{
                      color: MUSCLE_COLORS[m] ?? "#71717a",
                      borderColor: `${MUSCLE_COLORS[m] ?? "#71717a"}40`,
                    }}
                  >
                    {mg ? t(mg.labelKey) : m}
                  </Badge>
                )
              })}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {exercise.name}
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              {exercise.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatDuration(exercise.estimatedDuration)}
              </span>
              <span className="flex items-center gap-1.5">
                <Target className="h-4 w-4" />
                {exercise.recommendedSets} sets x {exercise.recommendedReps} reps
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                {t("exercises.rest")}: {exercise.recommendedRest}{t("unit.seconds")}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={item}>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-lg text-zinc-200">{t("exercises.history")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {exercise.history}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-lg text-zinc-200">{t("exercises.instructions")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {exercise.instructions.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-zinc-300 leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-lg text-zinc-200">{t("exercises.benefits")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exercise.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Award className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div variants={item}>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-sm text-zinc-400 font-medium">{t("exercises.equipment")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {exercise.equipment.map((eq) => (
                      <Badge key={eq} variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700 text-xs">
                        {eq}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-sm text-zinc-400 font-medium">{t("exercises.mistakes")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exercise.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">&times;</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-sm text-zinc-400 font-medium">{t("exercises.tips")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exercise.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                        <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-sm text-zinc-400 font-medium">{t("exercises.variations")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exercise.variations.map((v, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                        <ChevronRight className="h-3 w-3 text-zinc-600" />
                        {v}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-sm text-zinc-400 font-medium">Recommended</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t("exercises.sets")}</span>
                    <span className="text-zinc-200 font-medium">{exercise.recommendedSets}</span>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t("exercises.reps")}</span>
                    <span className="text-zinc-200 font-medium">{exercise.recommendedReps}</span>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t("exercises.rest")}</span>
                    <span className="text-zinc-200 font-medium">{exercise.recommendedRest}{t("unit.seconds")}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {related.length > 0 && (
          <motion.div variants={item}>
            <Card className="border-zinc-800 bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="text-lg text-zinc-200">{t("exercises.related")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {related.map((ex) => (
                    <a
                      key={ex.id}
                      href={`/exercises/${ex.slug}`}
                      className="block rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all group"
                    >
                      <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors truncate">
                        {ex.name}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {ex.primaryMuscles.slice(0, 2).map((m) => {
                          const mg = MUSCLE_GROUPS.find((g) => g.value === m)
                          return (
                            <span
                              key={m}
                              className="text-[10px] text-zinc-600"
                            >
                              {mg ? t(mg.labelKey) : m}
                            </span>
                          )
                        })}
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
