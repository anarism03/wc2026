import { Tag } from 'antd'
import type { MatchStatus } from '@/types/football'
import { getStatusLabel } from '@/lib/utils'

interface StatusBadgeProps {
  status: MatchStatus
  minute?: number | null
}

const STATUS_COLORS: Record<MatchStatus, string> = {
  NS: 'default',
  LIVE: 'red',
  HT: 'orange',
  FT: 'default',
  '1H': 'red',
  '2H': 'red',
  ET: 'volcano',
  PEN: 'magenta',
}

export default function StatusBadge({ status, minute }: StatusBadgeProps) {
  const isLive = ['LIVE', '1H', '2H', 'ET', 'PEN'].includes(status)
  const label = isLive && minute != null ? `${getStatusLabel(status)} ${minute}'` : getStatusLabel(status)

  return (
    <Tag
      color={STATUS_COLORS[status]}
      className={isLive ? 'animate-pulse' : ''}
      style={isLive ? { fontWeight: 600 } : {}}
    >
      {isLive && '● '}{label}
    </Tag>
  )
}
