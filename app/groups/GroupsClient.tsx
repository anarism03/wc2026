'use client'

import { useMemo, useState } from 'react'
import { Empty, Spin, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Image from '@/src/shims/Image'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import { useStandings } from '@/lib/hooks/useFixtures'
import type { QualificationStatus, Standing } from '@/types/football'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const QUAL_CONFIG: Record<QualificationStatus, { color: string; label: string }> = {
  qualified: { color: '#10B981', label: 'Keçir' },
  possible_third_place: { color: '#F59E0B', label: 'Üçüncü yer ehtimalı' },
  eliminated: { color: '#EF4444', label: 'Çıxıb' },
}

function getGroupRows(standings: Standing[], group: string) {
  return standings
    .filter((standing) => standing.team.group === group)
    .sort((a, b) => a.rank - b.rank)
}

export default function GroupsClient() {
  const [activeGroup, setActiveGroup] = useState('A')
  const { standings, source, lastUpdated, isLoading } = useStandings()

  const activeRows = useMemo(() => getGroupRows(standings, activeGroup), [standings, activeGroup])

  const overviewGroups = useMemo(
    () =>
      GROUPS.map((group) => {
        const rows = getGroupRows(standings, group)
        return {
          group,
          rows,
          leader: rows[0],
          podium: rows.slice(0, 3),
          totalPoints: rows.reduce((sum, row) => sum + row.points, 0),
        }
      }),
    [standings]
  )

  const leader = activeRows[0]
  const qualifierCount = activeRows.filter((row) => row.qualificationStatus === 'qualified').length
  const aliveCount = activeRows.filter((row) => row.qualificationStatus !== 'eliminated').length

  const columns: ColumnsType<Standing> = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      width: 52,
      render: (rank: number, record) => (
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: `${QUAL_CONFIG[record.qualificationStatus].color}22`,
            color: QUAL_CONFIG[record.qualificationStatus].color,
          }}
        >
          {rank}
        </span>
      ),
    },
    {
      title: 'Komanda',
      key: 'team',
      render: (_, record) => (
        <div className="flex min-w-0 items-center gap-3">
          <Image src={record.team.flag} alt={record.team.name} width={22} height={16} unoptimized />
          <div className="min-w-0">
            <div className="truncate font-medium" style={{ color: 'var(--text-main)' }}>
              {record.team.name}
            </div>
            <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-faint)' }}>
              Qrup {record.team.group}
            </div>
          </div>
        </div>
      ),
    },
    { title: 'O', dataIndex: 'played', key: 'played', width: 58, align: 'center', render: (value: number) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{value}</span> },
    { title: 'Q', dataIndex: 'won', key: 'won', width: 58, align: 'center', render: (value: number) => <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>{value}</span> },
    { title: 'H', dataIndex: 'drawn', key: 'drawn', width: 58, align: 'center', render: (value: number) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{value}</span> },
    { title: 'M', dataIndex: 'lost', key: 'lost', width: 58, align: 'center', render: (value: number) => <span className="text-sm font-medium" style={{ color: 'var(--danger)' }}>{value}</span> },
    { title: 'V', dataIndex: 'goalsFor', key: 'goalsFor', width: 58, align: 'center', responsive: ['md'], render: (value: number) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{value}</span> },
    { title: 'Y', dataIndex: 'goalsAgainst', key: 'goalsAgainst', width: 58, align: 'center', responsive: ['md'], render: (value: number) => <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{value}</span> },
    {
      title: 'Fərq',
      dataIndex: 'goalDiff',
      key: 'goalDiff',
      width: 72,
      align: 'center',
      render: (value: number) => (
        <span className={`text-sm font-semibold ${value > 0 ? 'text-success' : value < 0 ? 'text-danger' : ''}`}>
          {value > 0 ? `+${value}` : value}
        </span>
      ),
    },
    {
      title: 'Xal',
      dataIndex: 'points',
      key: 'points',
      width: 70,
      align: 'center',
      render: (value: number) => (
        <span className="text-base font-extrabold" style={{ color: 'var(--primary)' }}>
          {value}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'qual',
      responsive: ['sm'],
      render: (_, record) => {
        const cfg = QUAL_CONFIG[record.qualificationStatus]
        return <Tag color={cfg.color === '#10B981' ? 'green' : cfg.color === '#F59E0B' ? 'gold' : 'red'}>{cfg.label}</Tag>
      },
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <section className="hero-poster overflow-hidden rounded-[8px] border border-[var(--border)] shadow-[var(--shadow-soft)]">
        <div className="px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{
                  borderColor: 'var(--border-strong)',
                  background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                  color: 'var(--text-main)',
                }}
              >
                Dünya Kuboku 2026
              </div>
              <h1 className="mt-4 font-display text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl lg:text-5xl">
                Qrup cədvəli
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                Komandaların sıralaması, xal fərqi və qrup mübarizəsi bir baxışda. Səhifə daha sakit palitra ilə saxlanılıb,
                amma iyerarxiya və oxunaqlılıq gücləndirilib.
              </p>
            </div>

            <div className="min-w-0 rounded-[8px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_82%,transparent)] backdrop-blur-sm">
              <div className="grid grid-cols-3 divide-x divide-[var(--border)]">
                <div className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>
                    Seçilən qrup
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-3">
                    <span className="font-display text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>
                      {activeGroup}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {activeRows.length} komanda
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>
                    Lider
                  </div>
                  <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                    {leader?.team.name ?? 'Məlumat yoxdur'}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {leader ? `${leader.points} xal` : '—'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>
                    Yekun vəziyyət
                  </div>
                  <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                    {qualifierCount} keçid ehtimalı
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {aliveCount} komanda mübarizədədir
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--text-faint)' }}>
              Qrup seçimi
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
              Qruplar arasında sürətli keçid
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(QUAL_CONFIG).map(([key, config]) => (
              <span
                key={key}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                  borderColor: 'var(--border)',
                  background: 'color-mix(in srgb, var(--bg-elevated) 72%, transparent)',
                  color: 'var(--text-muted)',
                }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: config.color }} />
                {config.label}
              </span>
            ))}
          </div>
        </div>

        <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-1">
          {GROUPS.map((group) => {
            const rows = getGroupRows(standings, group)
            const selected = group === activeGroup
            return (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className="inline-flex min-w-[104px] items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200"
                style={{
                  borderColor: selected ? 'var(--border-strong)' : 'var(--border)',
                  background: selected
                    ? 'color-mix(in srgb, var(--primary) 16%, var(--bg-card))'
                    : 'var(--bg-card)',
                  color: selected ? 'var(--text-main)' : 'var(--text-muted)',
                  boxShadow: selected ? '0 10px 24px rgba(0, 0, 0, 0.12)' : 'none',
                }}
              >
                <span className="mr-2 text-xs uppercase tracking-[0.2em]" style={{ color: selected ? 'var(--primary)' : 'var(--text-faint)' }}>
                  Qrup
                </span>
                {group}
                <span className="ml-2 text-xs" style={{ color: 'var(--text-faint)' }}>
                  {rows.length}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--text-faint)' }}>
              Seçilmiş qrup
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
              Qrup {activeGroup}
            </h3>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              Sıralama əvvəlcə xal, sonra qol fərqinə görə göstərilir.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              {activeRows.length} komanda
            </span>
            <DataSourceBadge source={source} lastUpdated={lastUpdated} />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <Spin spinning={isLoading}>
            <Table<Standing>
              className="group-table"
              dataSource={activeRows}
              columns={columns}
              rowKey={(row) => row.team.id}
              pagination={false}
              size="middle"
              scroll={{ x: 760 }}
              locale={{
                emptyText: (
                  <div className="py-12">
                    <Empty description="Bu qrup üçün məlumat tapılmadı" />
                  </div>
                ),
              }}
              rowClassName={(record) => {
                const status = record.qualificationStatus
                if (status === 'qualified') return 'group-row group-row-qualified'
                if (status === 'possible_third_place') return 'group-row group-row-pending'
                return 'group-row'
              }}
            />
          </Spin>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--text-faint)' }}>
            Bütün qruplar
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
            Qrup xülasəsi
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overviewGroups.map((groupInfo) => {
            const isActive = groupInfo.group === activeGroup

            return (
              <button
                key={groupInfo.group}
                type="button"
                onClick={() => setActiveGroup(groupInfo.group)}
                className="surface-card text-left transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  borderColor: isActive ? 'var(--border-strong)' : 'var(--border)',
                  boxShadow: isActive ? '0 18px 40px rgba(0, 0, 0, 0.18)' : 'var(--shadow-soft)',
                }}
              >
                <div className="border-b border-[var(--border)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-faint)' }}>
                        Qrup {groupInfo.group}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                        {groupInfo.rows.length} komanda
                      </h3>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: isActive
                          ? 'color-mix(in srgb, var(--primary) 18%, transparent)'
                          : 'color-mix(in srgb, var(--bg-soft) 60%, transparent)',
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                      }}
                    >
                      {groupInfo.totalPoints} xal
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-2">
                    {groupInfo.podium.map((row) => (
                      <div key={row.team.id} className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="inline-flex h-5 w-5 items-center justify-center text-[11px] font-bold"
                            style={{ color: QUAL_CONFIG[row.qualificationStatus].color }}
                          >
                            {row.rank}
                          </span>
                          <Image src={row.team.flag} alt={row.team.name} width={16} height={12} unoptimized />
                          <span className="truncate text-sm" style={{ color: 'var(--text-main)' }}>
                            {row.team.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                          {row.points}
                        </span>
                      </div>
                    ))}
                  </div>

                  {groupInfo.leader && (
                    <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                      <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-faint)' }}>
                        Lider
                      </span>
                      <span className="truncate text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                        {groupInfo.leader.team.name}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
