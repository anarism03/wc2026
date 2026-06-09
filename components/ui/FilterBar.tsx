'use client'

import { Select } from 'antd'

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  filters: Array<{
    key: string
    placeholder: string
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
  }>
  className?: string
}

export default function FilterBar({ filters, className = '' }: FilterBarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {filters.map((f) => (
        <Select
          key={f.key}
          size="large"
          placeholder={f.placeholder}
          value={f.value || undefined}
          onChange={f.onChange}
          allowClear
          className="min-w-[150px] flex-1 sm:flex-none"
          options={f.options}
        />
      ))}
    </div>
  )
}
