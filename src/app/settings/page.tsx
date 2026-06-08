"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Moon,
  Sun,
  Weight,
  Timer,
  Bell,
  BellOff,
  Trash2,
  Download,
  User,
  Shield,
  Info,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useProfileStore } from "@/store/profile-store"
import { useWorkoutStore } from "@/store/workout-store"
import { useTheme } from "@/hooks/use-theme"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from "@/i18n"

export default function SettingsPage() {
  const { t } = useTranslation()
  const profile = useProfileStore((s) => s.profile)
  const updateName = useProfileStore((s) => s.updateName)
  const setUnitSystem = useProfileStore((s) => s.setUnitSystem)
  const setRestTimer = useProfileStore((s) => s.setRestTimer)
  const toggleNotifications = useProfileStore((s) => s.toggleNotifications)
  const resetProfile = useProfileStore((s) => s.resetProfile)
  const clearHistory = useWorkoutStore((s) => s.clearHistory)
  const { theme, setTheme } = useTheme()

  const [nameInput, setNameInput] = useState(profile.name)
  const [showReset, setShowReset] = useState(false)

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateName(nameInput.trim())
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={item}>
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-6 h-6 text-emerald-400" />
              <h1 className="text-3xl font-bold text-gradient">{t("settings.title")}</h1>
            </div>
            <p className="text-muted-foreground ml-9">
              {t("settings.subtitle")}
            </p>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  {t("settings.profile")}
                </CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("settings.display_name")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onBlur={handleSaveName}
                      className="flex-1"
                    />
                    <Button onClick={handleSaveName} variant="primary" size="sm">
                      {t("settings.save")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-emerald-400" />
                  {t("settings.appearance")}
                </CardTitle>
                <CardDescription>Customize your theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Sun className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label>{t("settings.dark_mode")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.dark_mode_desc")}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="w-5 h-5 text-emerald-400" />
                  {t("settings.training")}
                </CardTitle>
                <CardDescription>
                  Units, rest times, and workout settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("settings.weight_unit")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.weight_unit_desc")}
                    </p>
                  </div>
                  <div className="flex gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={profile.unitSystem === "kg" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setUnitSystem("kg")}
                    >
                      {t("unit.kg")}
                    </Button>
                    <Button
                      variant={profile.unitSystem === "lb" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setUnitSystem("lb")}
                    >
                      {t("unit.lb")}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Timer className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label>{t("settings.rest_timer")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.rest_timer_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 bg-muted rounded-lg p-1">
                    {[60, 90, 120, 180].map((sec) => (
                      <Button
                        key={sec}
                        variant={
                          profile.restTimerPreference === sec
                            ? "primary"
                            : "ghost"
                        }
                        size="sm"
                        onClick={() => setRestTimer(sec)}
                      >
                        {sec}s
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {profile.notificationsEnabled ? (
                    <Bell className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <BellOff className="w-5 h-5 text-muted-foreground" />
                  )}
                  {t("settings.notifications")}
                </CardTitle>
                <CardDescription>
                  {t("settings.notifications_desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("settings.enable_notifications")}</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about achievements, streaks, and workouts
                    </p>
                  </div>
                  <Switch
                    checked={profile.notificationsEnabled}
                    onCheckedChange={toggleNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Shield className="w-5 h-5" />
                  {t("settings.data")}
                </CardTitle>
                <CardDescription>
                  Export or reset your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label>{t("settings.export_data")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.export_desc")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const data = {
                        profile: useProfileStore.getState().profile,
                        history:
                          useWorkoutStore.getState().workoutHistory,
                      }
                      const blob = new Blob(
                        [JSON.stringify(data, null, 2)],
                        { type: "application/json" }
                      )
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `gymai-export-${
                        new Date().toISOString().split("T")[0]
                      }.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    {t("settings.export_json")}
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <div>
                      <Label>{t("settings.reset_data")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.reset_desc")}
                      </p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Reset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("settings.reset_confirm_title")}</DialogTitle>
                        <DialogDescription>
                          {t("settings.reset_confirm_desc")}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => setShowReset(false)}
                        >
                          {t("settings.cancel")}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            resetProfile()
                            clearHistory()
                            setShowReset(false)
                          }}
                        >
                          {t("settings.reset_confirm_yes")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass border-glass-border">
              <CardContent className="py-6">
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <Info className="w-4 h-4" />
                  <span>
                    {t("settings.version")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
