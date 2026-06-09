import type { ReactNode } from 'react'
import DataSourceBadge from './DataSourceBadge'

interface ChartCardProps {
  title: string
  children: ReactNode
  source?: 'api' | 'mock' | 'cache'
  height?: number
}

export default function ChartCard({ title, children, source = 'mock', height = 300 }: ChartCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: 'var(--text-main)' }}>
          {title}
        </h3>
        <DataSourceBadge source={source} />
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  )
}
