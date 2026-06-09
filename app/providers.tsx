'use client'

import { ConfigProvider, theme } from 'antd'
import { SWRConfig } from 'swr'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { swrConfig } from '@/lib/swr'
import { useUiStore } from '@/lib/store/uiStore'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const themeMode = useUiStore((state) => state.themeMode)
  const isDark = themeMode === 'dark'

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#F4B740' : '#B56A00',
          colorBgBase: isDark ? '#07111F' : '#F5F0E6',
          colorBgContainer: isDark ? '#111B2E' : '#FFFDF7',
          colorBgElevated: isDark ? '#111B2E' : '#FFFDF7',
          colorBgLayout: isDark ? '#07111F' : '#F5F0E6',
          colorFillSecondary: isDark ? '#17243A' : '#EFE5D1',
          colorBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(29,42,68,0.16)',
          colorText: isDark ? '#F8FAFC' : '#111827',
          colorTextSecondary: isDark ? '#A9B7CB' : '#596579',
          colorTextTertiary: isDark ? '#718199' : '#7C8798',
          borderRadius: 8,
          fontFamily: "'Manrope', system-ui, sans-serif",
        },
      }}
    >
      <SWRConfig value={swrConfig}>
        {children}
      </SWRConfig>
    </ConfigProvider>
  )
}
