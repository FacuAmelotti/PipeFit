"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Dumbbell, Sparkles, TrendingUp, Target, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MUSCLE_GROUPS } from "@/constants"
import type { MuscleGroup } from "@/types"
import { useTranslation } from "@/i18n"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const features = [
  {
    icon: Sparkles,
    titleKey: "landing.feature_smart_title" as const,
    descKey: "landing.feature_smart_desc" as const,
    color: "#10b981",
  },
  {
    icon: TrendingUp,
    titleKey: "landing.feature_track_title" as const,
    descKey: "landing.feature_track_desc" as const,
    color: "#3b82f6",
  },
  {
    icon: Target,
    titleKey: "landing.feature_achieve_title" as const,
    descKey: "landing.feature_achieve_desc" as const,
    color: "#a855f7",
  },
]

export default function Home() {
  const { t } = useTranslation()
  const router = useRouter()
  const [selected, setSelected] = useState<MuscleGroup[]>([])

  const toggleGroup = (value: MuscleGroup) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((g) => g !== value)
        : [...prev, value]
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-64 -top-64 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/5 blur-[120px]" />
        <div className="absolute -right-64 -top-32 h-[400px] w-[400px] rounded-full bg-[#3b82f6]/5 blur-[100px]" />
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 sm:pt-28 lg:pt-36">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          <motion.div variants={itemVariants}>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
              <Dumbbell className="h-8 w-8 text-[var(--primary)]" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            {t("landing.headline")}{" "}
            <span className="text-gradient">{t("landing.headline_highlight")}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-4 max-w-xl text-lg text-[var(--muted-foreground)] sm:mt-6"
          >
            {t("landing.subheadline")}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mt-12 sm:mt-16"
        >
          <motion.h2
            variants={itemVariants}
            className="mb-6 text-center text-lg font-semibold text-[var(--foreground)] sm:text-xl"
          >
            {t("landing.select_muscles")}
          </motion.h2>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {MUSCLE_GROUPS.map((group) => {
              const isSelected = selected.includes(group.value)
              const Icon = group.icon

              return (
                <motion.div key={group.value} variants={itemVariants}>
                  <Card
                    glass
                    className={cn(
                      "group cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                      isSelected && "scale-[1.02]"
                    )}
                    style={
                      isSelected
                        ? {
                            borderColor: group.color,
                            boxShadow: `0 0 24px ${group.color}40`,
                          }
                        : undefined
                    }
                    onClick={() => toggleGroup(group.value)}
                  >
                    <CardContent className="flex flex-col items-center gap-3 p-5 text-center sm:p-6">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors sm:h-14 sm:w-14"
                        style={{
                          backgroundColor: `${group.color}18`,
                          color: group.color,
                        }}
                      >
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">
                          {t(group.labelKey)}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {t(group.descKey)}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ backgroundColor: group.color }}
                        >
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Button
            size="xl"
            disabled={selected.length === 0}
            onClick={() => {
              const params = new URLSearchParams()
              selected.forEach((g) => params.append("groups", g))
              router.push(`/generate?${params.toString()}`)
            }}
            className="group gap-2"
          >
            {t("landing.generate")}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            {selected.length === 0
              ? t("landing.select_hint")
              : `${selected.length} ${t("landing.selected_hint")}`}
          </p>
        </motion.div>
      </section>

      <section className="border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.titleKey} variants={itemVariants}>
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: `${feature.color}18`,
                          color: feature.color,
                        }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
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

      <footer className="border-t border-[var(--border)] py-6">
        <p className="text-center text-xs text-[var(--muted-foreground)]">
          &copy; {t("landing.footer")}
        </p>
      </footer>
    </div>
  )
}
