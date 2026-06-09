'use client'

import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({ value, onChange, placeholder = 'Axtar...', className }: SearchInputProps) {
  return (
    <Input
      size="large"
      className={className}
      prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      allowClear
      style={{ width: '100%' }}
    />
  )
}
