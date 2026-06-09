'use client'

import { useState } from 'react'
import { Button, Drawer, Tooltip } from 'antd'
import {
  BarChartOutlined,
  CalendarOutlined,
  CloseOutlined,
  HeartOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
  TeamOutlined,
  TrophyOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import Link from '@/src/shims/Link'
import Image from '@/src/shims/Image'
import { usePathname } from '@/src/shims/navigation'
import { useUiStore } from '@/lib/store/uiStore'

const NAV_LINKS = [
  { href: '/', label: 'Ana səhifə', icon: HomeOutlined },
  { href: '/history', label: 'Tarix', icon: TrophyOutlined },
  { href: '/live', label: 'Canlı', icon: WifiOutlined },
  { href: '/fixtures', label: 'Oyunlar', icon: CalendarOutlined },
  { href: '/groups', label: 'Qruplar', icon: BarChartOutlined },
  { href: '/teams', label: 'Komandalar', icon: TeamOutlined },
  { href: '/stadiums', label: 'Stadionlar', icon: EnvironmentOutlined },
  { href: '/stats', label: 'Statistika', icon: BarChartOutlined },
  { href: '/favorites', label: 'Sevimlilər', icon: HeartOutlined },
]

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex min-w-0 items-center gap-2 rounded-xl border px-2 py-1 sm:gap-2.5 sm:px-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:h-9 sm:w-9"
        style={{
          background: 'color-mix(in srgb, var(--primary) 18%, var(--bg-card))',
          border: '1px solid var(--border-strong)',
        }}
      >
        <Image
          src="/images/wc2026-logo.svg"
          alt="WC 2026"
          width={72}
          height={72}
          unoptimized
          className="h-7 w-7 object-contain sm:h-8 sm:w-8"
        />
      </span>
      <span className={compact ? 'block min-w-0' : 'hidden min-w-0 sm:block'}>
        <span className="block whitespace-nowrap font-display text-base font-extrabold leading-tight sm:text-lg" style={{ color: 'var(--text-main)' }}>
          WC 2026
        </span>
        <span className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] leading-tight" style={{ color: 'var(--text-muted)' }}>
          Match Center
        </span>
      </span>
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const themeMode = useUiStore((state) => state.themeMode)
  const toggleThemeMode = useUiStore((state) => state.toggleThemeMode)
  const ThemeIcon = themeMode === 'dark' ? SunOutlined : MoonOutlined

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'color-mix(in srgb, var(--bg-base) 90%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-2 py-1.5">
          <Link href="/" className="focus-ring min-w-0 shrink-0 rounded-xl no-underline">
            <BrandMark />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto scrollbar-hide xl:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[13px] font-semibold no-underline transition-all"
                  style={{
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                    background: isActive ? 'color-mix(in srgb, var(--primary) 15%, transparent)' : 'transparent',
                    borderColor: isActive ? 'var(--border-strong)' : 'transparent',
                  }}
                >
                  <Icon aria-hidden="true" />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Tooltip title={themeMode === 'dark' ? 'Açıq rejim' : 'Tünd rejim'}>
              <Button
                aria-label="Tema dəyiş"
                className="focus-ring"
                icon={<ThemeIcon />}
                onClick={toggleThemeMode}
                style={{ color: 'var(--text-main)', background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              />
            </Tooltip>
            <Button
              className="focus-ring xl:hidden"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              aria-label="Menyu"
              style={{ color: 'var(--text-main)', background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </div>

      <Drawer
        title={<BrandMark compact />}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        closeIcon={<CloseOutlined style={{ color: 'var(--text-muted)' }} />}
        styles={{
          body: { background: 'var(--bg-base)', padding: 0 },
          header: { background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' },
          content: { background: 'var(--bg-base)' },
        }}
        width={310}
      >
        <nav className="flex flex-col gap-2 p-4">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="focus-ring inline-flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold no-underline transition-all"
                style={{
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  background: isActive ? 'color-mix(in srgb, var(--primary) 16%, transparent)' : 'transparent',
                  border: isActive ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                }}
              >
                <Icon aria-hidden="true" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </Drawer>
    </header>
  )
}
