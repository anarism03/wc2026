'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoriteKind = 'match' | 'team'

interface FavoritesState {
  matchIds: number[]
  teamIds: number[]
  add: (kind: FavoriteKind, id: number) => void
  remove: (kind: FavoriteKind, id: number) => void
  toggle: (kind: FavoriteKind, id: number) => void
  has: (kind: FavoriteKind, id: number) => boolean
}

interface PersistedFavorites {
  matchIds: number[]
  teamIds: number[]
}

const normalizeState = (state: unknown): PersistedFavorites => {
  if (Array.isArray(state)) {
    return { matchIds: state, teamIds: [] }
  }

  if (state && typeof state === 'object') {
    const value = state as Partial<PersistedFavorites> & { ids?: number[] }
    return {
      matchIds: Array.isArray(value.matchIds) ? value.matchIds : Array.isArray(value.ids) ? value.ids : [],
      teamIds: Array.isArray(value.teamIds) ? value.teamIds : [],
    }
  }

  return { matchIds: [], teamIds: [] }
}

function updateIds(ids: number[], id: number, shouldAdd: boolean) {
  if (shouldAdd) return ids.includes(id) ? ids : [...ids, id]
  return ids.filter((value) => value !== id)
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      matchIds: [],
      teamIds: [],
      add: (kind, id) =>
        set((state) =>
          kind === 'match'
            ? { matchIds: updateIds(state.matchIds, id, true) }
            : { teamIds: updateIds(state.teamIds, id, true) }
        ),
      remove: (kind, id) =>
        set((state) =>
          kind === 'match'
            ? { matchIds: updateIds(state.matchIds, id, false) }
            : { teamIds: updateIds(state.teamIds, id, false) }
        ),
      toggle: (kind, id) => {
        if (get().has(kind, id)) get().remove(kind, id)
        else get().add(kind, id)
      },
      has: (kind, id) => (kind === 'match' ? get().matchIds.includes(id) : get().teamIds.includes(id)),
    }),
    {
      name: 'wc2026-favorites',
      skipHydration: true,
      version: 2,
      migrate: (state) => normalizeState(state),
      partialize: (state) => ({ matchIds: state.matchIds, teamIds: state.teamIds }),
    }
  )
)
