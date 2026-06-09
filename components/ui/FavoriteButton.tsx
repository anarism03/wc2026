'use client'

import { useEffect, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { useFavoritesStore } from '@/lib/store/favoritesStore'

interface FavoriteButtonProps {
  id: number
  kind?: 'match' | 'team'
  size?: 'small' | 'middle' | 'large'
}

export default function FavoriteButton({ id, kind = 'match', size = 'middle' }: FavoriteButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { has, toggle } = useFavoritesStore()

  useEffect(() => {
    useFavoritesStore.persist.rehydrate()
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isFav = has(kind, id)

  return (
    <Tooltip title={isFav ? 'Sevimlilərdən çıxar' : 'Sevimlilərə əlavə et'}>
      <Button
        type="text"
        size={size}
        icon={isFav ? <StarFilled style={{ color: 'var(--primary)' }} /> : <StarOutlined style={{ color: 'var(--text-muted)' }} />}
        onClick={() => toggle(kind, id)}
      />
    </Tooltip>
  )
}
