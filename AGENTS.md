<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:opencode-summary -->
# Project Summary — PipeFit (formerly GymAI Planner)

## Goal
Build a production-grade fitness web application called PipeFit with full workout planning, execution, tracking, analytics, gamification, and certificate generation, all running entirely on the frontend but architected for future backend integration.

## Constraints & Preferences
- Next.js 16.x, React 19, TypeScript strict, Tailwind CSS v4, Shadcn/UI, Framer Motion, Zustand, React Hook Form, Zod, Recharts, Lucide Icons
- Dark mode by default with glassmorphism, premium typography, responsive mobile-first design
- No backend — everything runs on the frontend with LocalStorage persistence (via Zustand persist)
- Architecture supports future backend integration (abstracted repos/services/interfaces)
- Exercise database of 154 exercises with full metadata (no placeholders)
- Workout generation follows real training logic (compound first, isolation later, fatigue management)
- Certificate generator with PNG/JPG export via html-to-image
- Must feel like a premium SaaS product (Apple Fitness / Linear / Vercel design quality)

## Progress

### Done
- Next.js 16.2.7 project with all deps installed, Turbopack build, 0 TS errors
- Full directory structure under `src/` following Next.js App Router convention
- Core TypeScript types: Exercise, Workout, WorkoutExercise, ExerciseSet, MuscleGroup, Difficulty, Equipment, UserProfile, DashboardMetrics, Achievement, Badge, Notification
- IExerciseRepository interface + ExerciseRepository with 154 exercises
- `workout-generator.ts`: compound-first logic, muscle group pairing, fatigue management
- Zustand stores: `workout-store.ts`, `profile-store.ts`, `locale-store.ts`
- Custom hooks: `use-workout`, `use-dashboard`, `use-theme`
- 18 Shadcn/UI components built from scratch with CSS variables (button, card, dialog, input, label, badge, progress, tabs, select, slider, switch, separator, scroll-area, tooltip, toast, checkbox, avatar, dropdown-menu)
- 154-exercise database (`exercises.ts`) across 9 muscle groups, ~6200 lines
- CSS design system: dark/light variables, glassmorphism, shimmer, pulse-glow, float, slide-up, scale-in animations
- Landing page (`/`): animated 3x3 muscle group grid, Framer Motion staggers, multi-select
- Workout generation (`/generate`): loading animation, exercise plan, stats badges
- Workout execution (`/workout`): progress bar, exercise card, set tracker, pause/resume, finish dialog
- Workout summary (`/workout/summary`): trophy animation, performance score, stats grid
- Exercise library (`/exercises`): search, filter by muscle group + difficulty
- Exercise detail (`/exercises/[slug]`): full exercise breakdown
- Dashboard (`/dashboard`): 4 stat cards, weekly bar chart, monthly area chart, muscle breakdown, recent workouts
- History (`/history`): tabs (All/Week/Month), expandable cards, empty state
- Certificate (`/certificate`): premium dark certificate, gold gradient, PNG/JPG export, Web Share API
- Settings (`/settings`): profile, appearance, training prefs, notifications, data export/reset
- Achievements (`/achievements`): level display, XP progress, achievement grid, stats
- Layout: navbar (glassmorphism, nav links, theme toggle, notification bell, mobile hamburger), sidebar, theme-toggle, notification-bell, client-layout (theme hydration, ToastProvider)
- i18n system: `keys.ts` (TranslationKey type union), `es.ts` (Spanish), `en.ts` (English), `types.ts` (Translations Record type), `index.ts` (useTranslation hook)
- Build output: 12 routes (/, /achievements, /certificate, /dashboard, /exercises, /exercises/[slug], /generate, /history, /settings, /workout, /workout/summary), 0 TS errors

### In Progress
- (waiting on user)

### Blocked
- (none)

## Key Decisions
- Shadcn/UI built from scratch (no CLI) to match premium design system
- Dark mode via `.dark` class on `<html>` + Zustand persist store, hydrated in client-layout via useEffect
- `asChild` + `motion.div` avoided due to Framer Motion type conflicts — direct Radix primitives with CSS transitions instead
- i18n uses simple Zustand locale store + key-based translation JSON files (not next-intl) to keep it lightweight
- Exercise fields will be bilingual by adding `_en` suffix fields to Exercise type (base fields = Spanish)
- Tailwind CSS v4 — uses `@plugin` directives in CSS, no tailwind.config.js
- `tailwindcss-animate` plugin loaded via `@plugin "tailwindcss-animate"` in globals.css
- Invalid MuscleGroup values in exercises.ts were fixed (traps→shoulders, hamstrings→legs, quads→legs, core→abs, lats→back, calves→legs, obliques→abs, arms→biceps, forearms→abs, hip-flexors→abs)

## Next Steps
1. ~~Rename all references from "GymAI Planner" to "PipeFit"~~ (done)
2. Add bilingual exercise translations to the Exercise type and database
3. Set up git repository (`main` + `develop` branches)
4. Deploy to Vercel from develop branch

## Relevant Files
- `src/types/index.ts` — Core types
- `src/i18n/keys.ts` — Translation key definitions
- `src/i18n/es.ts` — Spanish translations
- `src/i18n/en.ts` — English translations
- `src/i18n/index.ts` — `useTranslation()` hook
- `src/store/locale-store.ts` — Locale state (Zustand + persist)
- `src/data/exercises.ts` — 154-exercise database
- `src/services/workout-generator.ts` — Workout generation engine
- `src/store/workout-store.ts` — Workout state/history
- `src/store/profile-store.ts` — Profile/XP/achievements
- `src/app/page.tsx` — Landing page
- `src/app/workout/page.tsx` — Workout execution
- `src/app/certificate/page.tsx` — Certificate export
- `src/app/dashboard/page.tsx` — Analytics
- `src/app/globals.css` — Design system
- `src/components/ui/` — 18 UI components
- `src/components/layout/navbar.tsx` — Navigation
- `src/app/client-layout.tsx` — Theme hydration
<!-- END:opencode-summary -->
