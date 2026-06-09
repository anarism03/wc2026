'use client'

import { useEffect, useMemo, useState } from 'react'
import { Col, Row, Tag } from 'antd'
import { CalendarOutlined, TeamOutlined } from '@ant-design/icons'
import Link from '@/src/shims/Link'
import Image from '@/src/shims/Image'
import PageHeader from '@/components/layout/PageHeader'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import EmptyState from '@/components/ui/EmptyState'
import FavoriteButton from '@/components/ui/FavoriteButton'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import { useFixtures, useTeams } from '@/lib/hooks/useFixtures'
import type { Match, Team } from '@/types/football'

export default function FavoritesClient() {
  const [mounted, setMounted] = useState(false)
  const { matchIds, teamIds } = useFavoritesStore()
  const { fixtures, source } = useFixtures()
  const { teams } = useTeams()

  useEffect(() => {
    useFavoritesStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const favoriteMatches = useMemo(
    () => fixtures.filter((match) => matchIds.includes(match.id)),
    [fixtures, matchIds]
  )

  const favoriteTeams = useMemo(
    () => teams.filter((team) => teamIds.includes(team.id)),
    [teams, teamIds]
  )

  const teamSections = useMemo(
    () =>
      favoriteTeams.map((team) => ({
        team,
        matches: fixtures
          .filter((match) => match.teamA.id === team.id || match.teamB.id === team.id)
          .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
      })),
    [favoriteTeams, fixtures]
  )

  if (!mounted) return <LoadingSkeleton rows={4} />

  const hasAnyFavorite = favoriteMatches.length > 0 || favoriteTeams.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Sevimlilər"
        subtitle={`${favoriteMatches.length} oyun · ${favoriteTeams.length} komanda`}
        extra={<DataSourceBadge source={source} />}
      />

      {!hasAnyFavorite ? (
        <div className="surface-card p-8">
          <EmptyState description="Hələ heç nə sevimli edilməyib" />
          <div className="mt-4 text-center">
            <Link href="/fixtures" className="text-sm font-bold no-underline" style={{ color: 'var(--accent)' }}>
              Oyun cədvəlinə get
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {favoriteMatches.length > 0 && (
            <section>
              <SectionTitle icon={<CalendarOutlined />} title="Sevimli oyunlar" subtitle="Yalnız seçdiyin oyunlar burada görünür." />
              <Row gutter={[16, 16]}>
                {favoriteMatches.map((match) => (
                  <Col key={match.id} xs={24} sm={12} lg={8}>
                    <MatchCard match={match} />
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {teamSections.length > 0 && (
            <section>
              <SectionTitle icon={<TeamOutlined />} title="Sevimli komandalar" subtitle="Komandanı sevimli etdikdə ona aid bütün gələcək və oynanılmış oyunlar görünür." />
              <div className="space-y-5">
                {teamSections.map(({ team, matches }) => (
                  <TeamSection key={team.id} team={team} matches={matches} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'color-mix(in srgb, var(--primary) 16%, transparent)', color: 'var(--primary)' }}>
        {icon}
      </span>
      <div>
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{title}</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
      </div>
    </div>
  )
}

function MatchCard({ match }: { match: Match }) {
  return (
    <Link href={`/matches/${match.id}`} className="block h-full no-underline">
      <div className="glass-card h-full p-5 transition hover:-translate-y-0.5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Qrup {match.group}</span>
          <div className="flex items-center gap-2">
            <StatusBadge status={match.status} minute={match.minute} />
            <FavoriteButton id={match.id} kind="match" />
          </div>
        </div>
        <div className="my-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <TeamMini logo={match.teamA.flag} name={match.teamA.name} />
          <span className="font-display text-xl font-extrabold" style={{ color: 'var(--primary)' }}>
            {match.scoreA != null ? `${match.scoreA} : ${match.scoreB}` : 'vs'}
          </span>
          <TeamMini logo={match.teamB.flag} name={match.teamB.name} align="right" />
        </div>
        <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          {match.date} · {match.time}
          <br />
          {match.stadium}
        </div>
      </div>
    </Link>
  )
}

function TeamSection({ team, matches }: { team: Team; matches: Match[] }) {
  const upcoming = matches.filter((match) => match.status === 'NS').length
  const completed = matches.filter((match) => match.status === 'FT').length

  return (
    <div className="surface-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Link href={`/teams/${team.id}`} className="flex items-center gap-3 no-underline">
          <Image src={team.flag} alt={team.name} width={46} height={32} unoptimized className="rounded object-cover" />
          <div>
            <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>{team.name}</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              <Tag color="blue">Qrup {team.group}</Tag>
              <Tag color="green">{upcoming} gələcək oyun</Tag>
              <Tag color="gold">{completed} oynanılmış oyun</Tag>
            </div>
          </div>
        </Link>
        <FavoriteButton id={team.id} kind="team" />
      </div>

      {matches.length === 0 ? (
        <EmptyState description="Bu komanda üçün oyun tapılmadı" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {matches.map((match) => (
            <Link key={match.id} href={`/matches/${match.id}`} className="block no-underline">
              <div className="rounded-lg p-3 transition hover:-translate-y-0.5" style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{match.date} · {match.time}</span>
                  <StatusBadge status={match.status} minute={match.minute} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <TeamMini logo={match.teamA.flag} name={match.teamA.name} />
                  <span className="font-display font-extrabold" style={{ color: 'var(--primary)' }}>
                    {match.scoreA != null ? `${match.scoreA}:${match.scoreB}` : 'vs'}
                  </span>
                  <TeamMini logo={match.teamB.flag} name={match.teamB.name} align="right" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function TeamMini({ logo, name, align = 'left' }: { logo: string; name: string; align?: 'left' | 'right' }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${align === 'right' ? 'justify-end text-right' : ''}`}>
      {align === 'left' && <Image src={logo} alt={name} width={24} height={16} unoptimized className="rounded object-cover" />}
      <span className="truncate text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{name}</span>
      {align === 'right' && <Image src={logo} alt={name} width={24} height={16} unoptimized className="rounded object-cover" />}
    </div>
  )
}
