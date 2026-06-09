'use client'

import { Badge, Col, Row } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import Link from '@/src/shims/Link'
import Image from '@/src/shims/Image'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { useFixtures, useLiveMatches } from '@/lib/hooks/useFixtures'
import type { Match } from '@/types/football'

export default function LiveClient() {
  const { matches: liveMatches, isLoading: liveLoading, refresh } = useLiveMatches()
  const { fixtures } = useFixtures()
  const upcoming = fixtures.filter((match) => match.status === 'NS').slice(0, 6)

  if (liveLoading) return <LoadingSkeleton rows={4} />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Canlı oyunlar"
        subtitle="Canlı skorlar, oyun statusları və yaxınlaşan matçlar."
        extra={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => void refresh()}
              className="rounded-lg p-1.5 transition-colors"
              title="Yenilə"
              style={{ color: 'var(--text-muted)' }}
            >
              <ReloadOutlined spin={liveLoading} />
            </button>
          </div>
        }
      />

      {liveMatches.length === 0 ? (
        <EmptyState description="Hal-hazırda canlı oyun yoxdur" />
      ) : (
        <Row gutter={[16, 16]}>
          {liveMatches.map((match) => (
            <Col key={match.id} xs={24} md={12} lg={8}>
              <LiveMatchCard match={match} />
            </Col>
          ))}
        </Row>
      )}

      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold" style={{ color: 'var(--text-main)' }}>
          Gözlənilən oyunlar
        </h2>
        <Row gutter={[16, 16]}>
          {upcoming.map((match) => (
            <Col key={match.id} xs={24} md={12} lg={8}>
              <Link href={`/matches/${match.id}`} className="block no-underline">
                <div className="glass-card p-4 transition-all hover:border-primary">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Qrup {match.group}</span>
                    <StatusBadge status={match.status} />
                  </div>
                  <MatchTeamsRow match={match} />
                  <div className="mt-2 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    {match.date} · {match.time} AZT · {match.stadium}
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

function LiveMatchCard({ match }: { match: Match }) {
  return (
    <Link href={`/matches/${match.id}`} className="block no-underline">
      <div
        className="glass-card live-ring p-5 transition-all hover:scale-[1.02]"
        style={{ border: '1px solid rgba(239,68,68,0.4)' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <Badge dot color="red">
            <span className="text-xs font-semibold" style={{ color: '#EF4444' }}>
              CANLI
            </span>
          </Badge>
          <StatusBadge status={match.status} minute={match.minute} />
        </div>
        <MatchTeamsRow match={match} showScore />
        <div className="mt-3 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          {match.stadium} · Qrup {match.group}
        </div>
      </div>
    </Link>
  )
}

function MatchTeamsRow({ match, showScore = false }: { match: Match; showScore?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Image src={match.teamA.flag} alt={match.teamA.name} width={24} height={16} unoptimized className="object-cover" />
        <span className="truncate text-sm font-medium" style={{ color: 'var(--text-main)' }}>
          {match.teamA.name}
        </span>
      </div>
      <div className="mx-2 font-display text-xl font-bold" style={{ color: showScore ? 'var(--primary)' : 'var(--text-muted)' }}>
        {showScore ? `${match.scoreA ?? 0} : ${match.scoreB ?? 0}` : 'vs'}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <span className="truncate text-right text-sm font-medium" style={{ color: 'var(--text-main)' }}>
          {match.teamB.name}
        </span>
        <Image src={match.teamB.flag} alt={match.teamB.name} width={24} height={16} unoptimized className="object-cover" />
      </div>
    </div>
  )
}
