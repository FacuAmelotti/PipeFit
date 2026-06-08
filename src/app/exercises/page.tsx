"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Dumbbell, SlidersHorizontal, Zap } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { exerciseRepository } from "@/repositories/exercise-repository"
import { DIFFICULTY_COLORS } from "@/constants"
import { MuscleGroup, Difficulty } from "@/types"
import { MUSCLE_GROUPS } from "@/constants"
import { useTranslation } from "@/i18n"

export default function ExercisesPage() {
  const [search, setSearch] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | "all">("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all")
  const { t } = useTranslation()

  const allExercises = useMemo(() => exerciseRepository.getAll(), [])

  const filtered = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchesSearch =
        !search ||
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.primaryMuscles.some((m) =>
          m.toLowerCase().includes(search.toLowerCase())
        )
      const matchesGroup =
        selectedGroup === "all" ||
        ex.primaryMuscles.includes(selectedGroup)
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        ex.difficulty === selectedDifficulty
      return matchesSearch && matchesGroup && matchesDifficulty
    })
  }, [allExercises, search, selectedGroup, selectedDifficulty])

  const difficultyLabel = (d: string) =>
    d === "beginner" ? t("difficulty.beginner")
    : d === "intermediate" ? t("difficulty.intermediate")
    : t("difficulty.advanced")

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 bg-noise relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 5%, transparent)", filter: "blur(120px)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 5%, transparent)", filter: "blur(120px)" }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
            <Zap className="w-5 h-5 text-primary animate-glow-pulse" />
            <h1 className="text-3xl font-bold text-gradient">
              {t("exercises.title")}
            </h1>
            <Badge variant="secondary" className="ml-2">
              {allExercises.length} exercises
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("exercises.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 violet-shadow"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <Button
                variant={selectedGroup === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedGroup("all")}
                className="shrink-0"
              >
                {t("exercises.all")}
              </Button>
              {MUSCLE_GROUPS.map((mg) => (
                <Button
                  key={mg.value}
                  variant={
                    selectedGroup === mg.value ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedGroup(mg.value)}
                  className="shrink-0"
                >
                  {t(mg.labelKey)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            {(["all", "beginner", "intermediate", "advanced"] as const).map(
              (d) => (
                <Button
                  key={d}
                  variant={
                    selectedDifficulty === d ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedDifficulty(d)}
                >
                  {d === "all"
                    ? t("exercises.all_levels")
                    : difficultyLabel(d)}
                </Button>
              )
            )}
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((exercise, i) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                layout
              >
                <Link href={`/exercises/${exercise.slug}`}>
                  <Card className="glass border-glass-border card-hover group cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Dumbbell className="w-6 h-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {exercise.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {exercise.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {exercise.primaryMuscles.slice(0, 2).map((m) => (
                              <Badge
                                key={m}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {m}
                              </Badge>
                            ))}
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 border-primary-60 text-primary"
                            >
                              {difficultyLabel(exercise.difficulty)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t("exercises.no_results_title")}</h3>
              <p className="text-muted-foreground">
                {t("exercises.no_results_desc")}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
