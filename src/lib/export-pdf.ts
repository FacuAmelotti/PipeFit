import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { UserProfile, Workout } from "@/types"

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function getLevelName(level: number): string {
  if (level <= 3) return "Principiante"
  if (level <= 6) return "Intermedio"
  if (level <= 10) return "Avanzado"
  if (level <= 15) return "Élite"
  return "Leyenda"
}

export async function exportWorkoutDataPDF(
  profile: UserProfile,
  history: Workout[]
) {
  const totalVolume = profile.totalVolume || history.reduce((sum, w) => sum + w.totalVolume, 0)
  const totalReps = profile.totalReps || history.reduce((sum, w) => sum + w.totalReps, 0)
  const totalSets = profile.totalSets || history.reduce((sum, w) => sum + w.totalSets, 0)
  const hoursTrained = ((profile.totalDuration || history.reduce((sum, w) => sum + w.duration, 0)) / 60).toFixed(1)

  const container = document.createElement("div")
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 800px;
    background: #0a0a12;
    color: #f1f5f9;
    font-family: system-ui, -apple-system, sans-serif;
    padding: 0;
    z-index: -1;
  `
  container.innerHTML = `
    <div style="padding: 48px 40px 40px; position: relative; overflow: hidden;">
      <!-- Background glow -->
      <div style="position: absolute; top: -120px; right: -120px; width: 400px; height: 400px; border-radius: 50%; background: rgba(167, 139, 250, 0.08); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -80px; left: -80px; width: 300px; height: 300px; border-radius: 50%; background: rgba(124, 58, 237, 0.06); pointer-events: none;"></div>

      <!-- HEADER -->
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid rgba(167, 139, 250, 0.2);">
        <div style="width: 48px; height: 48px; border-radius: 14px; background: rgba(167, 139, 250, 0.12); display: flex; align-items: center; justify-content: center;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#a78bfa" fill-opacity="0.3"/>
          </svg>
        </div>
        <div>
          <div style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #a78bfa, #c084fc, #e9d5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PipeFit</div>
          <div style="font-size: 13px; color: #8b8fa3; margin-top: 2px;">Reporte de Entrenamiento</div>
        </div>
        <div style="margin-left: auto; text-align: right;">
          <div style="font-size: 13px; color: #8b8fa3;">Generado el</div>
          <div style="font-size: 14px; color: #f1f5f9; font-weight: 600;">${formatDate(new Date())}</div>
        </div>
      </div>

      <!-- USER INFO -->
      <div style="display: flex; gap: 24px; margin-bottom: 32px; padding: 20px 24px; border-radius: 16px; border: 1px solid rgba(167, 139, 250, 0.15); background: rgba(16, 16, 26, 0.6);">
        <div style="flex: 1;">
          <div style="font-size: 12px; color: #8b8fa3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Usuario</div>
          <div style="font-size: 18px; font-weight: 700; color: #f1f5f9;">${profile.name || "Sin nombre"}</div>
        </div>
        <div style="flex: 1;">
          <div style="font-size: 12px; color: #8b8fa3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Nivel</div>
          <div style="font-size: 18px; font-weight: 700; color: #a78bfa;">${profile.level.level} — ${getLevelName(profile.level.level)}</div>
        </div>
        <div style="flex: 1;">
          <div style="font-size: 12px; color: #8b8fa3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Racha Actual</div>
          <div style="font-size: 18px; font-weight: 700; color: #f1f5f9;">${profile.currentStreak} días</div>
        </div>
      </div>

      <!-- STATS GRID -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px;">
        <div style="padding: 20px; border-radius: 14px; border: 1px solid rgba(167, 139, 250, 0.12); background: rgba(16, 16, 26, 0.4); text-align: center;">
          <div style="font-size: 28px; font-weight: 800; color: #a78bfa; margin-bottom: 4px;">${history.length}</div>
          <div style="font-size: 12px; color: #8b8fa3;">Entrenamientos</div>
        </div>
        <div style="padding: 20px; border-radius: 14px; border: 1px solid rgba(167, 139, 250, 0.12); background: rgba(16, 16, 26, 0.4); text-align: center;">
          <div style="font-size: 28px; font-weight: 800; color: #a78bfa; margin-bottom: 4px;">${hoursTrained}</div>
          <div style="font-size: 12px; color: #8b8fa3;">Horas Entrenadas</div>
        </div>
        <div style="padding: 20px; border-radius: 14px; border: 1px solid rgba(167, 139, 250, 0.12); background: rgba(16, 16, 26, 0.4); text-align: center;">
          <div style="font-size: 28px; font-weight: 800; color: #a78bfa; margin-bottom: 4px;">${totalVolume.toLocaleString()}</div>
          <div style="font-size: 12px; color: #8b8fa3;">Volumen Total (kg)</div>
        </div>
        <div style="padding: 20px; border-radius: 14px; border: 1px solid rgba(167, 139, 250, 0.12); background: rgba(16, 16, 26, 0.4); text-align: center;">
          <div style="font-size: 28px; font-weight: 800; color: #a78bfa; margin-bottom: 4px;">${profile.currentStreak}</div>
          <div style="font-size: 12px; color: #8b8fa3;">Racha Actual (días)</div>
        </div>
      </div>

      <!-- SECONDARY STATS -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
        <div style="padding: 16px; border-radius: 12px; background: rgba(167, 139, 250, 0.06); text-align: center;">
          <div style="font-size: 20px; font-weight: 700; color: #c084fc;">${totalSets.toLocaleString()}</div>
          <div style="font-size: 11px; color: #8b8fa3; margin-top: 2px;">Series Totales</div>
        </div>
        <div style="padding: 16px; border-radius: 12px; background: rgba(167, 139, 250, 0.06); text-align: center;">
          <div style="font-size: 20px; font-weight: 700; color: #c084fc;">${totalReps.toLocaleString()}</div>
          <div style="font-size: 11px; color: #8b8fa3; margin-top: 2px;">Repeticiones Totales</div>
        </div>
        <div style="padding: 16px; border-radius: 12px; background: rgba(167, 139, 250, 0.06); text-align: center;">
          <div style="font-size: 20px; font-weight: 700; color: #c084fc;">${profile.level.totalXp}</div>
          <div style="font-size: 11px; color: #8b8fa3; margin-top: 2px;">XP Total</div>
        </div>
      </div>

      <!-- WORKOUT HISTORY -->
      <div style="margin-bottom: 32px;">
        <div style="font-size: 16px; font-weight: 700; color: #f1f5f9; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid rgba(167, 139, 250, 0.15);">
          Historial de Entrenamientos
        </div>
        ${history.length === 0 ? `
        <div style="padding: 32px; text-align: center; color: #8b8fa3; border-radius: 12px; border: 1px dashed rgba(167, 139, 250, 0.2);">
          No hay entrenamientos registrados aún.
        </div>
        ` : `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 1px solid rgba(167, 139, 250, 0.15);">
              <th style="text-align: left; padding: 10px 12px; color: #8b8fa3; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px;">Fecha</th>
              <th style="text-align: left; padding: 10px 12px; color: #8b8fa3; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px;">Ejercicios</th>
              <th style="text-align: center; padding: 10px 12px; color: #8b8fa3; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px;">Series</th>
              <th style="text-align: center; padding: 10px 12px; color: #8b8fa3; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px;">Reps</th>
              <th style="text-align: right; padding: 10px 12px; color: #8b8fa3; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px;">Volumen</th>
              <th style="text-align: right; padding: 10px 12px; color: #8b8fa3; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px;">Duración</th>
            </tr>
          </thead>
          <tbody>
            ${history.slice().reverse().slice(0, 20).map(w => `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
              <td style="padding: 10px 12px; color: #f1f5f9;">${formatDate(w.date)}</td>
              <td style="padding: 10px 12px; color: #cbd5e1;">${w.exercises.length}</td>
              <td style="padding: 10px 12px; text-align: center; color: #cbd5e1;">${w.totalSets}</td>
              <td style="padding: 10px 12px; text-align: center; color: #cbd5e1;">${w.totalReps}</td>
              <td style="padding: 10px 12px; text-align: right; color: #a78bfa; font-weight: 600;">${w.totalVolume} kg</td>
              <td style="padding: 10px 12px; text-align: right; color: #cbd5e1;">${formatDuration(w.duration)}</td>
            </tr>
            `).join("")}
          </tbody>
        </table>
        ${history.length > 20 ? `<div style="padding: 8px 12px; text-align: center; color: #8b8fa3; font-size: 12px; font-style: italic;">Mostrando los 20 entrenamientos más recientes de ${history.length} totales.</div>` : ""}
        `}
      </div>

      <!-- ACHIEVEMENTS -->
      ${profile.achievements.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <div style="font-size: 16px; font-weight: 700; color: #f1f5f9; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid rgba(167, 139, 250, 0.15);">
          Logros Desbloqueados (${profile.achievements.length})
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${profile.achievements.map(a => `
          <span style="padding: 6px 14px; border-radius: 20px; font-size: 12px; background: rgba(167, 139, 250, 0.1); color: #a78bfa; border: 1px solid rgba(167, 139, 250, 0.2);">
            ${a.icon} ${a.name}
          </span>
          `).join("")}
        </div>
      </div>
      ` : ""}

      <!-- FOOTER -->
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(167, 139, 250, 0.15); display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#a78bfa" fill-opacity="0.3"/>
          </svg>
          <span style="font-size: 13px; font-weight: 700; background: linear-gradient(135deg, #a78bfa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PipeFit</span>
        </div>
        <div style="font-size: 11px; color: #8b8fa3;">
          Powered by Next.js · TypeScript · Tailwind CSS
        </div>
      </div>
    </div>
  `

  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#0a0a12",
      logging: false,
      width: 800,
      useCORS: true,
    })

    const imgData = canvas.toDataURL("image/jpeg", 0.95)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    })

    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width / 2, canvas.height / 2, undefined, "FAST")
    pdf.save(`pipefit-export-${new Date().toISOString().split("T")[0]}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}
