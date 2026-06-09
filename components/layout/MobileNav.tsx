'use client'

import {
  BarChartOutlined,
  CalendarOutlined,
  HeartOutlined,
  HomeOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import Link from '@/src/shims/Link'
import { usePathname } from '@/src/shims/navigation'

const BOTTOM_NAV = [
  { href: '/', label: 'Ana', icon: HomeOutlined },
  { href: '/live', label: 'Canlı', icon: WifiOutlined },
  { href: '/fixtures', label: 'Oyunlar', icon: CalendarOutlined },
  { href: '/groups', label: 'Qruplar', icon: BarChartOutlined },
  { href: '/favorites', label: 'Sevimli', icon: HeartOutlined },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'color-mix(in srgb, var(--bg-card) 94%, transparent)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {BOTTOM_NAV.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-lg px-2 no-underline transition-all"
              style={{
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                background: isActive ? 'color-mix(in srgb, var(--primary) 18%, transparent)' : 'transparent',
              }}
            >
              <Icon aria-hidden="true" />
              <span className="text-[11px] font-semibold">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
