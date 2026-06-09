'use client'

import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  mobileNavOpen: boolean
  themeMode: 'dark' | 'light'
  setSidebarOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
  setThemeMode: (mode: 'dark' | 'light') => void
  toggleSidebar: () => void
  toggleMobileNav: () => void
  toggleThemeMode: () => void
}

const storedTheme =
  typeof window === 'undefined'
    ? null
    : window.localStorage.getItem('wc2026-theme')

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: false,
  mobileNavOpen: false,
  themeMode: storedTheme === 'light' ? 'light' : 'dark',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setThemeMode: (mode) => {
    window.localStorage.setItem('wc2026-theme', mode)
    set({ themeMode: mode })
  },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  toggleThemeMode: () => set((s) => {
    const next = s.themeMode === 'dark' ? 'light' : 'dark'
    window.localStorage.setItem('wc2026-theme', next)
    return { themeMode: next }
  }),
}))
