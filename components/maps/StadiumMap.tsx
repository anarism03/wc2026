'use client'

import { useEffect, useState } from 'react'
import { EnvironmentOutlined } from '@ant-design/icons'
import type { Stadium } from '@/types/football'

interface StadiumMapProps {
  stadiums: Stadium[]
  onSelect?: (stadium: Stadium) => void
}

export default function StadiumMap({ stadiums, onSelect }: StadiumMapProps) {
  const [LeafletComponents, setLeafletComponents] = useState<{
    MapContainer: React.ComponentType<Record<string, unknown>>
    TileLayer: React.ComponentType<Record<string, unknown>>
    Marker: React.ComponentType<Record<string, unknown>>
    Popup: React.ComponentType<{ children: React.ReactNode }>
  } | null>(null)
  const [leafletError, setLeafletError] = useState(false)

  useEffect(() => {
    async function loadLeaflet() {
      try {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')

        const iconPrototype = L.Icon.Default.prototype as unknown as Record<string, unknown>
        delete iconPrototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet')
        setLeafletComponents({
          MapContainer: MapContainer as unknown as React.ComponentType<Record<string, unknown>>,
          TileLayer: TileLayer as unknown as React.ComponentType<Record<string, unknown>>,
          Marker: Marker as unknown as React.ComponentType<Record<string, unknown>>,
          Popup: Popup as unknown as React.ComponentType<{ children: React.ReactNode }>,
        })
      } catch {
        setLeafletError(true)
      }
    }
    void loadLeaflet()
  }, [])

  if (leafletError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p style={{ color: 'var(--text-muted)' }}>Xəritə yüklənə bilmədi.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {stadiums.slice(0, 6).map((stadium) => (
            <a
              key={stadium.id}
              href={stadium.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs no-underline"
              style={{ background: 'var(--bg-card)', color: 'var(--accent)', border: '1px solid var(--border)' }}
            >
              <EnvironmentOutlined aria-hidden="true" /> {stadium.name}
            </a>
          ))}
        </div>
      </div>
    )
  }

  if (!LeafletComponents) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Xəritə yüklənir...</span>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents

  return (
    <MapContainer center={[37.0902, -95.7129]} zoom={3} style={{ height: '100%', width: '100%', borderRadius: 8 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {stadiums.map((stadium) => (
        <Marker
          key={stadium.id}
          position={[stadium.latitude, stadium.longitude]}
          eventHandlers={{ click: () => onSelect?.(stadium) }}
        >
          <Popup>
            <div>
              <strong>{stadium.name}</strong>
              <br />
              {stadium.city}, {stadium.country}
              <br />
              Tutum: {stadium.capacity.toLocaleString('az-AZ')}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
