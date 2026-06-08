"use client"

import { motion } from "framer-motion"
import { Award, Trophy, Zap, Flame, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useProfileStore } from "@/store/profile-store"
import { LEVEL_THRESHOLDS } from "@/constants"
import { useTranslation } from "@/i18n"

export default function AchievementsPage() {
  const { t } = useTranslation()
  const profile = useProfileStore((s) => s.profile)
  const { level, xp, xpToNextLevel, totalXp } = profile.level

  const unlockedCount = profile.achievements.filter((a) => a.unlocked).length
  const totalCount = profile.achievements.length
  const overallProgress = (unlockedCount / totalCount) * 100

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

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={item}>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h1 className="text-3xl font-bold text-gradient-gold">
                {t("achievements.title")}
              </h1>
            </div>
            <p className="text-muted-foreground ml-9">
              {t("achievements.subtitle")}
            </p>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-emerald-500/10 to-transparent" />
                <CardContent className="relative p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {level}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold">{t("achievements.level")} {level}</h2>
                      <p className="text-muted-foreground">
                        {t("achievements.total_xp")}: {totalXp.toLocaleString()}
                      </p>
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{t("achievements.level")} {level}</span>
                          <span>{t("achievements.level")} {level + 1}</span>
                        </div>
                        <Progress
                          value={(xp / xpToNextLevel) * 100}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {xp} / {xpToNextLevel} {t("achievements.xp_to_next")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  {t("achievements.progress")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {unlockedCount} {t("achievements.of")} {totalCount} {t("achievements.unlocked").toLowerCase()}
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={item}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {profile.achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`glass border-glass-border transition-all duration-300 ${
                  achievement.unlocked
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`text-3xl ${
                        achievement.unlocked ? "" : "grayscale"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">
                          {achievement.name}
                        </h3>
                        {achievement.unlocked && (
                          <Badge variant="success" className="shrink-0">
                            {t("achievements.unlocked")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>
                              {achievement.progress.toLocaleString()}
                            </span>
                            <span>
                              {achievement.requirement.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={
                              (achievement.progress / achievement.requirement) *
                              100
                            }
                            className="h-1.5"
                          />
                        </div>
                      )}
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("achievements.unlocked")}{" "}
                          {new Date(
                            achievement.unlockedAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-400" />
                  {t("achievements.overview")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-emerald-400">
                      {profile.totalWorkouts}
                    </p>
                    <p className="text-xs text-muted-foreground">{t("achievements.stats_workouts")}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-blue-400">
                      {profile.totalVolume.toLocaleString()} kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("achievements.stats_volume")}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-orange-400">
                      {profile.currentStreak}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("achievements.stats_streak")}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-purple-400">
                      {profile.totalSets}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("achievements.stats_sets")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
