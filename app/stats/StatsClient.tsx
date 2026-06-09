'use client'

import { useMemo, useState } from 'react'
import { Col, Row, Table, Tabs, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  BarChartOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  FireOutlined,
  LinkOutlined,
  TeamOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import Image from '@/src/shims/Image'
import dynamic from '@/src/shims/dynamic'
import PageHeader from '@/components/layout/PageHeader'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import StatCard from '@/components/ui/StatCard'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { useFixtures, usePlayers, useTeams } from '@/lib/hooks/useFixtures'
import { getPositionLabel } from '@/lib/utils'
import type { Player, PlayerPosition, Team } from '@/types/football'

const StatsCharts = dynamic(() => import('./StatsCharts'), {
  ssr: false,
  loading: () => <LoadingSkeleton rows={2} />,
})

const POS_COLORS: Record<PlayerPosition, string> = {
  GK: 'gold',
  DEF: 'blue',
  MID: 'green',
  FWD: 'red',
}

type StatsTab = 'all' | 'scorers' | 'assists' | 'rated' | 'cards'

function PlayerNameCell({ player, team }: { player: Player; team?: Team }) {
  return (
    <a
      href={player.transfermarktUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-[250px] items-center gap-3 no-underline"
    >
      <Image src={player.photo} alt={player.name} width={42} height={42} unoptimized className="rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-extrabold" style={{ color: 'var(--text-main)' }}>
            {player.name}
          </span>
          <LinkOutlined className="opacity-0 transition group-hover:opacity-100" style={{ color: 'var(--primary)' }} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {player.shirtNumber ? <span>#{player.shirtNumber}</span> : null}
          <Tag color={POS_COLORS[player.position]} className="m-0">{getPositionLabel(player.position)}</Tag>
          {team?.flag ? <Image src={team.flag} alt={team.name} width={18} height={12} unoptimized /> : null}
          <span>{team?.name ?? player.team}</span>
        </div>
      </div>
    </a>
  )
}

export default function StatsClient() {
  const [activeTab, setActiveTab] = useState<StatsTab>('all')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 24 })
  const { fixtures, source: fixturesSource } = useFixtures()
  const { players, source: playersSource, isLoading } = usePlayers()
  const { teams } = useTeams()

  const source = playersSource === 'api' ? playersSource : fixturesSource
  const teamMap = useMemo(() => new Map(teams.map((team) => [team.name, team])), [teams])

  const sortedPlayers = useMemo(() => ({
    all: [...players].sort((a, b) => a.team.localeCompare(b.team) || Number(a.shirtNumber ?? 99) - Number(b.shirtNumber ?? 99)),
    scorers: [...players].sort((a, b) => b.goals - a.goals || b.assists - a.assists || b.rating - a.rating),
    assists: [...players].sort((a, b) => b.assists - a.assists || b.goals - a.goals || b.rating - a.rating),
    rated: [...players].sort((a, b) => b.rating - a.rating || b.goals - a.goals || b.assists - a.assists),
    cards: [...players].sort((a, b) => (b.yellowCards + b.redCards) - (a.yellowCards + a.redCards) || b.redCards - a.redCards),
  }), [players])

  const currentData = sortedPlayers[activeTab]
  const totalGoals = fixtures.reduce((sum, match) => sum + (match.scoreA ?? 0) + (match.scoreB ?? 0), 0)
  const completedMatches = fixtures.filter((match) => match.status === 'FT').length
  const avgGoals = completedMatches > 0 ? (totalGoals / completedMatches).toFixed(2) : '0.00'
  const totalCards = players.reduce((sum, player) => sum + player.yellowCards + player.redCards, 0)

  const playerColumns: ColumnsType<Player> = [
    {
      title: '#',
      key: 'idx',
      width: 54,
      render: (_, __, index) => (
        <span className="font-bold" style={{ color: 'var(--text-muted)' }}>
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: 'Futbolçu',
      key: 'name',
      render: (_, player) => <PlayerNameCell player={player} team={teamMap.get(player.team)} />,
    },
    {
      title: 'Qol',
      dataIndex: 'goals',
      key: 'goals',
      width: 82,
      align: 'center',
      sorter: (a, b) => a.goals - b.goals,
      render: (value: number) => <strong style={{ color: 'var(--primary)' }}>{value}</strong>,
    },
    {
      title: 'Ötürmə',
      dataIndex: 'assists',
      key: 'assists',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.assists - b.assists,
      render: (value: number) => <strong style={{ color: 'var(--accent)' }}>{value}</strong>,
    },
    {
      title: 'Sarı',
      dataIndex: 'yellowCards',
      key: 'yellowCards',
      width: 78,
      align: 'center',
      responsive: ['md'],
      sorter: (a, b) => a.yellowCards - b.yellowCards,
      render: (value: number) => (value > 0 ? <Tag color="gold">{value}</Tag> : <span style={{ color: 'var(--text-faint)' }}>0</span>),
    },
    {
      title: 'Qırmızı',
      dataIndex: 'redCards',
      key: 'redCards',
      width: 90,
      align: 'center',
      responsive: ['md'],
      sorter: (a, b) => a.redCards - b.redCards,
      render: (value: number) => (value > 0 ? <Tag color="red">{value}</Tag> : <span style={{ color: 'var(--text-faint)' }}>0</span>),
    },
    {
      title: 'Reytinq',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.rating - b.rating,
      render: (value: number) => <strong style={{ color: 'var(--success)' }}>{value.toFixed(1)}</strong>,
    },
  ]

  if (isLoading) return <LoadingSkeleton rows={5} />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Statistika"
        subtitle="Bütün oyunçular, heyətlər, qol cədvəli, ötürmələr, kartlar və reytinq."
        extra={<DataSourceBadge source={source} />}
      />

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={12} md={6}>
          <StatCard label="Oyunçu" value={players.length} icon={<UserOutlined />} />
        </Col>
        <Col xs={12} md={6}>
          <StatCard label="Ümumi qol" value={totalGoals} icon={<FireOutlined />} />
        </Col>
        <Col xs={12} md={6}>
          <StatCard label="Oyun başına qol" value={avgGoals} icon={<BarChartOutlined />} />
        </Col>
        <Col xs={12} md={6}>
          <StatCard label="Kart" value={totalCards} icon={<CheckCircleOutlined />} />
        </Col>
      </Row>

      {players.length > 0 && <StatsCharts players={players} />}

      {players.length > 0 ? (
        <div className="surface-card p-4 sm:p-5">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key as StatsTab)
              setPagination((current) => ({ ...current, current: 1 }))
            }}
            items={[
              { key: 'all', label: <span className="inline-flex items-center gap-2"><UnorderedListOutlined /> Hamısı</span> },
              { key: 'scorers', label: <span className="inline-flex items-center gap-2"><FireOutlined /> Qol vurucular</span> },
              { key: 'assists', label: <span className="inline-flex items-center gap-2"><TeamOutlined /> Ötürmə liderləri</span> },
              { key: 'rated', label: <span className="inline-flex items-center gap-2"><FieldTimeOutlined /> Reytinq</span> },
              { key: 'cards', label: <span className="inline-flex items-center gap-2"><CheckCircleOutlined /> Kartlar</span> },
            ]}
          />
          <Table<Player>
            dataSource={currentData}
            columns={playerColumns}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['24', '48', '96'],
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} oyunçu`,
            }}
            onChange={(nextPagination) => {
              setPagination({
                current: nextPagination.current ?? 1,
                pageSize: nextPagination.pageSize ?? 24,
              })
            }}
            scroll={{ x: 820 }}
          />
        </div>
      ) : (
        <div className="surface-card p-8">
          <EmptyState description="Oyunçu statistikası hələ gəlməyib" />
        </div>
      )}
    </div>
  )
}
