"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useWorkout } from "@/hooks/use-workout"
import { useProfileStore } from "@/store/profile-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SetTracker } from "@/features/workout-execution/set-tracker"
import { WorkoutTimer } from "@/features/workout-execution/workout-timer"
import {
  Check,
  X,
  SkipForward,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Timer,
  Dumbbell,
  Flag,
  ArrowLeft,
  Weight,
  Zap,
} from "lucide-react"
import { MUSCLE_GROUPS, DIFFICULTY_COLORS } from "@/constants"
import { formatDuration } from "@/lib/utils"
import { MuscleGroup } from "@/types"
import { useTranslation } from "@/i18n"

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

export default function WorkoutPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    currentWorkout,
    currentExercise,
    upcomingExercise,
    progress,
    completeExercise,
    skipExercise,
    pauseWorkout,
    resumeWorkout,
    updateSet,
    addSet,
    removeSet,
    previousExercise,
    goToNextExercise,
    finishWorkout,
    status,
  } = useWorkout()
  const { profile } = useProfileStore()
  const [showFinishDialog, setShowFinishDialog] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => { setHydrated(true) }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!currentWorkout || status === "idle") {
      router.push("/")
    }
  }, [currentWorkout, status, router, hydrated])

  useEffect(() => {
    if (status === "completed") {
      router.push("/workout/summary")
    }
  }, [status, router])

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      resumeWorkout()
      setIsPaused(false)
    } else {
      pauseWorkout()
      setIsPaused(true)
    }
  }, [isPaused, pauseWorkout, resumeWorkout])

  const handleFinishWorkout = useCallback(() => {
    finishWorkout()
    setShowFinishDialog(false)
  }, [finishWorkout])

  const handleCompleteExercise = useCallback(() => {
    if (currentExercise) {
      currentExercise.sets.forEach((set) => {
        if (!set.completed) {
          updateSet(currentExercise.exercise.id, set.id, { completed: true })
        }
      })
      completeExercise()
    }
  }, [currentExercise, completeExercise, updateSet])

  if (!currentWorkout || !currentExercise) return null

  const currentEx = currentExercise
  const exIndex = currentWorkout.currentExerciseIndex
  const totalEx = currentWorkout.exercises.length
  const totalVolume = currentWorkout.totalVolume + currentEx.sets.reduce((t, s) => t + (s.completed ? s.weight * s.reps : 0), 0)
  const timerRunning = status === "in-progress"
  const isFirst = exIndex === 0
  const isLast = exIndex === totalEx - 1

  return (
    <div className="relative min-h-screen bg-noise">
      <LightningBolt />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-[var(--primary)]" />
              <h1 className="text-lg font-bold">{t("workout.title")}</h1>
            </div>
            <div className="flex items-center gap-2">
              <WorkoutTimer isRunning={timerRunning} />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handlePauseResume}
                aria-label={isPaused ? t("workout.resume") : t("workout.pause")}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentEx.exercise.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Card glass className="overflow-hidden card-hover lightning-border">
              <div className="h-40 bg-gradient-to-br from-[var(--primary)]/20 via-emerald-900/20 to-[var(--secondary)] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-grid-white/5" />
                <Dumbbell className="h-14 w-14 text-[var(--primary)]/40 animate-float animate-glow-pulse" />
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <Badge
                    variant={
                      currentEx.exercise.difficulty === "beginner"
                        ? "success"
                        : currentEx.exercise.difficulty === "intermediate"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {t("difficulty." + currentEx.exercise.difficulty)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentEx.exercise.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {currentEx.exercise.description}
                      </CardDescription>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)] font-mono shrink-0">
                      #{exIndex + 1}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {currentEx.exercise.primaryMuscles.map((m) => {
                      const info = MUSCLE_GROUPS.find((mg) => mg.value === m)
                      return (
                        <Badge key={m} variant="secondary" className="text-xs gap-1">
                          {info && <info.icon className="h-3 w-3" />}
                          {info ? t(info.labelKey) : m}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                    {t("workout.instructions")}
                  </h3>
                  <ol className="space-y-1.5">
                    {currentEx.exercise.instructions.slice(0, 4).map((inst, i) => (
                      <li key={i} className="text-sm text-[var(--muted-foreground)] flex gap-2">
                        <span className="text-[var(--primary)] font-mono text-xs mt-0.5">
                          {i + 1}.
                        </span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Separator />

                <SetTracker
                  exercise={currentEx}
                  onUpdate={(setId, data) => updateSet(currentEx.exercise.id, setId, data)}
                  onAddSet={() => addSet(currentEx.exercise.id)}
                  onRemoveSet={(setId) => removeSet(currentEx.exercise.id, setId)}
                  unitSystem={profile.unitSystem}
                />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 justify-between"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={previousExercise}
            disabled={isFirst}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> {t("workout.prev")}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipExercise}
              className="gap-1 text-amber-400"
            >
              <SkipForward className="h-4 w-4" /> {t("workout.skip")}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleCompleteExercise}
              className="gap-1"
            >
              <Check className="h-4 w-4" /> {t("workout.complete")}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextExercise}
            disabled={isLast}
            className="gap-1"
          >
            {t("workout.next")} <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <Weight className="h-3.5 w-3.5 text-[var(--primary)]" />
              {totalVolume.toLocaleString()} {profile.unitSystem}
            </span>
            <span className="flex items-center gap-1">
              <Dumbbell className="h-3.5 w-3.5 text-[var(--primary)]" />
              {exIndex + 1}/{totalEx}
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowFinishDialog(true)}
          >
            <Flag className="h-4 w-4" /> {t("workout.finish")}
          </Button>
        </div>
      </div>

      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("workout.finish_title")}</DialogTitle>
            <DialogDescription>
              {t("workout.finish_desc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowFinishDialog(false)}>
              {t("workout.cancel")}
            </Button>
            <Button variant="default" onClick={handleFinishWorkout}>
              {t("workout.finish_confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
