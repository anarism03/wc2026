'use client'

import { useMemo, useState } from 'react'
import { Col, Progress, Row, Tabs, Tag } from 'antd'
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  CalendarOutlined,
  GlobalOutlined,
  LinkOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Image from '@/src/shims/Image'
import Link from '@/src/shims/Link'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import FavoriteButton from '@/components/ui/FavoriteButton'
import EmptyState from '@/components/ui/EmptyState'
import StatCard from '@/components/ui/StatCard'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { useFixtures, useSquadByTeam, useStandings, useTeams } from '@/lib/hooks/useFixtures'
import { getPositionLabel } from '@/lib/utils'
import type { Player, PlayerPosition } from '@/types/football'

const POS_COLORS: Record<PlayerPosition, string> = {
  GK: 'gold',
  DEF: 'blue',
  MID: 'green',
  FWD: 'red',
}

const QUAL_COLORS = {
  qualified: '#10B981',
  possible_third_place: '#F59E0B',
  eliminated: '#EF4444',
}

const QUAL_LABELS = {
  qualified: 'Keçir',
  possible_third_place: 'Şans saxlayır',
  eliminated: 'Riskli',
}

type SquadTab = 'starter' | 'reserve' | 'injured' | 'all'

interface Props {
  id: number
}

function PlayerCard({ player, index }: { player: Player; index: number }) {
  const profileUrl = player.transfermarktUrl
  const photoUrl = player.photo

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-lg p-3 no-underline transition"
      style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
    >
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full" style={{ border: '1px solid var(--border)' }}>
          <Image src={photoUrl} alt={player.name} width={56} height={56} unoptimized className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-extrabold" style={{ color: 'var(--text-main)' }}>
              {player.name}
            </span>
            <LinkOutlined className="opacity-0 transition group-hover:opacity-100" style={{ color: 'var(--primary)' }} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>#{player.shirtNumber || index + 1}</span>
            <Tag color={POS_COLORS[player.position]} className="m-0">{getPositionLabel(player.position)}</Tag>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        <div className="rounded-md px-2 py-1" style={{ background: 'var(--bg-soft)' }}>
          <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Qol</p>
          <p className="font-display text-lg font-extrabold" style={{ color: 'var(--primary)' }}>{player.goals}</p>
        </div>
        <div className="rounded-md px-2 py-1" style={{ background: 'var(--bg-soft)' }}>
          <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Ötürmə</p>
          <p className="font-display text-lg font-extrabold" style={{ color: 'var(--accent)' }}>{player.assists}</p>
        </div>
        <div className="rounded-md px-2 py-1" style={{ background: 'var(--bg-soft)' }}>
          <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Kart</p>
          <p className="font-display text-lg font-extrabold" style={{ color: 'var(--warning)' }}>{player.yellowCards + player.redCards}</p>
        </div>
        <div className="rounded-md px-2 py-1" style={{ background: 'var(--bg-soft)' }}>
          <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Reytinq</p>
          <p className="font-display text-lg font-extrabold" style={{ color: 'var(--success)' }}>{player.rating.toFixed(1)}</p>
        </div>
      </div>
    </a>
  )
}

