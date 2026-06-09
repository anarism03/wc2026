'use client'

import { create } from 'zustand'

interface FiltersState {
  group: string
  status: string
  searchQuery: string
  setGroup: (group: string) => void
  setStatus: (status: string) => void
  setSearchQuery: (q: string) => void
  reset: () => void
}

export const useFiltersStore = create<FiltersState>()((set) => ({
  group: '',
  status: '',
  searchQuery: '',
  setGroup: (group) => set({ group }),
  setStatus: (status) => set({ status }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reset: () => set({ group: '', status: '', searchQuery: '' }),
}))
