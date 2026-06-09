import { useEffect, useMemo, useState } from 'react'
import Providers from '@/app/providers'
import Navbar from '@/components/layout/Navbar'
import MobileNav from '@/components/layout/MobileNav'
import Footer from '@/components/layout/Footer'
import HomeClient from '@/app/HomeClient'
import LiveClient from '@/app/live/LiveClient'
import FixturesClient from '@/app/fixtures/FixturesClient'
import HistoryClient from '@/app/history/HistoryClient'
import GroupsClient from '@/app/groups/GroupsClient'
import TeamsClient from '@/app/teams/TeamsClient'
import TeamDetailClient from '@/app/teams/[id]/TeamDetailClient'
import MatchDetailClient from '@/app/matches/[id]/MatchDetailClient'
import StadiumsClient from '@/app/stadiums/StadiumsClient'
import StatsClient from '@/app/stats/StatsClient'
import FavoritesClient from '@/app/favorites/FavoritesClient'
import EmptyState from '@/components/ui/EmptyState'

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

function useCurrentPath() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const update = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', update)
    window.addEventListener('wc:navigate', update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener('wc:navigate', update)
    }
  }, [])

  return path
}

function RouteView({ path }: { path: string }) {
  const route = useMemo(() => {
    const parts = path.split('/').filter(Boolean)
    return { parts, id: Number(parts[1]) }
  }, [path])

  if (path === '/') return <HomeClient />
  if (path === '/live') return <LiveClient />
  if (path === '/fixtures') return <FixturesClient />
  if (path === '/history') return <HistoryClient />
  if (path === '/groups') return <GroupsClient />
  if (path === '/teams') return <TeamsClient />
  if (path === '/stadiums') return <StadiumsClient />
  if (path === '/stats') return <StatsClient />
  if (path === '/favorites') return <FavoritesClient />

  if (route.parts[0] === 'teams' && Number.isFinite(route.id)) {
    return <TeamDetailClient id={route.id} />
  }

  if (route.parts[0] === 'matches' && Number.isFinite(route.id)) {
    return <MatchDetailClient id={route.id} />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <EmptyState description="Səhifə tapılmadı" />
    </div>
  )
}

export default function App() {
  const path = useCurrentPath()

  return (
    <Providers>
      <div className="app-frame flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pb-24 md:pb-0">
          <RouteView path={path} />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </Providers>
  )
}
