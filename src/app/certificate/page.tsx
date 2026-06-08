"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Download, Share2 } from "lucide-react"
import { useWorkoutStore } from "@/store/workout-store"
import { useProfileStore } from "@/store/profile-store"
import { Button } from "@/components/ui/button"
import { CertificateView } from "@/features/certificate/certificate-view"
import { useTranslation } from "@/i18n"
import { MOTIVATIONAL_QUOTES } from "@/constants"

function getRandomQuote(): string {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
}

export default function CertificatePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const currentWorkout = useWorkoutStore((s) => s.currentWorkout)
  const profile = useProfileStore((s) => s.profile)
  const certificateRef = useRef<HTMLDivElement>(null)
  const [quote] = useState(getRandomQuote)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (!currentWorkout || currentWorkout.status !== "completed") {
      router.replace("/")
    }
  }, [currentWorkout, router])

  const handleExport = useCallback(async (format: "png" | "jpeg") => {
    if (!certificateRef.current) return
    setExporting(true)
    try {
      const { toPng, toJpeg } = await import("html-to-image")
      const fn = format === "png" ? toPng : toJpeg
      const dataUrl = await fn(certificateRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#09090b",
      })
      const link = document.createElement("a")
      link.download = `gymai-certificate.${format}`
      link.href = dataUrl
      link.click()
    } catch {
      //
    } finally {
      setExporting(false)
    }
  }, [])

  const handleShare = useCallback(async () => {
    if (!certificateRef.current) return
    try {
      const { toPng } = await import("html-to-image")
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#09090b",
      })
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], "pipefit-certificate.png", { type: "image/png" })
      if (navigator.share) {
        await navigator.share({
          title: "PipeFit Certificate",
          files: [file],
        })
      }
    } catch {
      //
    }
  }, [])

  if (!currentWorkout || currentWorkout.status !== "completed") {
    return null
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            {t("certificate.title")}
          </h1>
          <p className="text-zinc-400 text-sm">
            {t("certificate.subtitle")}
          </p>
        </div>

        <div ref={certificateRef}>
          <CertificateView
            workout={currentWorkout}
            userName={profile.name}
            quote={quote}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => handleExport("png")}
            disabled={exporting}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-500"
          >
            <Download className="mr-2 h-4 w-4" />
            {t("certificate.download_png")}
          </Button>
          <Button
            onClick={() => handleExport("jpeg")}
            disabled={exporting}
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
          >
            <Download className="mr-2 h-4 w-4" />
            {t("certificate.download_jpg")}
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t("certificate.share")}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
