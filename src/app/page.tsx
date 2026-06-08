"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Sparkles, TrendingUp, Target, ArrowRight, Bolt, X, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MUSCLE_GROUPS } from "@/constants"
import type { MuscleGroup } from "@/types"
import { useTranslation } from "@/i18n"
import { useWorkoutStore } from "@/store/workout-store"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

import type { Variants } from "framer-motion"

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  hover: { y: -6, transition: { duration: 0.3, ease: "easeOut" as const } },
}

const features = [
  {
    icon: Sparkles,
    titleKey: "landing.feature_smart_title" as const,
    descKey: "landing.feature_smart_desc" as const,
  },
  {
    icon: TrendingUp,
    titleKey: "landing.feature_track_title" as const,
    descKey: "landing.feature_track_desc" as const,
  },
  {
    icon: Target,
    titleKey: "landing.feature_achieve_title" as const,
    descKey: "landing.feature_achieve_desc" as const,
  },
]

function LightningBolt() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full blur-[140px]" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 4%, transparent)" }} />
      <div className="absolute -right-48 top-1/3 h-[500px] w-[500px] rounded-full bg-[#7c3aed]/5 blur-[120px]" />
      <svg className="absolute top-0 right-[10%] h-full w-auto opacity-[0.03] dark:opacity-[0.04]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <svg className="absolute bottom-[20%] left-[5%] h-48 w-auto opacity-[0.02] dark:opacity-[0.03] rotate-45" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const router = useRouter()
  const [selected, setSelected] = useState<MuscleGroup[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // resume workout
  const currentWorkout = useWorkoutStore((s) => s.currentWorkout)
  const workoutStatus = useWorkoutStore((s) => s.status)
  const hasActiveWorkout = Boolean(
    currentWorkout &&
      (workoutStatus === "in-progress" || workoutStatus === "paused")
  )
  const activeWorkoutName = currentWorkout?.muscleGroups?.length
    ? currentWorkout.muscleGroups.join(", ")
    : ""

  const toggleGroup = (value: MuscleGroup) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((g) => g !== value)
        : [...prev, value]
    )
  }

  return (
    <div className="relative overflow-hidden bg-noise">
      <LightningBolt />

      {/* RESUME BANNER */}
      <AnimatePresence>
        {hasActiveWorkout && (
          <motion.div
            initial={{ opacity: 0, y: -32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -32, scale: 0.95 }}
            className="relative z-40 mx-auto mt-4 max-w-xl px-4 sm:px-0"
          >
            <button
              type="button"
              onClick={() => router.push("/workout")}
              className="group relative w-full overflow-hidden rounded-2xl border border-primary-30 bg-gradient-to-r from-primary-10 via-primary-8 to-transparent p-4 text-left shadow-lg shadow-[var(--primary)]/10 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/20 hover:border-primary-60 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-noise opacity-30" />
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)" }} />
              <div className="relative flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-15 animate-glow-pulse">
                  <Play className="h-5 w-5 text-[var(--primary)] ml-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {t("landing.resume_banner")}
                  </p>
                  {activeWorkoutName && (
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)] truncate">
                      {activeWorkoutName}
                    </p>
                  )}
                </div>
                <div className="shrink-0 rounded-full border border-primary-30 bg-primary-10 px-3 py-1.5 text-xs font-medium text-[var(--primary)] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  {t("landing.resume_cta")}
                </div>
                <div className="shrink-0 text-[var(--muted-foreground)] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-32 lg:pt-40">
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center"
        >
          <motion.div variants={itemVariants}>
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl lightning-border animate-glow-pulse bg-primary-10">
              <Zap className="h-9 w-9 sm:h-10 sm:w-10 text-[var(--primary)] lightning-icon" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl"
          >
            {t("landing.headline")}{" "}
            <span className="text-gradient">{t("landing.headline_highlight")}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed"
          >
            {t("landing.subheadline")}
          </motion.p>
        </motion.div>

        {/* MUSCLE SELECTOR */}
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-14 sm:mt-18"
        >
          <motion.h2
            variants={itemVariants}
            className="mb-8 text-center text-base sm:text-lg font-semibold text-[var(--foreground)] tracking-wide"
          >
            {t("landing.select_muscles")}
          </motion.h2>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {MUSCLE_GROUPS.map((group) => {
              const isSelected = selected.includes(group.value)
              const Icon = group.icon

              return (
                <motion.div
                  key={group.value}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <button
                    onClick={() => toggleGroup(group.value)}
                    className={cn(
                      "relative w-full text-left card-hover rounded-2xl p-4 sm:p-5 border transition-all duration-300",
                      isSelected
                        ? "border-primary-60 bg-primary-8"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-primary-30"
                    )}
                  >
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <div
                        className={cn(
                          "flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl transition-all duration-300",
                          isSelected ? "bg-primary-15 scale-110" : "bg-[var(--muted)]"
                        )}
                        style={{
                          color: isSelected ? "var(--primary)" : group.color,
                        }}
                      >
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm sm:text-base text-[var(--foreground)]">
                          {t(group.labelKey)}
                        </p>
                        <p className="mt-0.5 text-[10px] sm:text-xs text-[var(--muted-foreground)] leading-relaxed hidden sm:block">
                          {t(group.descKey)}
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)]"
                        >
                          <Bolt className="h-3 w-3 text-white fill-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button
            size="xl"
            onClick={selected.length === 0 ? undefined : () => router.push(`/generate?groups=${selected.join(",")}`)}
            className={cn(
              "group gap-2.5 text-base sm:text-lg px-8 py-3.5 sm:px-10 rounded-2xl",
              selected.length === 0 && "pointer-events-none opacity-50"
            )}
          >
            <Zap className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
            {t("landing.generate")}
            <ArrowRight className="h-5 w-5 transition-all duration-300 group-hover:translate-x-1" />
          </Button>
          <p className="mt-3 text-xs sm:text-sm text-[var(--muted-foreground)]">
            {selected.length === 0
              ? t("landing.select_hint")
              : `${selected.length} ${t("landing.selected_hint")}`}
          </p>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative border-t border-[var(--border)] py-20 sm:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-px w-3/4" style={{ background: "linear-gradient(to right, transparent, color-mix(in srgb, var(--primary) 30%, transparent), transparent)" }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid gap-5 sm:gap-6 md:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.titleKey} variants={itemVariants}>
                  <Card className="h-full card-hover">
                    <CardContent className="flex flex-col items-center gap-4 p-6 sm:p-8 text-center">
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl lightning-icon bg-primary-10">
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--primary)]" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
                        {t(feature.titleKey)}
                      </h3>
                      <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {t(feature.descKey)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-gradient">PipeFit</span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} {t("landing.footer")}
          </p>
        </div>
      </footer>
    </div>
  )
}
