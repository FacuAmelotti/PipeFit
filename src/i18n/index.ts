import { useLocaleStore } from "@/store/locale-store"
import { es } from "./es"
import { en } from "./en"
import type { TranslationKey } from "./keys"

const translations = { es, en } as const

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale)
  const t = (key: string) => translations[locale][key as TranslationKey]
  return { t, locale }
}

export type { Translations } from "./types"
