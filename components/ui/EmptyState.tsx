import { Empty } from 'antd'

interface EmptyStateProps {
  description?: string
}

export default function EmptyState({ description = 'Açıqlanmayıb' }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <Empty description={<span style={{ color: 'var(--text-muted)' }}>{description}</span>} />
    </div>
  )
}
