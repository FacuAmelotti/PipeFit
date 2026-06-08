"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useWorkoutStore } from "@/store/workout-store"
import { useProfileStore } from "@/store/profile-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Timer,
  Dumbbell,
  BarChart3,
  Weight,
  Check,
  X,
  ChevronRight,
  Home,
  Zap,
} from "lucide-react"
import { MUSCLE_GROUPS } from "@/constants"
import { formatDuration, formatDate } from "@/lib/utils"
import { useTranslation } from "@/i18n"

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

export default function SummaryPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { currentWorkout } = useWorkoutStore()
  const { profile } = useProfileStore()

  useEffect(() => {
    if (!currentWorkout || currentWorkout.status !== "completed") {
      router.push("/")
    }
  }, [currentWorkout, router])

  const summary = useMemo(() => {
    if (!currentWorkout) return null
    const exercises = currentWorkout.exercises
    const completed = exercises.filter((e) => e.status === "completed")
    const skipped = exercises.filter((e) => e.status === "skipped")
    const totalSets = exercises.reduce((s, e) => s + e.sets.filter((st) => st.completed).length, 0)
    const totalReps = exercises.reduce(
      (s, e) => s + e.sets.filter((st) => st.completed).reduce((r, st) => r + st.reps, 0),
      0
    )
    const totalVolume = exercises.reduce(
      (s, e) => s + e.sets.filter((st) => st.completed).reduce((v, st) => v + st.weight * st.reps, 0),
      0
    )
    const score = Math.round((completed.length / Math.max(exercises.length, 1)) * 100)

    return {
      exercisesTotal: exercises.length,
      exercisesCompleted: completed.length,
      exercisesSkipped: skipped.length,
      totalSets,
      totalReps,
      totalVolume,
      duration: currentWorkout.duration,
      muscleGroups: currentWorkout.muscleGroups,
      exercises,
      score,
      date: currentWorkout.date,
    }
  }, [currentWorkout])

  if (!summary) return null

  return (
    <div className="relative min-h-screen bg-noise">
      <LightningBolt />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center"
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
                <Zap className="absolute -bottom-2 -left-2 h-6 w-6 text-[var(--primary)] animate-glow-pulse lightning-icon" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">{t("summary.title")}</h1>
              <p className="text-[var(--muted-foreground)] text-sm mt-1">
                {formatDate(new Date(summary.date))}
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="text-center space-y-2">
            <div className="text-5xl font-bold text-gradient">{summary.score}</div>
            <p className="text-sm text-[var(--muted-foreground)]">{t("summary.performance_score")}</p>
            <Progress value={summary.score} className="h-2 max-w-xs mx-auto" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {[
              {
                label: t("summary.duration"),
                value: formatDuration(summary.duration),
                icon: Timer,
                color: "text-blue-400",
              },
              {
                label: t("summary.exercises_completed"),
                value: `${summary.exercisesCompleted}/${summary.exercisesTotal}`,
                icon: Dumbbell,
                color: "text-emerald-400",
              },
              {
                label: t("summary.total_sets"),
                value: summary.totalSets.toLocaleString(),
                icon: BarChart3,
                color: "text-purple-400",
              },
              {
                label: t("summary.total_reps"),
                value: summary.totalReps.toLocaleString(),
                icon: BarChart3,
                color: "text-amber-400",
              },
              {
                label: t("summary.total_volume"),
                value: `${summary.totalVolume.toLocaleString()} ${profile.unitSystem}`,
                icon: Weight,
                color: "text-rose-400",
              },
              {
                label: t("summary.muscle_groups"),
                value: summary.muscleGroups.length.toString(),
                icon: Dumbbell,
                color: "text-cyan-400",
              },
            ].map((stat) => (
              <Card key={stat.label} glass className="card-hover">
                <CardContent className="p-4 flex flex-col items-center text-center gap-1.5">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                  <span className="text-lg font-bold">{stat.value}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{stat.label}</span>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {summary.muscleGroups.length > 0 && (
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 justify-center">
              {summary.muscleGroups.map((group) => {
                const info = MUSCLE_GROUPS.find((m) => m.value === group)
                return (
                  <Badge key={group} variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
                    {info && <info.icon className="h-3 w-3" />}
                    {info ? t(info.labelKey) : group}
                  </Badge>
                )
              })}
            </motion.div>
          )}

          <Separator />

          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-lg font-semibold">Exercise Details</h2>
            <ScrollArea className="h-[35vh] pr-2 space-y-2">
              {summary.exercises.map((we, i) => (
                <motion.div
                  key={we.exercise.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card glass>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {we.status === "completed" ? (
                              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : we.status === "skipped" ? (
                              <X className="h-4 w-4 text-amber-400 shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-[var(--muted-foreground)] shrink-0" />
                            )}
                            <h3 className="font-medium text-sm truncate">{we.exercise.name}</h3>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[var(--muted-foreground)]">
                            <span>
                              Sets: {we.sets.filter((s) => s.completed).length}/{we.sets.length}
                            </span>
                            <span>
                              Reps:{" "}
                              {we.sets
                                .filter((s) => s.completed)
                                .reduce((r, s) => r + s.reps, 0)}
                            </span>
                            <span>
                              Vol:{" "}
                              {we.sets
                                .filter((s) => s.completed)
                                .reduce((v, s) => v + s.weight * s.reps, 0)
                                .toLocaleString()}
                            </span>
                          </div>
                          {we.sets.some((s) => s.completed) && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {we.sets
                                .filter((s) => s.completed)
                                .map((s) => (
                                  <Badge key={s.id} variant="outline" className="text-[10px] px-1.5">
                                    {s.weight}
                                    {profile.unitSystem} x {s.reps}
                                  </Badge>
                                ))}
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            we.status === "completed"
                              ? "success"
                              : we.status === "skipped"
                                ? "warning"
                                : "secondary"
                          }
                          className="shrink-0 capitalize"
                        >
                          {we.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </ScrollArea>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-3 pt-2"
          >
            <Button size="xl" className="w-full gap-2" onClick={() => router.push("/certificate")}>
              {t("summary.view_certificate")} <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2"
                onClick={() => router.push("/")}
              >
                <Home className="h-4 w-4" /> {t("summary.back_home")}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="flex-1 gap-2"
                onClick={() => router.push("/dashboard")}
              >
                <BarChart3 className="h-4 w-4" /> {t("summary.view_dashboard")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
