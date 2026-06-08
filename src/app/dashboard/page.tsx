"use client"

import { motion } from "framer-motion"
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import { Dumbbell, Clock, TrendingUp, Flame, Activity, ChevronRight } from "lucide-react"
import { useDashboard } from "@/hooks/use-dashboard"
import { useWorkoutStore } from "@/store/workout-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDuration, formatShortDate } from "@/lib/utils"
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

export default function DashboardPage() {
  const {
    totalWorkouts, totalHours, totalVolume, currentStreak,
    weeklyWorkouts, monthlyVolume, muscleGroupBreakdown,
  } = useDashboard()
  const workoutHistory = useWorkoutStore((s) => s.workoutHistory)

  const recentWorkouts = workoutHistory.slice(0, 5)
  const { t } = useTranslation()

  const stats = [
    {
      label: t("dashboard.total_workouts"),
      value: totalWorkouts,
      icon: Dumbbell,
      color: "from-blue-500 to-blue-600",
      bgGlow: "bg-blue-500/10",
    },
    {
      label: t("dashboard.hours_trained"),
      value: totalHours,
      suffix: "h",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      bgGlow: "bg-purple-500/10",
    },
    {
      label: t("dashboard.total_volume"),
      value: totalVolume.toLocaleString(),
      suffix: " kg",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      bgGlow: "bg-emerald-500/10",
    },
    {
      label: t("dashboard.current_streak"),
      value: currentStreak,
      suffix: " days",
      icon: Flame,
      color: "from-orange-500 to-red-500",
      bgGlow: "bg-orange-500/10",
    },
  ]

  const CHART_COLORS = ["#22c55e", "#ef4444", "#a855f7", "#f97316", "#3b82f6", "#06b6d4", "#ec4899", "#eab308", "#14b8a6"]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-black p-4 sm:p-6 lg:p-8 space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-zinc-100 via-white to-zinc-300 bg-clip-text text-transparent">
          {t("dashboard.title")}
        </h1>
        <p className="text-zinc-500 mt-1 text-sm">{t("dashboard.subtitle")}</p>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="border-zinc-800 bg-zinc-900/80 overflow-hidden relative group"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${stat.bgGlow}`} />
              <CardContent className="p-5 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-500 text-xs uppercase tracking-wider font-medium">
                    {stat.label}
                  </span>
                  <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                  <span className="text-sm font-normal text-zinc-500 ml-1">
                    {stat.suffix ?? ""}
                  </span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-zinc-800 bg-zinc-900/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  {t("dashboard.weekly_workouts")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyWorkouts}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="day" stroke="#71717a" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#71717a" tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #27272a",
                          borderRadius: "8px",
                          color: "#f4f4f5",
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {weeklyWorkouts.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  {t("dashboard.monthly_volume")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyVolume}>
                      <defs>
                        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis
                        dataKey="month"
                        stroke="#71717a"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => {
                          const [, m] = v.split("-")
                          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                          return months[parseInt(m) - 1] ?? v
                        }}
                      />
                      <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #27272a",
                          borderRadius: "8px",
                          color: "#f4f4f5",
                        }}
                        formatter={(value, name) => [`${Number(value).toLocaleString()} kg`, String(name)]}
                      />
                      <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fill="url(#volumeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-zinc-800 bg-zinc-900/80 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-orange-400" />
                {t("dashboard.recent_workouts")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[28rem]">
                {recentWorkouts.length === 0 ? (
                  <div className="p-6 text-center text-zinc-600 text-sm">
                    {t("common.no_data")}
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800/50">
                    {recentWorkouts.map((w, i) => (
                      <motion.div
                        key={w.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">
                            {formatShortDate(new Date(w.date))}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {formatDuration(w.duration)} &middot; {w.totalSets} sets
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">{w.totalVolume.toLocaleString()} kg</span>
                          <ChevronRight className="h-4 w-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400 font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-400" />
              {t("dashboard.muscle_breakdown")}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-600">
              How often each muscle group appears in your workouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {muscleGroupBreakdown.length === 0 ? (
              <p className="text-zinc-600 text-sm py-4 text-center">{t("common.no_data")}</p>
            ) : (
              <div className="space-y-3">
                {muscleGroupBreakdown.map((mg, i) => {
                  const maxCount = muscleGroupBreakdown[0]?.count ?? 1
                  const percent = (mg.count / maxCount) * 100
                  const groupInfo = MUSCLE_GROUPS.find((g) => g.value === mg.group)
                  return (
                    <div key={mg.group} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-zinc-400 w-20 truncate">
                        {groupInfo ? t(groupInfo.labelKey) : mg.group}
                      </span>
                      <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: groupInfo?.color ?? CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-8 text-right">
                        {mg.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
