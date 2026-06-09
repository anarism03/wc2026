'use client'

import { Row, Col } from 'antd'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import ChartCard from '@/components/ui/ChartCard'
import type { Player } from '@/types/football'
import { getPositionLabel } from '@/lib/utils'

const CHART_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899']

interface Props {
  players: Player[]
}

const TOP_NATIONS = new Set([
  'Fransa',
  'İspaniya',
  'Argentina',
  'Braziliya',
  'Almaniya',
  'Portuqaliya',
  'Niderland',
  'İngiltərə',
])

export default function StatsCharts({ players }: Props) {
  const topForwards = [...players]
    .filter((player) => player.position === 'FWD' && TOP_NATIONS.has(player.team))
    .sort((a, b) => b.goals - a.goals || b.rating - a.rating || b.assists - a.assists)
    .slice(0, 8)

  const goalsData = topForwards.map((player) => ({
    name: player.name.split(' ').slice(-2).join(' '),
    goals: player.goals,
    team: player.team,
  }))

  const positionData = ['GK', 'DEF', 'MID', 'FWD'].map((pos) => ({
    name: getPositionLabel(pos),
    value: players.filter((p) => p.position === pos).length,
  }))

  return (
    <Row gutter={[16, 16]} className="mb-8">
      <Col xs={24} lg={14}>
        <ChartCard title="Top 8 Hücumçular" source="api" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={goalsData}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-main)' }}
                formatter={(value, _name, item) => [value, (item?.payload as { team?: string } | undefined)?.team ?? '']}
              />
              <Bar dataKey="goals" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Col>
      <Col xs={24} lg={10}>
        <ChartCard title="Mövqeyə görə paylanma" source="api" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={positionData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {positionData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Col>
    </Row>
  )
}
