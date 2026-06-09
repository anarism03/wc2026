interface PageHeaderProps {
  title: string
  subtitle?: string
  extra?: React.ReactNode
}

export default function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div className="mb-8 surface-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold gradient-text">{title}</h1>
          {subtitle && <p className="mt-2" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        {extra && <div>{extra}</div>}
      </div>
    </div>
  )
}
