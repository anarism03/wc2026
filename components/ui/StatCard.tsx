import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  subtext?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatCard({ label, value, icon, subtext, trend }: StatCardProps) {
  const trendColor = trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--text-muted)'

  return (
    <div
      className="glass-card h-full p-5 stagger-child"
      style={{ borderLeft: '3px solid var(--primary)', minHeight: 160 }}
    >
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex-1">
          <p className="mb-2 text-xs font-bold uppercase leading-none" style={{ color: 'var(--text-muted)' }}>
            {label}
          </p>
          <p className="font-display text-2xl font-extrabold leading-[0.98] sm:text-3xl" style={{ color: 'var(--text-main)' }}>
            {value}
          </p>
          {subtext && (
            <p className="mt-2 text-xs" style={{ color: trendColor }}>
              {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}{subtext}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl" style={{ color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 14%, transparent)' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
