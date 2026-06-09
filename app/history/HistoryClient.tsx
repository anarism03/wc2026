'use client'

import { Col, Row, Timeline, Tag } from 'antd'
import {
  LinkOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DribbbleOutlined,
  BankOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import Link from '@/src/shims/Link'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/ui/StatCard'
import DataSourceBadge from '@/components/ui/DataSourceBadge'

const TITLE_LEADERS = [
  { team: 'Braziliya', titles: 5 },
  { team: 'Almaniya', titles: 4 },
  { team: 'İtaliya', titles: 4 },
  { team: 'Argentina', titles: 3 },
  { team: 'Fransa', titles: 2 },
  { team: 'Uruqvay', titles: 2 },
]

const FINAL_MOMENTS = [
  { year: '1950', title: 'Marakana sarsıntısı', text: 'Uruqvay Braziliyanı final mərhələsində 2:1 məğlub etdi.' },
  { year: '1966', title: 'İngiltərənin ev finalı', text: 'İngiltərə Dünya Kubokunu öz meydanında qazandı.' },
  { year: '1986', title: 'Maradona dövrü', text: 'Argentina turnirin simasına çevrildi.' },
  { year: '2014', title: 'Almaniyanın zirvəsi', text: 'Almaniya finalda Argentina qarşısında qalib gəldi.' },
  { year: '2022', title: 'Lusail gecəsi', text: 'Argentina və Fransa tarixə düşən final oynadı.' },
]

const MOMENTS = [
  { title: 'Ən çox titul', value: 'Braziliya 5', icon: <TrophyOutlined /> },
  { title: 'Ən çox qol', value: 'Miroslav Klose 16', icon: <DribbbleOutlined /> },
  { title: 'İlk çempionat', value: '1930, Uruqvay', icon: <BankOutlined /> },
  { title: '2026 formatı', value: '48 komanda', subtext: '104 oyun', icon: <TeamOutlined /> },
]

export default function HistoryClient() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="surface-card hero-poster mb-8 overflow-hidden">
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold" style={{ background: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--primary)' }}>
              <TrophyOutlined /> Dünya Kuboku tarixi
            </div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl" style={{ color: 'var(--text-main)' }}>
              Tarix, finalar və böyük anlar
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg" style={{ color: 'var(--text-muted)' }}>
              Dünya Kubokunun ən böyük rekordları, yadda qalan final gecələri və 2026 turnirinə aparan əsas faktlar bir səhifədə.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Tag color="gold">FIFA rəsmi məlumatları</Tag>
              <Tag color="blue">104 oyun</Tag>
              <Tag color="green">48 komanda</Tag>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Row gutter={[16, 16]}>
          {MOMENTS.map((item) => (
            <Col key={item.title} xs={12} md={6}>
              <StatCard label={item.title} value={item.value} subtext={item.subtext} icon={item.icon} />
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <div className="surface-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Ən çox titul qazananlar</h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  FIFA tarixində kubok sayına görə ilk pillədə Braziliya dayanır.
                </p>
              </div>
              <DataSourceBadge source="api" />
            </div>
            <div className="space-y-3">
              {TITLE_LEADERS.map((item, index) => (
                <div key={item.team} className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--bg-soft)' }}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full font-bold" style={{ background: 'var(--bg-card)', color: 'var(--primary)' }}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold" style={{ color: 'var(--text-main)' }}>{item.team}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Dünya Kuboku titulları</div>
                  </div>
                  <span className="font-display text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>{item.titles}</span>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <div className="surface-card p-5 h-full">
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Tarixi final gecələri</h2>
            <Timeline
              className="mt-4"
              items={FINAL_MOMENTS.map((item) => ({
                key: item.year,
                dot: <ClockCircleOutlined style={{ color: 'var(--primary)' }} />,
                children: (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: 'var(--primary)' }}>{item.year}</span>
                      <Tag color="blue">{item.title}</Tag>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{item.text}</p>
                  </div>
                ),
              }))}
            />
          </div>
        </Col>
      </Row>

      <div className="mt-8 surface-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>2026 üçün əsas qeyd</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              FIFA 2026 turnirini Kanada, Meksika və ABŞ birlikdə keçirəcək.
            </p>
          </div>
          <Link href="/fixtures" className="inline-flex items-center gap-2 font-bold no-underline" style={{ color: 'var(--accent)' }}>
            Oyunlara bax <LinkOutlined />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg p-4" style={{ background: 'var(--bg-soft)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Başlanğıc</div>
            <div className="mt-1 text-lg font-bold" style={{ color: 'var(--text-main)' }}>11 iyun 2026</div>
          </div>
          <div className="rounded-lg p-4" style={{ background: 'var(--bg-soft)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Final</div>
            <div className="mt-1 text-lg font-bold" style={{ color: 'var(--text-main)' }}>19 iyul 2026</div>
          </div>
          <div className="rounded-lg p-4" style={{ background: 'var(--bg-soft)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Oyun sayı</div>
            <div className="mt-1 text-lg font-bold" style={{ color: 'var(--text-main)' }}>104</div>
          </div>
          <div className="rounded-lg p-4" style={{ background: 'var(--bg-soft)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Komanda sayı</div>
            <div className="mt-1 text-lg font-bold" style={{ color: 'var(--text-main)' }}>48</div>
          </div>
        </div>
      </div>
    </div>
  )
}
