"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WorkoutExercise, ExerciseSet } from "@/types"
import { Plus, Trash2, Dumbbell } from "lucide-react"

interface SetTrackerProps {
  exercise: WorkoutExercise
  onUpdate: (setId: string, data: Partial<ExerciseSet>) => void
  onAddSet: () => void
  onRemoveSet: (setId: string) => void
  unitSystem: "kg" | "lb"
}

export function SetTracker({
  exercise,
  onUpdate,
  onAddSet,
  onRemoveSet,
  unitSystem,
}: SetTrackerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-[var(--primary)]" />
          <span className="text-sm font-medium">Set Tracker</span>
          <Badge variant="secondary" className="text-xs">
            {exercise.sets.length} sets
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="gap-1" onClick={onAddSet}>
          <Plus className="h-3.5 w-3.5" /> Add Set
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left text-xs text-[var(--muted-foreground)] font-medium pb-2 w-12">
                Set
              </th>
              <th className="text-left text-xs text-[var(--muted-foreground)] font-medium pb-2 w-28">
                Weight ({unitSystem})
              </th>
              <th className="text-left text-xs text-[var(--muted-foreground)] font-medium pb-2 w-20">
                Reps
              </th>
              <th className="text-left text-xs text-[var(--muted-foreground)] font-medium pb-2 w-16">
                Done
              </th>
              <th className="w-8 pb-2" />
            </tr>
          </thead>
          <tbody>
            {exercise.sets.map((set) => (
              <tr
                key={set.id}
                className={cn(
                  "border-b border-[var(--border)]/50 transition-colors",
                  set.completed && "opacity-50"
                )}
              >
                <td className="py-2.5">
                  <span className="text-sm font-mono text-[var(--muted-foreground)]">
                    {set.setNumber}
                  </span>
                </td>
                <td className="py-2.5 pr-2">
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={set.weight || ""}
                    onChange={(e) =>
                      onUpdate(set.id, { weight: parseFloat(e.target.value) || 0 })
                    }
                    className="h-8 text-sm w-full"
                    disabled={set.completed}
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <Input
                    type="number"
                    min={0}
                    value={set.reps || ""}
                    onChange={(e) =>
                      onUpdate(set.id, { reps: parseInt(e.target.value) || 0 })
                    }
                    className="h-8 text-sm w-full"
                    disabled={set.completed}
                  />
                </td>
                <td className="py-2.5">
                  <Checkbox
                    checked={set.completed}
                    onCheckedChange={(checked) =>
                      onUpdate(set.id, { completed: checked === true })
                    }
                  />
                </td>
                <td className="py-2.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-400"
                    onClick={() => onRemoveSet(set.id)}
                    disabled={exercise.sets.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] px-1">
        <span>
          Completed: {exercise.sets.filter((s) => s.completed).length}/{exercise.sets.length}
        </span>
        <span>
          Volume:{" "}
          {exercise.sets.reduce((t, s) => t + s.weight * s.reps, 0).toLocaleString()}{" "}
          {unitSystem}
        </span>
      </div>
    </div>
  )
}
