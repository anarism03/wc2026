'use client'

import { useMemo } from 'react'
import { Button, Col, Row } from 'antd'
import {
  ApiOutlined,
  BarChartOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  GlobalOutlined,
  RightOutlined,
  TeamOutlined,
  TrophyOutlined,
  UsergroupAddOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import Link from '@/src/shims/Link'
import Image from '@/src/shims/Image'
import StatCard from '@/components/ui/StatCard'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import { useFixtures, usePlayers, useStadiums, useTeams } from '@/lib/hooks/useFixtures'

const QUICK_LINKS = [
  { href: '/history', label: 'Tarix və rekordlar', icon: TrophyOutlined, desc: 'Finallar, çempionlar və tarixi anlar' },
  { href: '/live', label: 'Canlı oyunlar', icon: WifiOutlined, desc: 'Aktiv statuslar və canlı skorlar' },
  { href: '/fixtures', label: 'Oyun təqvimi', icon: CalendarOutlined, desc: '104 matçın tam proqramı' },
  { href: '/groups', label: 'Qrup cədvəli', icon: BarChartOutlined, desc: '12 qrup üzrə vəziyyət' },
  { href: '/teams', label: 'Komandalar', icon: TeamOutlined, desc: '48 milli komanda və heyətlər' },
  { href: '/stadiums', label: 'Stadionlar', icon: GlobalOutlined, desc: 'ABŞ, Kanada və Meksika arenaları' },
  { href: '/stats', label: 'Statistika', icon: FieldTimeOutlined, desc: 'Heyət, qol və kart göstəriciləri' },
]

export default function HomeClient() {
  const { fixtures, source } = useFixtures()
  const { players } = usePlayers()
  const { teams } = useTeams()
  const { stadiums } = useStadiums()

  const liveCount = fixtures.filter((match) => ['LIVE', '1H', '2H', 'HT'].includes(match.status)).length
  const completedCount = fixtures.filter((match) => match.status === 'FT').length
  const visibleMatches = useMemo(() => {
    const upcoming = fixtures.filter((match) => match.status === 'NS').slice(0, 4)
    return upcoming.length ? upcoming : fixtures.slice(0, 4)
  }, [fixtures])

  return (
    <div className="min-h-screen">
      <section className="hero-poster relative min-h-[520px] overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="stadium-grid absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                style={{ background: 'color-mix(in srgb, var(--success) 18%, transparent)', color: 'var(--success)' }}
              >
                <ApiOutlined aria-hidden="true" />
                Turnir məlumatları
              </div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                style={{ background: 'color-mix(in srgb, var(--primary) 16%, transparent)', color: 'var(--text-main)' }}
              >
                Dünya Kuboku 2026
              </div>
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
              <span className="gradient-text">FIFA Dünya Kuboku</span>
              <span className="block" style={{ color: 'var(--text-main)' }}>2026</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg sm:text-xl" style={{ color: 'var(--text-muted)' }}>
              Matç təqvimi, qruplar, stadionlar, heyətlər və turnir tarixi bir məkanda.
              Yenilənən məlumatlar sadə və rahat formada təqdim olunur.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/fixtures" className="no-underline">
                <Button type="primary" size="large" icon={<CalendarOutlined />} className="font-bold">
                  Oyunlara bax
                </Button>
              </Link>
              <Link href="/history" className="no-underline">
                <Button size="large" icon={<TrophyOutlined />} style={{ background: 'var(--bg-card)', color: 'var(--text-main)', borderColor: 'var(--border)' }}>
                  Tarix və rekordlar
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_78%,transparent)] p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>Komanda</p>
                <p className="mt-2 font-display text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>{teams.length}</p>
              </div>
              <div className="rounded-[8px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_78%,transparent)] p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>Oyun</p>
                <p className="mt-2 font-display text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>{fixtures.length}</p>
              </div>
              <div className="rounded-[8px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_78%,transparent)] p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>Stadion</p>
                <p className="mt-2 font-display text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>{stadiums.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>Turnir paneli</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Əsas göstəricilər real data cache-dən oxunur.
            </p>
          </div>
          <DataSourceBadge source={source} />
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6}><StatCard label="Komanda" value={teams.length} icon={<TeamOutlined />} /></Col>
          <Col xs={12} sm={8} md={6}><StatCard label="Oyun" value={fixtures.length} icon={<CalendarOutlined />} /></Col>
          <Col xs={12} sm={8} md={6}><StatCard label="Stadion" value={stadiums.length} icon={<GlobalOutlined />} /></Col>
          <Col xs={12} sm={8} md={6}><StatCard label="Heyət oyunçusu" value={players.length} icon={<UsergroupAddOutlined />} /></Col>
        </Row>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {QUICK_LINKS.map((link, index) => {
            const Icon = link.icon
            const accent = index % 3 === 0 ? 'var(--primary)' : index % 3 === 1 ? 'var(--accent)' : 'var(--success)'

            return (
              <Link key={link.href} href={link.href} className="block h-full no-underline">
                <div className="surface-card h-full p-5 transition-all hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <span
                      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl"
                      style={{ color: accent, background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
                    >
                      <Icon aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>{link.label}</h3>
                      <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{link.desc}</p>
                    </div>
                    <RightOutlined className="ml-auto mt-1" style={{ color: 'var(--text-faint)' }} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>Növbəti oyunlar</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Turnir ritmini buradan izləmək daha rahatdır.
            </p>
          </div>
          <Link href="/fixtures" className="hidden items-center gap-2 text-sm font-bold no-underline sm:inline-flex" style={{ color: 'var(--primary)' }}>
            Hamısı <RightOutlined />
          </Link>
        </div>
        <Row gutter={[16, 16]}>
          {visibleMatches.map((match) => (
            <Col key={match.id} xs={24} md={12}>
              <Link href={`/matches/${match.id}`} className="block no-underline">
                <div className="surface-card p-5 transition-all hover:-translate-y-0.5">
                  <div className="mb-4 flex items-center justify-between gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{match.group.length === 1 ? `Qrup ${match.group}` : match.group} · {match.stadium}</span>
                    <StatusBadge status={match.status} minute={match.minute} />
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <TeamPreview name={match.teamA.name} logo={match.teamA.logo} />
                    <div className="font-display text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>
                      {match.scoreA ?? 'vs'}{match.scoreA == null ? '' : `:${match.scoreB ?? 0}`}
                    </div>
                    <TeamPreview name={match.teamB.name} logo={match.teamB.logo} align="right" />
                  </div>
                  <div className="mt-4 text-center text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {match.date} · {match.time} AZT
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </section>

      <div className="hidden">{liveCount}/{completedCount}</div>
    </div>
  )
}

function TeamPreview({ name, logo, align = 'left' }: { name: string; logo: string; align?: 'left' | 'right' }) {
  return (
    <div className={`flex items-center gap-3 ${align === 'right' ? 'justify-end text-right' : ''}`}>
      {align === 'left' && <Image src={logo} alt={name} width={36} height={36} unoptimized className="rounded object-contain" />}
      <span className="min-w-0 truncate text-sm font-bold" style={{ color: 'var(--text-main)' }}>{name}</span>
      {align === 'right' && <Image src={logo} alt={name} width={36} height={36} unoptimized className="rounded object-contain" />}
    </div>
  )
}
