'use client'

import { useMemo, useState } from 'react'
import { Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ReloadOutlined } from '@ant-design/icons'
import Image from '@/src/shims/Image'
import PageHeader from '@/components/layout/PageHeader'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import FilterBar from '@/components/ui/FilterBar'
import SearchInput from '@/components/ui/SearchInput'
import { useFixtures } from '@/lib/hooks/useFixtures'
import { getStatusLabel } from '@/lib/utils'
import type { Match } from '@/types/football'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
const STATUSES = ['NS', 'LIVE', 'HT', 'FT', '1H', '2H', 'ET', 'PEN']

export default function FixturesClient() {
  const [groupFilter, setGroupFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const { fixtures, source, lastUpdated, isLoading, refresh } = useFixtures()

  const filtered = useMemo(() => {
    return fixtures.filter((match) => {
      if (groupFilter && match.group !== groupFilter) return false
      if (statusFilter && match.status !== statusFilter) return false
      if (search) {
        const query = search.toLowerCase()
        return (
          match.teamA.name.toLowerCase().includes(query) ||
          match.teamB.name.toLowerCase().includes(query) ||
          match.stadium.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [fixtures, groupFilter, statusFilter, search])

  const openMatch = (matchId: number) => {
    window.history.pushState({}, '', `/matches/${matchId}`)
    window.dispatchEvent(new Event('wc:navigate'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const columns: ColumnsType<Match> = [
    {
      title: 'Tarix',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string, record) => (
        <div>
          <div className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>{date}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{record.time} AZT</div>
        </div>
      ),
    },
    {
      title: 'Qrup',
      dataIndex: 'group',
      key: 'group',
      width: 78,
      render: (group: string) => <Tag color="blue">Qrup {group}</Tag>,
    },
    {
      title: 'Ev sahibi',
      key: 'teamA',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Image src={record.teamA.flag} alt={record.teamA.name} width={20} height={14} unoptimized />
          <span style={{ color: 'var(--text-main)' }}>{record.teamA.name}</span>
        </div>
      ),
    },
    {
      title: 'Hesab',
      key: 'score',
      width: 90,
      align: 'center',
      render: (_, record) => (
        <span className="font-display text-base font-extrabold" style={{ color: 'var(--primary)' }}>
          {record.scoreA != null ? `${record.scoreA} : ${record.scoreB}` : 'vs'}
        </span>
      ),
    },
    {
      title: 'Qonaq',
      key: 'teamB',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Image src={record.teamB.flag} alt={record.teamB.name} width={20} height={14} unoptimized />
          <span style={{ color: 'var(--text-main)' }}>{record.teamB.name}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 118,
      render: (_, record) => <StatusBadge status={record.status} minute={record.minute} />,
    },
    {
      title: 'Stadion',
      dataIndex: 'stadium',
      key: 'stadium',
      responsive: ['lg'],
      render: (stadium: string) => <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stadium}</span>,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Oyun təqvimi"
        subtitle={`${fixtures.length} oyun · 12 qrup · pley-off mərhələləri · Azərbaycan vaxtı`}
        extra={
          <div className="flex items-center gap-2">
            <DataSourceBadge source={source} lastUpdated={lastUpdated} />
            <button
              onClick={() => void refresh()}
              className="rounded-lg p-1.5 transition-colors"
              title="Yenilə"
              style={{ color: 'var(--text-muted)' }}
            >
              <ReloadOutlined spin={isLoading} />
            </button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Komanda və ya stadion axtar..." className="sm:max-w-[340px]" />
        <FilterBar
          className="w-full sm:w-auto"
          filters={[
            {
              key: 'group',
              placeholder: 'Qrup',
              value: groupFilter,
              onChange: setGroupFilter,
              options: GROUPS.map((group) => ({ value: group, label: `Qrup ${group}` })),
            },
            {
              key: 'status',
              placeholder: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: STATUSES.map((status) => ({ value: status, label: getStatusLabel(status) })),
            },
          ]}
        />
        <span className="text-sm sm:self-center" style={{ color: 'var(--text-muted)' }}>{filtered.length} oyun</span>
      </div>

      <Space direction="vertical" size={0} className="w-full">
        <Table<Match>
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => openMatch(record.id),
            style: { cursor: 'pointer' },
            title: `${record.teamA.name} - ${record.teamB.name}`,
          })}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          scroll={{ x: 760 }}
          style={{ background: 'transparent' }}
          rowClassName="hover:bg-bg-glass"
        />
      </Space>
    </div>
  )
}
