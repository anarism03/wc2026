'use client'

import { useMemo, useState } from 'react'
import { Col, Row, Tag } from 'antd'
import Image from '@/src/shims/Image'
import Link from '@/src/shims/Link'
import PageHeader from '@/components/layout/PageHeader'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import SearchInput from '@/components/ui/SearchInput'
import FilterBar from '@/components/ui/FilterBar'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import FavoriteButton from '@/components/ui/FavoriteButton'
import { useTeams } from '@/lib/hooks/useFixtures'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
const CONTINENTS = ['Afrika', 'Asiya', 'Avropa', 'C. Amerika', 'S. Amerika', 'Okeaniya'] as const

type SortMode = 'default' | 'az' | 'za'
type TopMode = 'all' | 'top10'

function normalizeAzeriText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u0130]/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ə/g, 'e')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function TeamsClient() {
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [continentFilter, setContinentFilter] = useState('')
  const [topFilter, setTopFilter] = useState<TopMode>('all')
  const [sortOrder, setSortOrder] = useState<SortMode>('default')
  const { teams, source, lastUpdated, isLoading } = useTeams()

  const continentOptions = useMemo(
    () => CONTINENTS.map((continent) => ({ value: continent, label: continent })),
    []
  )

  const filtered = useMemo(() => {
    const query = normalizeAzeriText(search)
    const base = teams.filter((team) => {
      if (groupFilter && team.group !== groupFilter) return false
      if (continentFilter && team.continent !== continentFilter) return false
      if (topFilter === 'top10' && team.fifaRanking > 10) return false
      if (!query) return true

      const searchable = normalizeAzeriText(
        [team.name, team.country, team.continent, team.apiName ?? '', String(team.fifaRanking)].join(' ')
      )
      return searchable.includes(query)
    })

    if (sortOrder === 'az') {
      return [...base].sort((a, b) => normalizeAzeriText(a.name).localeCompare(normalizeAzeriText(b.name), 'az'))
    }

    if (sortOrder === 'za') {
      return [...base].sort((a, b) => normalizeAzeriText(b.name).localeCompare(normalizeAzeriText(a.name), 'az'))
    }

    return base
  }, [teams, search, groupFilter, continentFilter, topFilter, sortOrder])

  const activeFilters =
    Number(Boolean(groupFilter)) +
    Number(Boolean(continentFilter)) +
    Number(topFilter === 'top10') +
    Number(sortOrder !== 'default')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Komandalar"
        subtitle={`${teams.length} milli komanda · 12 qrup`}
        extra={<DataSourceBadge source={source} lastUpdated={lastUpdated} />}
      />

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Komanda axtar..." className="w-full xl:max-w-[360px]" />
          <FilterBar
            className="w-full flex-1"
            filters={[
              {
                key: 'group',
                placeholder: 'Qrup',
                value: groupFilter,
                onChange: setGroupFilter,
                options: GROUPS.map((group) => ({ value: group, label: `Qrup ${group}` })),
              },
              {
                key: 'continent',
                placeholder: 'Qitə',
                value: continentFilter,
                onChange: setContinentFilter,
                options: continentOptions,
              },
              {
                key: 'top',
                placeholder: 'Seçim',
                value: topFilter,
                onChange: (value) => setTopFilter(value as TopMode),
                options: [
                  { value: 'all', label: 'Hamısı' },
                  { value: 'top10', label: 'Top 10' },
                ],
              },
              {
                key: 'sort',
                placeholder: 'Sıralama',
                value: sortOrder,
                onChange: (value) => setSortOrder(value as SortMode),
                options: [
                  { value: 'default', label: 'Varsayılan' },
                  { value: 'az', label: 'A-Z' },
                  { value: 'za', label: 'Z-A' },
                ],
              },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} komanda</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {activeFilters > 0 ? `${activeFilters} filter aktivdir` : ''}
          </span>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState description="Komanda tapılmadı" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((team) => (
            <Col key={team.id} xs={24} sm={12} md={8} lg={6}>
              <div className="glass-card flex h-full min-h-[188px] flex-col p-5 transition-transform hover:scale-[1.02]">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/teams/${team.id}`} className="flex min-w-0 items-start gap-4 no-underline">
                    <Image src={team.flag} alt={team.name} width={48} height={32} unoptimized className="rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold leading-tight" style={{ color: 'var(--text-main)' }}>
                        {team.name}
                      </h3>
                      <p className="truncate text-xs font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>
                        Qitə: {team.continent}
                      </p>
                    </div>
                  </Link>
                  <FavoriteButton id={team.id} kind="team" />
                </div>
                <div className="mt-auto pt-4">
                  <Link href={`/teams/${team.id}`} className="block no-underline">
                    <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                      <Tag color="blue">Qrup {team.group}</Tag>
                      <span
                        className="rounded-full px-2 py-1 text-xs font-bold"
                        style={{ color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 12%, transparent)' }}
                      >
                        FIFA #{team.fifaRanking}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
