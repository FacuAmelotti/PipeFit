"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useWorkout } from "@/hooks/use-workout"
import { useWorkoutStore } from "@/store/workout-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Timer, RotateCcw, ChevronRight, BarChart3, Weight, Zap } from "lucide-react"
import { MuscleGroup } from "@/types"
import { MUSCLE_GROUPS } from "@/constants"
import { formatDuration } from "@/lib/utils"
import { useTranslation } from "@/i18n"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function LightningBolt() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full blur-[140px]" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 4%, transparent)" }} />
      <div className="absolute -right-48 top-1/3 h-[500px] w-[500px] rounded-full" style={{ backgroundColor: "color-mix(in srgb, #7c3aed 5%, transparent)" }} />
      <svg className="absolute top-0 right-[10%] h-full w-auto opacity-[0.03] dark:opacity-[0.04]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <svg className="absolute bottom-[20%] left-[5%] h-48 w-auto opacity-[0.02] dark:opacity-[0.03] rotate-45" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
  )
}

function GeneratingState() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[70vh] gap-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
          <Zap className="absolute inset-0 m-auto h-8 w-8 text-[var(--primary)] animate-glow-pulse lightning-icon" />
        </div>
      </motion.div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gradient">{t("generate.generating_title")}</h2>
        <p className="text-[var(--muted-foreground)] text-sm">
          {t("export.generate.generating_desc")}
        </p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--primary)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

function GeneratePageContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { generateWorkout, currentWorkout, estimatedDuration, startWorkout } = useWorkout()
  const { setMuscleGroups } = useWorkoutStore()
  const [generating, setGenerating] = useState(true)
  const [ready, setReady] = useState(false)

  const groupsParam = searchParams.get("groups")
  const selectedGroups: MuscleGroup[] = groupsParam
    ? (groupsParam.split(",") as MuscleGroup[])
    : []

  useEffect(() => {
    if (selectedGroups.length === 0) {
      router.push("/")
      return
    }
    setMuscleGroups(selectedGroups)
    const timer = setTimeout(() => {
      generateWorkout(selectedGroups)
      setGenerating(false)
      setReady(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleStartWorkout = useCallback(() => {
    startWorkout()
    router.push("/workout")
  }, [startWorkout, router])

  const handleRegenerate = useCallback(() => {
    setGenerating(true)
    setReady(false)
    setTimeout(() => {
      generateWorkout(selectedGroups)
      setGenerating(false)
      setReady(true)
    }, 1500)
  }, [generateWorkout, selectedGroups])

  if (generating) return <GeneratingState />

  const exercises = currentWorkout?.exercises ?? []

  const totalExercises = exercises.length
  const totalSets = exercises.reduce((s, e) => s + e.sets.length, 0)
  const estimatedMin = estimatedDuration

  return (
    <div className="relative min-h-screen bg-noise">
      <LightningBolt />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-gradient">{t("generate.title")}</h1>
          <p className="text-[var(--muted-foreground)] text-sm">
            {t("generate.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card glass className="text-center py-4 card-hover">
            <CardContent className="p-0 flex flex-col items-center gap-1">
              <Dumbbell className="h-5 w-5 text-[var(--primary)]" />
              <span className="text-2xl font-bold">{totalExercises}</span>
              <span className="text-xs text-[var(--muted-foreground)]">{t("generate.exercises")}</span>
            </CardContent>
          </Card>
          <Card glass className="text-center py-4 card-hover">
            <CardContent className="p-0 flex flex-col items-center gap-1">
              <Timer className="h-5 w-5 text-[var(--primary)]" />
              <span className="text-2xl font-bold">{formatDuration(estimatedMin)}</span>
              <span className="text-xs text-[var(--muted-foreground)]">{t("generate.est_time")}</span>
            </CardContent>
          </Card>
          <Card glass className="text-center py-4 card-hover">
            <CardContent className="p-0 flex flex-col items-center gap-1">
              <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
              <span className="text-2xl font-bold">{totalSets}</span>
              <span className="text-xs text-[var(--muted-foreground)]">{t("generate.total_sets")}</span>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {selectedGroups.map((group) => {
            const info = MUSCLE_GROUPS.find((m) => m.value === group)
            return (
              <Badge
                key={group}
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1"
              >
                {info && <info.icon className="h-3 w-3" />}
                {info ? t(info.labelKey) : group}
              </Badge>
            )
          })}
        </motion.div>

        <Separator />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold">{t("generate.exercises")}</h2>
          <ScrollArea className="h-[50vh] pr-2 space-y-3">
            {exercises.map((we, i) => (
              <motion.div key={we.exercise.id} variants={itemVariants}>
                <Card glass className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-[var(--muted-foreground)] font-mono">
                            #{i + 1}
                          </span>
                          <h3 className="font-semibold truncate">{we.exercise.name}</h3>
                          <Badge
                            variant={
                              we.exercise.difficulty === "beginner"
                                ? "success"
                                : we.exercise.difficulty === "intermediate"
                                  ? "warning"
                                  : "danger"
                            }
                            className="ml-auto shrink-0"
                          >
                            {we.exercise.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mb-2">
                          {we.exercise.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <Weight className="h-3 w-3" />
                            {we.sets.length} x {we.exercise.recommendedReps}
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            ~{we.exercise.estimatedDuration}s
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {we.exercise.primaryMuscles.map((m) => {
                            const info = MUSCLE_GROUPS.find((mg) => mg.value === m)
                            return (
                              <Badge key={m} variant="outline" className="text-[10px] px-1.5 py-0">
                                {info ? t(info.labelKey) : m}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </ScrollArea>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 pt-2"
        >
          <Button size="xl" className="flex-1 gap-2" onClick={handleStartWorkout}>
            {t("generate.start")} <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="xl" onClick={handleRegenerate} className="gap-2">
            <RotateCcw className="h-4 w-4" /> {t("generate.regenerate")}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<GeneratingState />}>
      <GeneratePageContent />
    </Suspense>
  )
}
