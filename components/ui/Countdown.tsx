'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: string
  label?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown({ targetDate, label = 'Turnirə qalan vaxt' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const units = [
    { value: timeLeft.days, label: 'Gün' },
    { value: timeLeft.hours, label: 'Saat' },
    { value: timeLeft.minutes, label: 'Dəqiqə' },
    { value: timeLeft.seconds, label: 'Saniyə' },
  ]

  return (
    <div className="text-center">
      {label && <p className="text-text-muted text-sm mb-3">{label}</p>}
      <div className="flex items-center justify-center gap-3">
        {units.map((u) => (
          <div key={u.label} className="glass-card px-4 py-3 min-w-[64px]">
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              {String(u.value).padStart(2, '0')}
            </div>
            <div className="text-xs text-text-muted mt-1">{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
