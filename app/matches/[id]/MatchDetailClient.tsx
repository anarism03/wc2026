'use client'

import { Col, Progress, Row, Spin, Tag, Timeline } from 'antd'
import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  RetweetOutlined,
  TrophyOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import Image from '@/src/shims/Image'
import Link from '@/src/shims/Link'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import FavoriteButton from '@/components/ui/FavoriteButton'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { useHeadToHead, useMatchById, useMatchCommentary, useMatchEvents, useMatchStats, useMatchLineups } from '@/lib/hooks/useFixtures'
import { labels } from '@/lib/labels'
import type { CommentaryItem, HeadToHead, HeadToHeadMatch, LineupTeam } from '@/types/football'

interface Props { id: number }

const EVENT_ICONS: Record<string, React.ReactNode> = {
  goal: <TrophyOutlined />,
  yellow_card: <WarningOutlined />,
  red_card: <CloseCircleOutlined />,
  substitution: <RetweetOutlined />,
  penalty_missed: <CloseCircleOutlined />,
}

const DEFAULT_STATS = {
  possession: 50, shots: 0, shotsOnTarget: 0,
  corners: 0, fouls: 0, yellowCards: 0, redCards: 0,
}

export default function MatchDetailClient({ id }: Props) {
  const { match, source, isLoading } = useMatchById(id)
  const { events, isLoading: eventsLoading } = useMatchEvents(match ? id : null)
  const { commentary, isLoading: commentaryLoading } = useMatchCommentary(match ? id : null)
  const { headToHead, isLoading: headToHeadLoading } = useHeadToHead(match ? id : null)
  const { stats, isLoading: statsLoading } = useMatchStats(match && match.status !== 'NS' ? id : null)
  const { lineups, isLoading: lineupsLoading } = useMatchLineups(match ? id : null)

  if (isLoading) return <LoadingSkeleton rows={5} />

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState description="Oyun tapılmadı" />
        <div className="text-center mt-4">
          <Link href="/fixtures" className="font-bold no-underline" style={{ color: 'var(--accent)' }}>
            Oyun cədvəlinə qayıt
          </Link>
        </div>
      </div>
    )
  }

  const tA = stats?.teamA ?? DEFAULT_STATS
  const tB = stats?.teamB ?? DEFAULT_STATS

  const statRows = [
    { key: 'possession', labelA: `${tA.possession}%`, labelB: `${tB.possession}%`, label: 'Topa nəzarət' },
    { key: 'shots', labelA: tA.shots, labelB: tB.shots, label: 'Zərbə' },
    { key: 'shotsOnTarget', labelA: tA.shotsOnTarget, labelB: tB.shotsOnTarget, label: 'Dəqiq zərbə' },
    { key: 'corners', labelA: tA.corners, labelB: tB.corners, label: 'Künc vuruşu' },
    { key: 'fouls', labelA: tA.fouls, labelB: tB.fouls, label: 'Qaydabozma' },
    { key: 'yc', labelA: tA.yellowCards, labelB: tB.yellowCards, label: labels.yellowCards },
    { key: 'rc', labelA: tA.redCards, labelB: tB.redCards, label: labels.redCards },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/fixtures" className="inline-flex items-center gap-2 font-bold no-underline" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeftOutlined /> Geri
        </Link>
        <DataSourceBadge source={source} />
      </div>

      <div className="surface-card hero-poster p-6 mb-6 text-center">
        <div className="mb-6 flex items-center justify-between">
          <Tag color="blue">Qrup {match.group}</Tag>
          <StatusBadge status={match.status} minute={match.minute} />
          <FavoriteButton id={match.id} kind="match" />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
          <TeamBlock id={match.teamA.id} name={match.teamA.name} logo={match.teamA.logo} />
          <div>
            <div className="font-display text-4xl sm:text-6xl font-extrabold" style={{ color: 'var(--primary)' }}>
              {match.scoreA != null ? `${match.scoreA} : ${match.scoreB}` : 'vs'}
            </div>
            <div className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{match.date} · {match.time}</div>
          </div>
          <TeamBlock id={match.teamB.id} name={match.teamB.name} logo={match.teamB.logo} />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          {match.stadium && <span className="inline-flex items-center gap-2"><EnvironmentOutlined /> {match.stadium}</span>}
          {match.referee && <span className="inline-flex items-center gap-2"><UserOutlined /> {match.referee}</span>}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={14}>
          <div className="surface-card p-5 h-full">
            <h3 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Oyun Statistikası</h3>
            {statsLoading ? (
              <div className="flex justify-center py-4"><Spin /></div>
            ) : match.status === 'NS' ? (
              <p className="text-center text-sm py-6" style={{ color: 'var(--text-muted)' }}>
                Oyun başlayandan sonra statistika burada görünəcək.
              </p>
            ) : (
              <div className="space-y-4">
                {statRows.map((row) => {
                  const aNum = parseInt(String(row.labelA), 10) || 0
                  const bNum = parseInt(String(row.labelB), 10) || 0
                  const total = aNum + bNum || 1
                  const pct = Math.round((aNum / total) * 100)
                  return (
                    <div key={row.key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'var(--primary)' }}>{row.labelA}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                        <span style={{ color: 'var(--accent)' }}>{row.labelB}</span>
                      </div>
                      <Progress percent={pct} showInfo={false} strokeColor="var(--primary)" trailColor="var(--accent)" size="small" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} md={10}>
          <div className="surface-card p-5 h-full">
            <h3 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Oyun Hadisələri</h3>
            {eventsLoading ? (
              <div className="flex justify-center py-4"><Spin /></div>
            ) : events.length === 0 ? (
              <EmptyState description={match.status === 'NS' ? 'Oyun hələ başlamayıb' : 'Hadisə məlumatı yoxdur'} />
            ) : (
              <Timeline
                items={events.map((e, i) => ({
                  key: i,
                  dot: <span style={{ color: 'var(--primary)' }}>{EVENT_ICONS[e.type] ?? <TrophyOutlined />}</span>,
                  children: (
                    <div>
                      <span className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                        {e.minute}&apos; - {e.player}
                      </span>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {e.team}{e.assist ? ` (${e.assist})` : ''}
                      </div>
                    </div>
                  ),
                }))}
              />
            )}
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <div className="surface-card h-full p-5">
            <h3 className="font-display mb-4 text-xl font-bold" style={{ color: 'var(--text-main)' }}>Oyun axını</h3>
            {commentaryLoading ? (
              <div className="flex justify-center py-4"><Spin /></div>
            ) : commentary.length === 0 ? (
              <EmptyState description={match.status === 'NS' ? 'Canlı şərh oyun başlayandan sonra gələcək' : 'Şərh məlumatı yoxdur'} />
            ) : (
              <Timeline
                items={commentary.slice(0, 12).map((item, index) => ({
                  key: `${item.minute ?? 'm'}-${index}`,
                  dot: <span style={{ color: 'var(--accent)' }}>{item.minute != null ? `${item.minute}'` : '•'}</span>,
                  children: <CommentaryRow item={item} />,
                }))}
              />
            )}
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="surface-card h-full p-5">
            <h3 className="font-display mb-4 text-xl font-bold" style={{ color: 'var(--text-main)' }}>Komanda müqayisəsi</h3>
            {headToHeadLoading ? (
              <div className="flex justify-center py-4"><Spin /></div>
            ) : !headToHead ? (
              <EmptyState description="Head-to-head məlumatı yoxdur" />
            ) : (
              <HeadToHeadBlock data={headToHead} />
            )}
          </div>
        </Col>
      </Row>

      <div className="surface-card p-5 mt-4">
        <h3 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Tərkiblər</h3>
        {lineupsLoading ? (
          <div className="flex justify-center py-4"><Spin /></div>
        ) : !lineups ? (
          <EmptyState description={match.status === 'NS' ? 'Tərkiblər oyundan əvvəl açıqlanacaq' : 'Tərkib məlumatı yoxdur'} />
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <LineupTeamBlock lineup={lineups.teamA} />
            </Col>
            <Col xs={24} md={12}>
              <LineupTeamBlock lineup={lineups.teamB} />
            </Col>
          </Row>
        )}
      </div>
    </div>
  )
}

function LineupTeamBlock({ lineup }: { lineup: LineupTeam }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-bold" style={{ color: 'var(--text-main)' }}>{lineup.team}</span>
        {lineup.formation && <Tag color="geekblue">{lineup.formation}</Tag>}
      </div>
      <div className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>Məşqçi: {lineup.coach}</div>

      <div className="mb-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--primary)' }}>İlk 11</div>
        <ul className="space-y-1.5">
          {lineup.startingXI.map((player) => (
            <li key={`${player.id}-${player.name}`} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-main)' }}>
              <span
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                {player.shirtNumber || '–'}
              </span>
              <span>{player.name}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{player.position}</span>
            </li>
          ))}
        </ul>
      </div>

      {lineup.substitutes.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>Ehtiyatlar</div>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {lineup.substitutes.map((player) => (
              <li key={`${player.id}-${player.name}`} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {player.shirtNumber ? `${player.shirtNumber}. ` : ''}{player.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function CommentaryRow({ item }: { item: CommentaryItem }) {
  return (
    <div>
      <div className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
        {item.text}
      </div>
      {(item.team || item.player || item.type) && (
        <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          {[item.team, item.player, item.type].filter(Boolean).join(' · ')}
        </div>
      )}
    </div>
  )
}

function HeadToHeadBlock({ data }: { data: HeadToHead }) {
  const team1 = data.team1
  const team2 = data.team2
  const h2hRows = data.h2h ?? []
  const team1Rows = data.team1_last_6 ?? []
  const team2Rows = data.team2_last_6 ?? []

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <TeamFormCard name={team1?.name ?? 'Komanda 1'} form={team1?.overall_form ?? []} />
        <TeamFormCard name={team2?.name ?? 'Komanda 2'} form={team2?.overall_form ?? []} />
      </div>

      {h2hRows.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
            Öz aralarında son oyunlar
          </div>
          <div className="space-y-2">
            {h2hRows.slice(0, 4).map((row, index) => (
              <HeadToHeadMatchRow key={`${row.id ?? index}`} row={row} />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <RecentMatches title={`${team1?.name ?? 'Komanda 1'} forması`} rows={team1Rows} />
        <RecentMatches title={`${team2?.name ?? 'Komanda 2'} forması`} rows={team2Rows} />
      </div>
    </div>
  )
}

function TeamFormCard({ name, form }: { name: string; form: string[] }) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
      <div className="truncate text-sm font-bold" style={{ color: 'var(--text-main)' }}>{name}</div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {form.length === 0 ? (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Forma yoxdur</span>
        ) : form.slice(0, 6).map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: item === 'W' ? 'var(--success)' : item === 'L' ? 'var(--danger)' : 'var(--warning)',
              color: '#fff',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function RecentMatches({ title, rows }: { title: string; rows: HeadToHeadMatch[] }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
        {title}
      </div>
      <div className="space-y-2">
        {rows.length === 0 ? (
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Məlumat yoxdur</div>
        ) : rows.slice(0, 3).map((row, index) => (
          <HeadToHeadMatchRow key={`${row.id ?? index}`} row={row} compact />
        ))}
      </div>
    </div>
  )
}

function HeadToHeadMatchRow({ row, compact = false }: { row: HeadToHeadMatch; compact?: boolean }) {
  return (
    <div className="rounded-lg border p-2.5" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>{row.date ?? 'Tarix yoxdur'}</span>
        <span className="font-display text-sm font-bold" style={{ color: 'var(--primary)' }}>{row.score ?? 'vs'}</span>
      </div>
      <div className={`mt-1 ${compact ? 'text-xs' : 'text-sm'} font-semibold`} style={{ color: 'var(--text-main)' }}>
        {row.home_name ?? 'Ev sahibi'} - {row.away_name ?? 'Qonaq'}
      </div>
      {row.location && (
        <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{row.location}</div>
      )}
    </div>
  )
}

function TeamBlock({ id, name, logo }: { id: number; name: string; logo: string }) {
  return (
    <Link href={`/teams/${id}`} className="focus-ring flex flex-col items-center gap-3 rounded-lg p-2 no-underline transition-transform hover:-translate-y-0.5">
      <Image src={logo} alt={name} width={64} height={64} unoptimized className="object-contain rounded" />
      <span className="max-w-[120px] text-center text-sm font-bold" style={{ color: 'var(--text-main)' }}>
        {name}
      </span>
    </Link>
  )
}