export default function TeamDetailClient({ id }: Props) {
  const [activeTab, setActiveTab] = useState<SquadTab>('starter')
  const { teams, isLoading: teamsLoading } = useTeams()
  const { fixtures, source, isLoading: fixturesLoading } = useFixtures()
  const { standings, isLoading: standingsLoading } = useStandings()
  const { squad, isLoading: squadLoading } = useSquadByTeam(id)

  const team = useMemo(() => teams.find((item) => item.id === id), [teams, id])
  const teamMatches = useMemo(() => fixtures.filter((match) => match.teamA.id === id || match.teamB.id === id), [fixtures, id])
  const groupStandings = useMemo(
    () => standings.filter((item) => item.team.group === team?.group).sort((a, b) => b.points - a.points),
    [standings, team?.group]
  )
  const teamStanding = useMemo(() => groupStandings.find((item) => item.team.id === id), [groupStandings, id])

  if (teamsLoading || fixturesLoading || standingsLoading || squadLoading) return <LoadingSkeleton rows={5} />

  if (!team) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <EmptyState description="Komanda tapılmadı" />
        <div className="mt-4 text-center">
          <Link href="/teams" className="font-bold no-underline" style={{ color: 'var(--accent)' }}>
            Komandalar siyahısına qayıt
          </Link>
        </div>
      </div>
    )
  }

  const wins = teamMatches.filter((match) => {
    if (match.status !== 'FT') return false
    if (match.teamA.id === id) return (match.scoreA ?? 0) > (match.scoreB ?? 0)
    return (match.scoreB ?? 0) > (match.scoreA ?? 0)
  }).length

  const goals = teamMatches.reduce((sum, match) => {
    if (match.status !== 'FT') return sum
    return sum + (match.teamA.id === id ? (match.scoreA ?? 0) : (match.scoreB ?? 0))
  }, 0)

  const starters = squad.filter((player) => player.role === 'ilk11')
  const reserves = squad.filter((player) => player.role === 'ehtiyat')
  const injured: Player[] = squad.filter((player) => player.role === 'zedeli')
  const filteredPlayers =
    activeTab === 'starter' ? starters
    : activeTab === 'reserve' ? reserves
    : activeTab === 'injured' ? injured
    : squad

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/teams" className="inline-flex items-center gap-2 font-bold no-underline" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeftOutlined /> Komandalar
        </Link>
        <DataSourceBadge source={source} />
      </div>

      <div className="surface-card mb-8 overflow-hidden">
        <div className="hero-poster p-6 sm:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Image
              src={team.logo}
              alt={team.name}
              width={104}
              height={78}
              unoptimized
              className="rounded-lg object-contain"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 8 }}
            />
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Tag color="blue">Qrup {team.group}</Tag>
                {teamStanding && (
                  <Tag
                    style={{
                      background: `${QUAL_COLORS[teamStanding.qualificationStatus]}22`,
                      color: QUAL_COLORS[teamStanding.qualificationStatus],
                      borderColor: QUAL_COLORS[teamStanding.qualificationStatus],
                    }}
                  >
                    {QUAL_LABELS[teamStanding.qualificationStatus]}
                  </Tag>
                )}
                <FavoriteButton id={team.id} kind="team" />
              </div>
              <h1 className="font-display text-4xl font-extrabold sm:text-5xl" style={{ color: 'var(--hero-text-main)' }}>
                {team.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold" style={{ color: 'var(--hero-text-muted)' }}>
                <span className="inline-flex items-center gap-2"><GlobalOutlined /> {team.country}</span>
                <span className="inline-flex items-center gap-2"><UserOutlined /> Məşqçi: <strong style={{ color: 'var(--hero-text-main)' }}>{team.coach}</strong></span>
                {teamStanding && (
                  <span className="inline-flex items-center gap-2">
                    <BarChartOutlined /> {teamStanding.rank}. yer · <strong style={{ color: 'var(--hero-text-main)' }}>{teamStanding.points} xal</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={12} sm={6}><StatCard label="Oyun" value={teamMatches.filter((match) => match.status === 'FT').length} icon={<CalendarOutlined />} /></Col>
        <Col xs={12} sm={6}><StatCard label="Qələbə" value={wins} icon={<TrophyOutlined />} /></Col>
        <Col xs={12} sm={6}><StatCard label="Qol" value={goals} icon={<BarChartOutlined />} /></Col>
        <Col xs={12} sm={6}><StatCard label="Heyət" value={squad.length} icon={<TeamOutlined />} /></Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="surface-card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Heyət</h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  Təxmini start heyəti, ehtiyat oyunçular və oyunçu statistikaları.
                </p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: 'var(--bg-soft)', color: 'var(--text-main)' }}>
                {squad.length} oyunçu
              </span>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as SquadTab)}
              items={[
                { key: 'starter', label: `İlk 11 (${starters.length})` },
                { key: 'reserve', label: `Ehtiyat oyunçular (${reserves.length})` },
                { key: 'injured', label: `Zədəlilər (${injured.length})` },
                { key: 'all', label: `Hamısı (${squad.length})` },
              ]}
            />

            {filteredPlayers.length === 0 ? (
              <EmptyState
                description={
                  activeTab === 'injured'
                    ? 'Açıq zədə qeydiyyatı yoxdur'
                    : 'Mənbə (worldcup26.ir) hələ bu komandanın heyət siyahısını dərc etməyib — turnir yaxınlaşdıqca əlavə olunacaq'
                }
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPlayers.map((player, index) => (
                  <PlayerCard key={player.id} player={player} index={index} />
                ))}
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="surface-card mb-6 p-5">
            <h2 className="font-display mb-4 text-xl font-bold" style={{ color: 'var(--text-main)' }}>Qrup {team.group}</h2>
            <div className="space-y-2">
              {groupStandings.map((standing) => (
                <Link key={standing.team.id} href={`/teams/${standing.team.id}`} className="block no-underline">
                  <div
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{
                      background: standing.team.id === id ? 'color-mix(in srgb, var(--primary) 16%, transparent)' : 'transparent',
                      border: standing.team.id === id ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                    }}
                  >
                    <span className="font-bold" style={{ color: QUAL_COLORS[standing.qualificationStatus] }}>{standing.rank}</span>
                    <Image src={standing.team.flag} alt={standing.team.name} width={22} height={15} unoptimized />
                    <span className="flex-1 truncate text-sm font-bold" style={{ color: 'var(--text-main)' }}>{standing.team.name}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{standing.points} xal</span>
                  </div>
                </Link>
              ))}
            </div>

            {teamStanding && (
              <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="mb-2 flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>Vurdu / Yedi</span>
                  <span>{teamStanding.goalsFor} / {teamStanding.goalsAgainst}</span>
                </div>
                <Progress
                  percent={Math.round((teamStanding.goalsFor / Math.max(teamStanding.goalsFor + teamStanding.goalsAgainst, 1)) * 100)}
                  strokeColor="var(--success)"
                  trailColor="var(--danger)"
                  showInfo={false}
                />
              </div>
            )}
          </div>

          <div className="surface-card p-5">
            <h2 className="font-display mb-4 text-xl font-bold" style={{ color: 'var(--text-main)' }}>Oyunlar</h2>
            <div className="space-y-3">
              {teamMatches.length === 0 ? (
                <EmptyState description="Oyun tapılmadı" />
              ) : (
                teamMatches.map((match) => {
                  const isHome = match.teamA.id === id
                  const opponent = isHome ? match.teamB : match.teamA
                  return (
                    <Link key={match.id} href={`/matches/${match.id}`} className="block no-underline">
                      <div className="rounded-lg p-3" style={{ border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <Image src={opponent.flag} alt={opponent.name} width={24} height={16} unoptimized />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold" style={{ color: 'var(--text-main)' }}>{opponent.name}</div>
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{match.date} · {match.time}</div>
                          </div>
                          <StatusBadge status={match.status} minute={match.minute} />
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          <div className="surface-card mt-6 p-5">
            <h2 className="font-display mb-3 flex items-center gap-2 text-xl font-bold" style={{ color: 'var(--text-main)' }}>
              <SafetyCertificateOutlined /> Heyət bölgüsü
            </h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg p-3" style={{ background: 'var(--bg-soft)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>İlk 11</p>
                <p className="font-display text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>{starters.length}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'var(--bg-soft)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Ehtiyat</p>
                <p className="font-display text-2xl font-extrabold" style={{ color: 'var(--accent)' }}>{reserves.length}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'var(--bg-soft)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Zədə</p>
                <p className="font-display text-2xl font-extrabold" style={{ color: 'var(--danger)' }}>{injured.length}</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
