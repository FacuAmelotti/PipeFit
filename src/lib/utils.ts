import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function calculateVolume(
  weight: number,
  reps: number,
  sets: number
): number {
  return weight * reps * sets
}

export function calculateTotalVolume(
  sets: Array<{ weight: number; reps: number }>
): number {
  return sets.reduce((total, set) => total + set.weight * set.reps, 0)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
