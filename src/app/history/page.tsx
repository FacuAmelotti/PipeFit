"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dumbbell, Clock, Target, ChevronRight, ChevronDown, Zap } from "lucide-react"
import { useWorkoutStore } from "@/store/workout-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatDuration } from "@/lib/utils"
import { MUSCLE_GROUPS, DIFFICULTY_COLORS } from "@/constants"
import { Workout } from "@/types"
import { useTranslation } from "@/i18n"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const listItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

function getPerformanceColor(score: number): string {
  if (score >= 90) return "#22c55e"
  if (score >= 70) return "#f97316"
  if (score >= 50) return "#eab308"
  return "#ef4444"
}

function WorkoutCard({ workout, index }: { workout: Workout; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()

  const muscleLabels = workout.muscleGroups.map((g) => {
    const found = MUSCLE_GROUPS.find((m) => m.value === g)
    return { label: found ? t(found.labelKey) : g, color: found?.color ?? "#71717a" }
  })

  const performanceScore = workout.status === "completed"
    ? Math.min(100, Math.round(
        ((workout.totalSets * 10 + workout.totalReps * 2 + workout.totalVolume * 0.01) / 100) * 100
      ))
    : 0

  const circumference = 2 * Math.PI * 16
  const offset = circumference - (performanceScore / 100) * circumference

  return (
    <motion.div
      variants={listItem}
      layout
      className="group"
    >
      <Card
        className="border-zinc-800 bg-zinc-900/60 cursor-pointer hover:border-zinc-700 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <svg width="40" height="40" className="transform -rotate-90">
                <circle
                  cx="20" cy="20" r="16"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="3"
                />
                <circle
                  cx="20" cy="20" r="16"
                  fill="none"
                  stroke={getPerformanceColor(performanceScore)}
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                {performanceScore}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-200">
                {formatDate(new Date(workout.date))}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(workout.duration)}
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" />
                  {workout.exercises.length} {t("history.exercises")}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {workout.totalVolume.toLocaleString()} {t("unit.kg")}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {muscleLabels.map((ml) => (
                  <Badge
                    key={ml.label}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-zinc-700/50"
                    style={{ color: ml.color, borderColor: `${ml.color}40` }}
                  >
                    {ml.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors">
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Separator className="my-4 bg-zinc-800" />
                <div className="space-y-3">
                  {workout.exercises.map((we, i) => (
                    <div key={we.exercise.id} className="flex items-start gap-3">
                      <span className="text-xs text-zinc-600 font-mono w-5 mt-0.5">{i + 1}.</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-300">
                          {we.exercise.name}
                          <span className="text-xs text-zinc-600 ml-2">
                            {we.exercise.difficulty}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {we.sets.map((set) => (
                            <Badge
                              key={set.id}
                              variant="secondary"
                              className={`text-[10px] px-1.5 py-0 ${
                                set.completed
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-zinc-800 text-zinc-500 border-zinc-700"
                              }`}
                            >
                              {set.reps} &times; {set.weight}kg
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-zinc-600">
                        {we.sets.length} set{we.sets.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function HistoryPage() {
  const { t } = useTranslation()
  const workoutHistory = useWorkoutStore((s) => s.workoutHistory)
  const [filter, setFilter] = useState<"all" | "week" | "month">("all")

  const filteredWorkouts = workoutHistory.filter((w) => {
    const now = new Date()
    const workoutDate = new Date(w.date)
    if (filter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 86400000)
      return workoutDate >= weekAgo
    }
    if (filter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 86400000)
      return workoutDate >= monthAgo
    }
    return true
  })

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-6"
      >
        <motion.div variants={listItem}>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-zinc-100 via-white to-zinc-300 bg-clip-text text-transparent">
            {t("history.title")}
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">{t("history.subtitle")}</p>
        </motion.div>

        <motion.div variants={listItem}>
          <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800">{t("history.all")}</TabsTrigger>
              <TabsTrigger value="week" className="data-[state=active]:bg-zinc-800">{t("history.this_week")}</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-zinc-800">{t("history.this_month")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div variants={listItem}>
          {filteredWorkouts.length === 0 ? (
            <Card className="border-zinc-800 bg-zinc-900/40">
              <CardContent className="py-16 text-center">
                <Dumbbell className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-400 mb-2">
                  {t("history.empty_title")}
                </h3>
                <p className="text-zinc-600 text-sm mb-6">
                  {t("history.empty_desc")}
                </p>
                <Button className="bg-gradient-to-r from-zinc-200 to-zinc-300 text-black font-semibold hover:from-zinc-100 hover:to-zinc-200">
                  {t("history.start_workout")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredWorkouts.map((w, i) => (
                <WorkoutCard key={w.id} workout={w} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
