'use client'

import { Suspense, useMemo, useState } from 'react'
import dynamic from '@/src/shims/dynamic'
import { Col, Modal, Row, Tag } from 'antd'
import { EnvironmentOutlined, GlobalOutlined, HomeOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons'
import PageHeader from '@/components/layout/PageHeader'
import DataSourceBadge from '@/components/ui/DataSourceBadge'
import FilterBar from '@/components/ui/FilterBar'
import SearchInput from '@/components/ui/SearchInput'
import StatCard from '@/components/ui/StatCard'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { useStadiums } from '@/lib/hooks/useFixtures'
import type { Stadium } from '@/types/football'

const StadiumMap = dynamic(() => import('@/components/maps/StadiumMap'), {
  ssr: false,
  loading: () => <LoadingSkeleton rows={3} />,
})

const COUNTRIES = ['ABŞ', 'Kanada', 'Meksika'] as const

export default function StadiumsClient() {
  const [countryFilter, setCountryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null)
  const { stadiums, source, lastUpdated, isLoading } = useStadiums()

  const filtered = useMemo(() => {
    return stadiums.filter((stadium) => {
      if (countryFilter && stadium.country !== countryFilter) return false
      if (search) {
        const query = search.toLowerCase()
        return stadium.name.toLowerCase().includes(query) || stadium.city.toLowerCase().includes(query)
      }
      return true
    })
  }, [stadiums, countryFilter, search])

  const totalCapacity = stadiums.reduce((sum, stadium) => sum + stadium.capacity, 0)
  const avgCapacity = stadiums.length ? Math.round(totalCapacity / stadiums.length) : 0

  const openStadiumLocation = (stadium: Stadium) => {
    setSelectedStadium(stadium)
    window.open(stadium.mapUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Stadionlar"
        subtitle="2026 Dünya Kuboku üçün seçilmiş arenalar və xəritə görünüşü."
        extra={<DataSourceBadge source={source} lastUpdated={lastUpdated} />}
      />

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={12} sm={8} md={6} lg={4}><StatCard label="Arenalar" value={stadiums.length} icon={<TrophyOutlined />} /></Col>
        <Col xs={12} sm={8} md={6} lg={4}><StatCard label="ABŞ" value={stadiums.filter((stadium) => stadium.country === 'ABŞ').length} icon={<GlobalOutlined />} /></Col>
        <Col xs={12} sm={8} md={6} lg={4}><StatCard label="Kanada" value={stadiums.filter((stadium) => stadium.country === 'Kanada').length} icon={<HomeOutlined />} /></Col>
        <Col xs={12} sm={8} md={6} lg={4}><StatCard label="Meksika" value={stadiums.filter((stadium) => stadium.country === 'Meksika').length} icon={<EnvironmentOutlined />} /></Col>
        <Col xs={12} sm={8} md={6} lg={4}><StatCard label="Ortalama tutum" value={avgCapacity.toLocaleString('az-AZ')} icon={<TeamOutlined />} /></Col>
      </Row>

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : stadiums.length === 0 ? (
        <EmptyState description="Stadion məlumatı API-dən gəlmədi" />
      ) : (
        <>
          <div className="surface-card mb-8 p-4" style={{ height: 420 }}>
            <Suspense fallback={<LoadingSkeleton rows={3} />}>
              <StadiumMap stadiums={filtered} onSelect={openStadiumLocation} />
            </Suspense>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchInput value={search} onChange={setSearch} placeholder="Stadion axtar..." className="sm:max-w-[320px]" />
            <FilterBar
              className="w-full sm:w-auto"
              filters={[
                {
                  key: 'country',
                  placeholder: 'Ölkə',
                  value: countryFilter,
                  onChange: setCountryFilter,
                  options: COUNTRIES.map((country) => ({ value: country, label: country })),
                },
              ]}
            />
            <span className="text-sm sm:self-center" style={{ color: 'var(--text-muted)' }}>{filtered.length} stadion</span>
          </div>

          <Row gutter={[16, 16]}>
            {filtered.map((stadium) => (
              <Col key={stadium.id} xs={24} sm={12} lg={8}>
                <button
                  type="button"
                  className="surface-card focus-ring h-full w-full p-5 text-left transition-transform hover:-translate-y-0.5"
                  onClick={() => openStadiumLocation(stadium)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>{stadium.name}</h3>
                      <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{stadium.city}</p>
                    </div>
                    <Tag color={stadium.country === 'ABŞ' ? 'blue' : stadium.country === 'Kanada' ? 'red' : 'green'}>
                      {stadium.country}
                    </Tag>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tutum</p>
                      <p className="font-bold" style={{ color: 'var(--text-main)' }}>{stadium.capacity.toLocaleString('az-AZ')}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Oyun sayı</p>
                      <p className="font-bold" style={{ color: 'var(--primary)' }}>{stadium.matchCount}</p>
                    </div>
                  </div>
                </button>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Modal
        open={!!selectedStadium}
        onCancel={() => setSelectedStadium(null)}
        footer={null}
        title={selectedStadium?.name}
        styles={{ header: { background: 'var(--bg-card)' }, body: { background: 'var(--bg-card)' }, content: { background: 'var(--bg-card)' } }}
      >
        {selectedStadium && (
          <div className="space-y-2" style={{ color: 'var(--text-main)' }}>
            <p><strong>Şəhər:</strong> {selectedStadium.city}</p>
            <p><strong>Ölkə:</strong> {selectedStadium.country}</p>
            <p><strong>Tutum:</strong> {selectedStadium.capacity.toLocaleString('az-AZ')}</p>
            <p><strong>Oyun sayı:</strong> {selectedStadium.matchCount}</p>
            <a
              href={selectedStadium.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-bold no-underline"
              style={{ color: 'var(--accent)' }}
            >
              <EnvironmentOutlined /> Google Maps-də aç
            </a>
          </div>
        )}
      </Modal>
    </div>
  )
}
