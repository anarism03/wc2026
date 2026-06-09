'use client'

import useSWR from 'swr'
import {
  getFixtures, getLiveMatches, getMatchById,
  getTeams, getStandings, getPlayers, getSquadByTeam,
  getMatchEvents, getMatchStats, getMatchLineups, getStadiums,
  getMatchCommentary, getHeadToHead, getApiHealth,
} from '@/lib/api/footballApi'
import { swrConfig, liveSwrConfig } from '@/lib/swr'
import type {
  ApiHealth, ApiResponse, CommentaryItem, HeadToHead, Match, Team, Standing, Player, Stadium, MatchEvent, MatchStats, MatchLineups,
} from '@/types/football'

export function useFixtures() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Match[]>>(
    'fixtures',
    () => getFixtures(),
    swrConfig
  )
  return {
    fixtures:    data?.data ?? [],
    source:      data?.source ?? 'api' as const,
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: !!error,
    refresh: mutate,
  }
}

export function useLiveMatches() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Match[]>>(
    'live-matches',
    () => getLiveMatches(),
    liveSwrConfig
  )
  return {
    matches:     data?.data ?? [],
    source:      data?.source ?? 'api' as const,
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: !!error,
    refresh: mutate,
  }
}

export function useMatchById(id: number) {
  const { data, error, isLoading } = useSWR<ApiResponse<Match | null>>(
    `match-${id}`,
    () => getMatchById(id),
    swrConfig
  )
  return {
    match:  data?.data ?? null,
    source: data?.source ?? 'api' as const,
    isLoading,
    isError: !!error,
  }
}

export function useTeams() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Team[]>>(
    'teams',
    () => getTeams(),
    swrConfig
  )
  return {
    teams:       data?.data ?? [],
    source:      data?.source ?? 'api' as const,
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: !!error,
    refresh: mutate,
  }
}

export function useStandings() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Standing[]>>(
    'standings',
    () => getStandings(),
    swrConfig
  )
  return {
    standings:   data?.data ?? [],
    source:      data?.source ?? 'api' as const,
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: !!error,
    refresh: mutate,
  }
}

export function usePlayers() {
  const { data, error, isLoading } = useSWR<ApiResponse<Player[]>>(
    'players',
    () => getPlayers(),
    swrConfig
  )
  return {
    players:     data?.data ?? [],
    source:      data?.source ?? 'api' as const,
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: !!error,
  }
}

export function useMatchEvents(fixtureId: number | null) {
  const { data, isLoading } = useSWR<ApiResponse<MatchEvent[]>>(
    fixtureId ? `events-${fixtureId}` : null,
    () => getMatchEvents(fixtureId!),
    swrConfig
  )
  return { events: data?.data ?? [], isLoading }
}

export function useMatchStats(fixtureId: number | null) {
  const { data, isLoading } = useSWR<ApiResponse<MatchStats | null>>(
    fixtureId ? `match-stats-${fixtureId}` : null,
    () => getMatchStats(fixtureId!),
    swrConfig
  )
  return { stats: data?.data ?? null, isLoading }
}

export function useMatchLineups(fixtureId: number | null) {
  const { data, isLoading } = useSWR<ApiResponse<MatchLineups | null>>(
    fixtureId ? `lineups-${fixtureId}` : null,
    () => getMatchLineups(fixtureId!),
    swrConfig
  )
  return { lineups: data?.data ?? null, isLoading }
}

export function useMatchCommentary(fixtureId: number | null) {
  const { data, isLoading } = useSWR<ApiResponse<CommentaryItem[]>>(
    fixtureId ? `commentary-${fixtureId}` : null,
    () => getMatchCommentary(fixtureId!),
    swrConfig
  )
  return { commentary: data?.data ?? [], isLoading }
}

export function useHeadToHead(fixtureId: number | null) {
  const { data, isLoading } = useSWR<ApiResponse<HeadToHead | null>>(
    fixtureId ? `head-to-head-${fixtureId}` : null,
    () => getHeadToHead(fixtureId!),
    swrConfig
  )
  return { headToHead: data?.data ?? null, isLoading }
}

export function useApiHealth() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ApiHealth | null>>(
    'api-health',
    () => getApiHealth(),
    liveSwrConfig
  )
  return {
    health: data?.data ?? null,
    source: data?.source ?? 'api' as const,
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: !!error,
    refresh: mutate,
  }
}

export function useSquadByTeam(teamId: number | null) {
  const { data, error, isLoading } = useSWR<ApiResponse<Player[]>>(
    teamId ? `squad-${teamId}` : null,
    () => getSquadByTeam(teamId!),
    swrConfig
  )
  return {
    squad:   data?.data ?? [],
    source:  data?.source ?? 'api' as const,
    isLoading,
    isError: !!error,
  }
}

export function useStadiums() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Stadium[]>>(
    'stadiums',
    () => getStadiums(),
    swrConfig
  )
  return {
    stadiums:    data?.data ?? [],
    source:      data?.source ?? 'api' as const,
    lastUpdated: data?.lastUpdated,
    isLoading,
    isError: !!error,
    refresh: mutate,
  }
}
