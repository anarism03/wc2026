const FAVORITES_KEY = 'wc2026_favorites'

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (!stored) return []
    return JSON.parse(stored) as number[]
  } catch {
    return []
  }
}

export function addFavorite(id: number): void {
  if (typeof window === 'undefined') return
  const favorites = getFavorites()
  if (!favorites.includes(id)) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, id]))
  }
}

export function removeFavorite(id: number): void {
  if (typeof window === 'undefined') return
  const favorites = getFavorites()
  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites.filter((f) => f !== id))
  )
}

export function isFavorite(id: number): boolean {
  return getFavorites().includes(id)
}

export function toggleFavorite(id: number): boolean {
  if (isFavorite(id)) {
    removeFavorite(id)
    return false
  }
  addFavorite(id)
  return true
}
