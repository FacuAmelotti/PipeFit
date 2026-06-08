"use client"

import { Workout } from "@/types"
import { formatDate, formatDuration } from "@/lib/utils"
import { Trophy, Zap } from "lucide-react"
import { MUSCLE_GROUPS } from "@/constants"
import { useTranslation } from "@/i18n"

interface CertificateViewProps {
  workout: Workout
  userName: string
  quote: string
}

export function CertificateView({ workout, userName, quote }: CertificateViewProps) {
  const { t } = useTranslation()
  const muscleLabels = workout.muscleGroups.map((g) => {
    const found = MUSCLE_GROUPS.find((m) => m.value === g)
    return found ? t(found.labelKey) : g
  })

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-1 lightning-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.08),transparent_70%)]" />
      <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-primary/5 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 p-8 sm:p-12">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs uppercase tracking-widest text-yellow-400">
            <Trophy className="h-3.5 w-3.5" />
            {t("certificate.discipline_validation")}
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-tight">
            {t("certificate.title")}
          </h1>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base font-medium tracking-wide">
            {t("certificate.subtitle")}
          </p>
        </div>

        <div className="text-center mb-10">
          <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {userName}
          </p>
          <p className="text-zinc-500 text-sm">
            {formatDate(new Date(workout.date))}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {[
            { label: t("summary.duration"), value: formatDuration(workout.duration) },
            { label: t("summary.exercises_completed"), value: workout.exercises.length },
            { label: t("summary.total_sets"), value: workout.totalSets },
            { label: t("summary.total_reps"), value: workout.totalReps },
            { label: t("summary.total_volume"), value: `${workout.totalVolume} ${t("unit.kg")}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center"
            >
              <p className="text-lg sm:text-2xl font-bold text-yellow-400">
                {stat.value}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {muscleLabels.map((label) => (
            <span
              key={label}
              className="inline-block rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1 text-xs font-medium text-zinc-300"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-zinc-400 italic text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        <div className="border-t border-zinc-800 pt-6 text-center">
          <p className="text-zinc-600 text-xs uppercase tracking-widest">
            {t("certificate.discipline_validation")} &mdash; {t("certificate.approved")}
          </p>
          <p className="text-zinc-700 text-xs mt-2">
            <span className="text-gradient">{t("certificate.generated_by")}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
