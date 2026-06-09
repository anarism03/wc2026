import type {
  ApiHealth, CommentaryItem, HeadToHead,
  ApiResponse, LineupPlayer, LineupTeam, Match, MatchEvent, MatchLineups, MatchStats,
  Player, Stadium, Standing, StatsDetail, Team,
} from '@/types/football'
import { createPlayerAvatarDataUrl } from '@/lib/playerAvatar'

const PLACEHOLDER_FLAG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="54" viewBox="0 0 80 54"%3E%3Crect width="80" height="54" fill="%231e293b"/%3E%3Cpath d="M0 0h80v18H0z" fill="%23334155"/%3E%3Cpath d="M0 36h80v18H0z" fill="%230f172a"/%3E%3C/svg%3E'

const DEFAULT_UPDATED_AT = () => new Date().toISOString()
let manifestSyncedAt: string | null = null

async function loadJson<T>(fileName: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`/data/${fileName}`, { cache: 'force-cache' })
    const json = (await res.json()) as unknown
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return {
      data: json as T,
      source: 'api',
      error: null,
      lastUpdated: manifestSyncedAt ?? DEFAULT_UPDATED_AT(),
    }
  } catch (err) {
    return {
      data: null as unknown as T,
      source: 'api',
      error: err instanceof Error ? err.message : 'Bilinməyən xəta',
      lastUpdated: DEFAULT_UPDATED_AT(),
    }
  }
}

async function loadManifestSyncedAt(): Promise<string> {
  if (manifestSyncedAt) return manifestSyncedAt
  try {
    const res = await fetch('/data/manifest.json', { cache: 'force-cache' })
    const manifest = (await res.json()) as { syncedAt?: string }
    manifestSyncedAt = manifest.syncedAt ?? DEFAULT_UPDATED_AT()
  } catch {
    manifestSyncedAt = DEFAULT_UPDATED_AT()
  }
  return manifestSyncedAt
}

interface WorldCupTeam {
  _id: string
  id: string
  name_en: string
  name_fa?: string
  flag: string
  fifa_code?: string
  iso2?: string
  groups?: string
}

interface WorldCupGroupRow {
  team_id: string
  mp: string | number
  w: string | number
  d: string | number
  l: string | number
  gf: string | number
  ga: string | number
  gd: string | number
  pts: string | number
}

interface WorldCupGroup {
  _id: string
  name: string
  teams: WorldCupGroupRow[]
}

interface WorldCupGame {
  _id: string
  id: string
  home_team_id: string
  away_team_id: string
  home_score: string | number
  away_score: string | number
  group: string
  matchday: string | number
  local_date: string
  stadium_id: string
  finished: string | boolean
  time_elapsed: string | number
  type: string
  home_team_name_en?: string
  away_team_name_en?: string
  home_team_label?: string
  away_team_label?: string
}

interface WorldCupStadium {
  _id: string
  id: string
  name_en: string
  name_fa?: string
  fifa_name?: string
  city_en: string
  country_en: 'United States' | 'Canada' | 'Mexico' | string
  capacity: number
  region?: string
}

interface TeamsPayload { teams?: WorldCupTeam[] }
interface GroupsPayload { groups?: WorldCupGroup[] }
interface GamesPayload { games?: WorldCupGame[] }
interface StadiumsPayload { stadiums?: WorldCupStadium[] }

interface ExtraApiTeam {
  id: number
  name: string
  logo?: string
}

interface ExtraSquadPlayer {
  id: string | number
  name: string
  shirt_number?: string | number
  position?: 'GK' | 'DF' | 'MF' | 'FW' | string
}

interface ExtraSquadEntry {
  team: ExtraApiTeam
  players: ExtraSquadPlayer[]
}

type ExtraSquadsPayload = Record<string, ExtraSquadEntry>

interface ExtraPlayerStat {
  goals?: number
  assists?: number
  played?: number
  red_cards?: number
  yellow_cards?: number
  team: ExtraApiTeam
  player: {
    id: number
    name: string
    photo?: string
  }
}

interface HeadToHeadEntry {
  data?: HeadToHead | null
  error?: string
}

interface CommentaryEntry {
  rows?: unknown[]
  raw?: unknown
  error?: string
}

type HeadToHeadPayload = Record<string, HeadToHeadEntry>
type CommentaryPayload = Record<string, CommentaryEntry>
type GameDetailsPayload = Record<string, { game?: WorldCupGame; data?: { game?: WorldCupGame }; error?: string }>

const GROUP_ORDER = 'ABCDEFGHIJKL'.split('')

const TEAM_NAME_AZ: Record<string, string> = {
  Algeria: 'Əlcəzair',
  Argentina: 'Argentina',
  Australia: 'Avstraliya',
  Austria: 'Avstriya',
  Belgium: 'Belçika',
  'Bosnia and Herzegovina': 'Bosniya və Herseqovina',
  Brazil: 'Braziliya',
  Canada: 'Kanada',
  'Cape Verde': 'Kabo-Verde',
  Colombia: 'Kolumbiya',
  Croatia: 'Xorvatiya',
  Curaçao: 'Kürasao',
  Curacao: 'Kürasao',
  'Czech Republic': 'Çexiya',
  'Democratic Republic of the Congo': 'Konqo Demokratik Respublikası',
  'DR Congo': 'Konqo Demokratik Respublikası',
  Ecuador: 'Ekvador',
  Egypt: 'Misir',
  England: 'İngiltərə',
  France: 'Fransa',
  Germany: 'Almaniya',
  Ghana: 'Qana',
  Haiti: 'Haiti',
  Iran: 'İran',
  Iraq: 'İraq',
  'Ivory Coast': 'Fil Dişi Sahili',
  Japan: 'Yaponiya',
  Jordan: 'İordaniya',
  Mexico: 'Meksika',
  Morocco: 'Mərakeş',
  Netherlands: 'Niderland',
  'New Zealand': 'Yeni Zelandiya',
  Norway: 'Norveç',
  Panama: 'Panama',
  Paraguay: 'Paraqvay',
  Portugal: 'Portuqaliya',
  Qatar: 'Qətər',
  'Saudi Arabia': 'Səudiyyə Ərəbistanı',
  Scotland: 'Şotlandiya',
  Senegal: 'Seneqal',
  'South Africa': 'Cənubi Afrika',
  'South Korea': 'Cənubi Koreya',
  Spain: 'İspaniya',
  Sweden: 'İsveç',
  Switzerland: 'İsveçrə',
  Tunisia: 'Tunis',
  Turkey: 'Türkiyə',
  'United States': 'ABŞ',
  USA: 'ABŞ',
  Uruguay: 'Uruqvay',
  Uzbekistan: 'Özbəkistan',
}

const TEAM_META: Record<string, { continent: string; fifaRanking: number }> = {
  Algeria: { continent: 'Afrika', fifaRanking: 33 },
  Argentina: { continent: 'C. Amerika', fifaRanking: 3 },
  Australia: { continent: 'Asiya', fifaRanking: 21 },
  Austria: { continent: 'Avropa', fifaRanking: 22 },
  Belgium: { continent: 'Avropa', fifaRanking: 7 },
  'Bosnia and Herzegovina': { continent: 'Avropa', fifaRanking: 39 },
  Brazil: { continent: 'C. Amerika', fifaRanking: 6 },
  Canada: { continent: 'S. Amerika', fifaRanking: 24 },
  'Cape Verde': { continent: 'Afrika', fifaRanking: 46 },
  Colombia: { continent: 'C. Amerika', fifaRanking: 13 },
  Croatia: { continent: 'Avropa', fifaRanking: 10 },
  Curaçao: { continent: 'S. Amerika', fifaRanking: 48 },
  Curacao: { continent: 'S. Amerika', fifaRanking: 48 },
  'Czech Republic': { continent: 'Avropa', fifaRanking: 41 },
  'Democratic Republic of the Congo': { continent: 'Afrika', fifaRanking: 45 },
  'DR Congo': { continent: 'Afrika', fifaRanking: 45 },
  Ecuador: { continent: 'C. Amerika', fifaRanking: 26 },
  Egypt: { continent: 'Afrika', fifaRanking: 29 },
  England: { continent: 'Avropa', fifaRanking: 4 },
  France: { continent: 'Avropa', fifaRanking: 1 },
  Germany: { continent: 'Avropa', fifaRanking: 9 },
  Ghana: { continent: 'Afrika', fifaRanking: 40 },
  Haiti: { continent: 'S. Amerika', fifaRanking: 47 },
  Iran: { continent: 'Asiya', fifaRanking: 19 },
  Iraq: { continent: 'Asiya', fifaRanking: 43 },
  'Ivory Coast': { continent: 'Afrika', fifaRanking: 31 },
  Japan: { continent: 'Asiya', fifaRanking: 18 },
  Jordan: { continent: 'Asiya', fifaRanking: 42 },
  Mexico: { continent: 'S. Amerika', fifaRanking: 14 },
  Morocco: { continent: 'Afrika', fifaRanking: 12 },
  Netherlands: { continent: 'Avropa', fifaRanking: 8 },
  'New Zealand': { continent: 'Okeaniya', fifaRanking: 38 },
  Norway: { continent: 'Avropa', fifaRanking: 25 },
  Panama: { continent: 'S. Amerika', fifaRanking: 37 },
  Paraguay: { continent: 'C. Amerika', fifaRanking: 36 },
  Portugal: { continent: 'Avropa', fifaRanking: 5 },
  Qatar: { continent: 'Asiya', fifaRanking: 28 },
  'Saudi Arabia': { continent: 'Asiya', fifaRanking: 34 },
  Scotland: { continent: 'Avropa', fifaRanking: 35 },
  Senegal: { continent: 'Afrika', fifaRanking: 17 },
  'South Africa': { continent: 'Afrika', fifaRanking: 30 },
  'South Korea': { continent: 'Asiya', fifaRanking: 20 },
  Spain: { continent: 'Avropa', fifaRanking: 2 },
  Sweden: { continent: 'Avropa', fifaRanking: 27 },
  Switzerland: { continent: 'Avropa', fifaRanking: 15 },
  Tunisia: { continent: 'Afrika', fifaRanking: 32 },
  Turkey: { continent: 'Avropa', fifaRanking: 23 },
  'United States': { continent: 'S. Amerika', fifaRanking: 16 },
  USA: { continent: 'S. Amerika', fifaRanking: 16 },
  Uruguay: { continent: 'C. Amerika', fifaRanking: 11 },
  Uzbekistan: { continent: 'Asiya', fifaRanking: 44 },
}

const STADIUM_COORDS: Record<number, { latitude: number; longitude: number }> = {
  1: { latitude: 19.3029, longitude: -99.1505 },
  2: { latitude: 20.6819, longitude: -103.4622 },
  3: { latitude: 25.6693, longitude: -100.2444 },
  4: { latitude: 32.7473, longitude: -97.0945 },
  5: { latitude: 29.6847, longitude: -95.4107 },
  6: { latitude: 39.0489, longitude: -94.4839 },
  7: { latitude: 33.7554, longitude: -84.4008 },
  8: { latitude: 25.9580, longitude: -80.2389 },
  9: { latitude: 42.0909, longitude: -71.2643 },
  10: { latitude: 39.9008, longitude: -75.1675 },
  11: { latitude: 40.8135, longitude: -74.0745 },
  12: { latitude: 43.6332, longitude: -79.4183 },
  13: { latitude: 49.2767, longitude: -123.1119 },
  14: { latitude: 47.5952, longitude: -122.3316 },
  15: { latitude: 37.4030, longitude: -121.9700 },
  16: { latitude: 33.9535, longitude: -118.3392 },
}

function toNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function teamAliases(name: string): string[] {
  const normalized = normalizeName(name)
  const aliases = new Set([normalized])
  if (normalized === 'united states') aliases.add('usa')
  if (normalized === 'usa') aliases.add('united states')
  if (normalized === 'ivory coast') aliases.add('cote d ivoire')
  if (normalized === 'cote d ivoire') aliases.add('ivory coast')
  if (normalized === 'south korea') aliases.add('korea republic')
  if (normalized === 'korea republic') aliases.add('south korea')
  if (normalized === 'democratic republic of the congo') aliases.add('dr congo')
  if (normalized === 'dr congo') aliases.add('democratic republic of the congo')
  return [...aliases]
}

function translateTeamName(name: string): string {
  return TEAM_NAME_AZ[name] ?? name
}

function translatePlaceholderName(name: string): string {
  if (name === 'TBD' || name === 'To Be Determined') return 'Müəyyənləşməyib'
  return translateTeamName(name)
}

function normalizePosition(position?: string): Player['position'] {
  if (position === 'GK') return 'GK'
  if (position === 'DF') return 'DEF'
  if (position === 'MF') return 'MID'
  if (position === 'FW') return 'FWD'
  if (position === 'DEF' || position === 'MID' || position === 'FWD') return position
  return 'MID'
}

function transfermarktUrl(name: string): string {
  return `https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(name)}`
}

function isFinished(value: string | boolean): boolean {
  return value === true || String(value).toLowerCase() === 'true'
}

function mapStatus(game: WorldCupGame): Match['status'] {
  if (isFinished(game.finished)) return 'FT'
  const elapsed = String(game.time_elapsed).toLowerCase()
  if (elapsed === 'notstarted' || elapsed === 'not_started') return 'NS'
  if (elapsed === 'halftime' || elapsed === 'ht') return 'HT'
  return 'LIVE'
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0')
}

function parseLocalDate(value: string): { date: string; time: string } {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2})/.exec(value)
  if (!match) return { date: value, time: '' }
  const [, month, day, year, time] = match
  const [hour, minute] = time.split(':').map(Number)
  const azerbaijanDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), hour + 10, minute))

  return {
    date: `${azerbaijanDate.getUTCFullYear()}-${padDatePart(azerbaijanDate.getUTCMonth() + 1)}-${padDatePart(azerbaijanDate.getUTCDate())}`,
    time: `${padDatePart(azerbaijanDate.getUTCHours())}:${padDatePart(azerbaijanDate.getUTCMinutes())}`,
  }
}

function mapCountry(country: string): Stadium['country'] {
  if (country === 'Canada') return 'Kanada'
  if (country === 'Mexico') return 'Meksika'
  return 'ABŞ'
}

function buildTeam(raw: WorldCupTeam): Team {
  const translatedName = translateTeamName(raw.name_en)
  const meta = TEAM_META[raw.name_en] ?? { continent: 'Aciqlanmayib', fifaRanking: 999 }
  return {
    id: toNumber(raw.id),
    apiName: raw.name_en,
    name: translatedName,
    country: translatedName,
    continent: meta.continent,
    fifaRanking: meta.fifaRanking,
    flag: raw.flag || PLACEHOLDER_FLAG,
    logo: raw.flag || PLACEHOLDER_FLAG,
    group: raw.groups ?? '',
    coach: 'Açıqlanmayıb',
    matchesCount: 0,
  }
}

function buildPlaceholderTeam(id: string, label: string, group: string): Team {
  const translatedName = translatePlaceholderName(label)
  const meta = TEAM_META[label] ?? { continent: 'Aciqlanmayib', fifaRanking: 999 }
  return {
    id: toNumber(id),
    apiName: label,
    name: translatedName,
    country: translatedName,
    continent: meta.continent,
    fifaRanking: meta.fifaRanking,
    flag: PLACEHOLDER_FLAG,
    logo: PLACEHOLDER_FLAG,
    group,
    coach: 'Açıqlanmayıb',
    matchesCount: 0,
  }
}

function mapGame(game: WorldCupGame, teamMap: Map<number, Team>, stadiumMap: Map<number, Stadium>): Match {
  const status = mapStatus(game)
  const { date, time } = parseLocalDate(game.local_date)
  const homeId = toNumber(game.home_team_id)
  const awayId = toNumber(game.away_team_id)
  const group = game.group ?? ''
  const minute = status === 'LIVE' ? toNumber(game.time_elapsed) || null : null
  const shouldShowScore = status !== 'NS'

  return {
    id: toNumber(game.id),
    teamA: teamMap.get(homeId) ?? buildPlaceholderTeam(game.home_team_id, game.home_team_name_en ?? game.home_team_label ?? 'TBD', group),
    teamB: teamMap.get(awayId) ?? buildPlaceholderTeam(game.away_team_id, game.away_team_name_en ?? game.away_team_label ?? 'TBD', group),
    scoreA: shouldShowScore ? toNumber(game.home_score) : null,
    scoreB: shouldShowScore ? toNumber(game.away_score) : null,
    date,
    time,
    stadium: stadiumMap.get(toNumber(game.stadium_id))?.name ?? `Stadion ${game.stadium_id}`,
    referee: '',
    group,
    status,
    minute,
  }
}

function textValue(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) return value
    if (typeof value === 'number') return String(value)
  }
  return ''
}

function objectValue(row: Record<string, unknown>, keys: string[]): Record<string, unknown> | null {
  for (const key of keys) {
    const value = row[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>
  }
  return null
}

function scoreValue(row: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value !== '') {
      const parsed = Number.parseInt(value, 10)
      if (Number.isFinite(parsed)) return parsed
    }
  }
  return null
}

function matchLiveScore(row: unknown, fixtures: Match[]): Match | null {
  if (!row || typeof row !== 'object') return null
  const live = row as Record<string, unknown>
  const home = objectValue(live, ['home', 'home_team', 'teamA', 'team_a'])
  const away = objectValue(live, ['away', 'away_team', 'teamB', 'team_b'])
  const homeName = home ? textValue(home, ['name', 'team_name', 'home_name']) : textValue(live, ['home_name', 'homeTeam', 'home_team_name'])
  const awayName = away ? textValue(away, ['name', 'team_name', 'away_name']) : textValue(live, ['away_name', 'awayTeam', 'away_team_name'])
  const date = textValue(live, ['date', 'match_date'])

  const fixture = fixtures.find((match) => {
    const sameTeams =
      normalizeName(match.teamA.apiName ?? match.teamA.name) === normalizeName(homeName) &&
      normalizeName(match.teamB.apiName ?? match.teamB.name) === normalizeName(awayName)
    return sameTeams && (!date || match.date === date)
  })
  if (!fixture) return null

  const minute = scoreValue(live, ['minute', 'elapsed', 'time_elapsed'])
  return {
    ...fixture,
    scoreA: scoreValue(live, ['home_score', 'scoreA', 'home_goals']) ?? fixture.scoreA,
    scoreB: scoreValue(live, ['away_score', 'scoreB', 'away_goals']) ?? fixture.scoreB,
    status: fixture.status === 'NS' ? 'LIVE' : fixture.status,
    minute: minute ?? fixture.minute,
  }
}

function mapStadium(raw: WorldCupStadium, matchCounts: Map<number, number>): Stadium {
  const id = toNumber(raw.id)
  const coords = STADIUM_COORDS[id] ?? { latitude: 0, longitude: 0 }

  return {
    id,
    name: raw.fifa_name || raw.name_en,
    city: raw.city_en,
    country: mapCountry(raw.country_en),
    capacity: raw.capacity,
    matchCount: matchCounts.get(id) ?? 0,
    photo: '',
    latitude: coords.latitude,
    longitude: coords.longitude,
    mapUrl: `https://maps.google.com/?q=${encodeURIComponent(`${raw.name_en} ${raw.city_en}`)}`,
  }
}

function buildStatMaps(goalscorers: ExtraPlayerStat[], cards: ExtraPlayerStat[]) {
  const stats = new Map<number, Pick<Player, 'goals' | 'assists' | 'yellowCards' | 'redCards' | 'rating' | 'photo'>>()

  for (const row of goalscorers) {
    stats.set(row.player.id, {
      goals: row.goals ?? 0,
      assists: row.assists ?? 0,
      yellowCards: 0,
      redCards: 0,
      rating: Math.min(10, 6 + (row.goals ?? 0) * 0.9 + (row.assists ?? 0) * 0.5 + (row.played ?? 0) * 0.05),
      photo: row.player.photo ?? createPlayerAvatarDataUrl(row.player.name, row.team.name),
    })
  }

  for (const row of cards) {
    const current = stats.get(row.player.id)
    stats.set(row.player.id, {
      goals: current?.goals ?? 0,
      assists: current?.assists ?? 0,
      yellowCards: row.yellow_cards ?? current?.yellowCards ?? 0,
      redCards: row.red_cards ?? current?.redCards ?? 0,
      rating: Math.max(4, (current?.rating ?? 6) - (row.yellow_cards ?? 0) * 0.15 - (row.red_cards ?? 0) * 0.5),
      photo: current?.photo ?? row.player.photo ?? createPlayerAvatarDataUrl(row.player.name, row.team.name),
    })
  }

  return stats
}

function flattenSquads(
  squads: ExtraSquadsPayload,
  stats: Map<number, Pick<Player, 'goals' | 'assists' | 'yellowCards' | 'redCards' | 'rating' | 'photo'>>
): Player[] {
  const players = new Map<number, Player>()

  for (const entry of Object.values(squads)) {
    for (const squadPlayer of entry.players ?? []) {
      const id = toNumber(squadPlayer.id)
      if (!id || players.has(id)) continue
      const playerStats = stats.get(id)
      players.set(id, {
        id,
        name: squadPlayer.name,
        position: normalizePosition(squadPlayer.position),
        shirtNumber: toNumber(squadPlayer.shirt_number),
        team: translateTeamName(entry.team.name),
        country: translateTeamName(entry.team.name),
        goals: playerStats?.goals ?? 0,
        assists: playerStats?.assists ?? 0,
        yellowCards: playerStats?.yellowCards ?? 0,
        redCards: playerStats?.redCards ?? 0,
        rating: Number((playerStats?.rating ?? 6).toFixed(1)),
        photo: playerStats?.photo ?? createPlayerAvatarDataUrl(squadPlayer.name, entry.team.name),
        transfermarktUrl: transfermarktUrl(squadPlayer.name),
      })
    }
  }

  return [...players.values()].sort((a, b) => {
    const statDiff = b.goals - a.goals || b.assists - a.assists || b.rating - a.rating
    if (statDiff !== 0) return statDiff
    return a.name.localeCompare(b.name)
  })
}

function findSquadForTeam(team: Team, squads: ExtraSquadsPayload): ExtraSquadEntry | null {
  const aliases = new Set(teamAliases(team.apiName ?? team.name))
  for (const entry of Object.values(squads)) {
    if (team.externalId && entry.team.id === team.externalId) return entry
    if (teamAliases(entry.team.name).some((alias) => aliases.has(alias))) return entry
  }
  return null
}

async function loadTeams(): Promise<ApiResponse<Team[]>> {
  await loadManifestSyncedAt()
  const res = await loadJson<TeamsPayload>('teams.json')
  if (res.error || !res.data) {
    return { data: [], source: 'api', error: res.error, lastUpdated: DEFAULT_UPDATED_AT() }
  }

  const teams = (res.data.teams ?? [])
    .map(buildTeam)
    .sort((a, b) => a.id - b.id)

  return { data: teams, source: 'api', error: null, lastUpdated: res.lastUpdated }
}

async function loadStadiums(): Promise<ApiResponse<Stadium[]>> {
  await loadManifestSyncedAt()
  const [stadiumsRes, gamesRes] = await Promise.all([
    loadJson<StadiumsPayload>('stadiums.json'),
    loadJson<GamesPayload>('games.json'),
  ])

  if (stadiumsRes.error || !stadiumsRes.data) {
    return { data: [], source: 'api', error: stadiumsRes.error, lastUpdated: DEFAULT_UPDATED_AT() }
  }

  const matchCounts = new Map<number, number>()
  for (const game of gamesRes.data?.games ?? []) {
    const stadiumId = toNumber(game.stadium_id)
    matchCounts.set(stadiumId, (matchCounts.get(stadiumId) ?? 0) + 1)
  }

  const stadiums = (stadiumsRes.data.stadiums ?? [])
    .map((stadium) => mapStadium(stadium, matchCounts))
    .sort((a, b) => a.id - b.id)

  return { data: stadiums, source: 'api', error: null, lastUpdated: stadiumsRes.lastUpdated }
}

export async function getTeams(): Promise<ApiResponse<Team[]>> {
  await loadManifestSyncedAt()
  const [teamsRes, gamesRes, squadsRes] = await Promise.all([
    loadTeams(),
    loadJson<GamesPayload>('games.json'),
    loadJson<ExtraSquadsPayload>('squads.json'),
  ])

  if (teamsRes.error) return teamsRes

  const matchCounts = new Map<number, number>()
  for (const game of gamesRes.data?.games ?? []) {
    const homeId = toNumber(game.home_team_id)
    const awayId = toNumber(game.away_team_id)
    if (homeId > 0) matchCounts.set(homeId, (matchCounts.get(homeId) ?? 0) + 1)
    if (awayId > 0) matchCounts.set(awayId, (matchCounts.get(awayId) ?? 0) + 1)
  }

  return {
    ...teamsRes,
    data: teamsRes.data.map((team) => {
      const squad = squadsRes.data ? findSquadForTeam(team, squadsRes.data) : null
      return {
        ...team,
        externalId: squad?.team.id,
        logo: squad?.team.logo ?? team.logo,
        flag: squad?.team.logo ?? team.flag,
        matchesCount: matchCounts.get(team.id) ?? 0,
      }
    }),
  }
}

export async function getStandings(): Promise<ApiResponse<Standing[]>> {
  await loadManifestSyncedAt()
  const [teamsRes, groupsRes] = await Promise.all([getTeams(), loadJson<GroupsPayload>('groups.json')])

  if (teamsRes.error || groupsRes.error || !groupsRes.data) {
    return {
      data: [],
      source: 'api',
      error: teamsRes.error ?? groupsRes.error,
      lastUpdated: DEFAULT_UPDATED_AT(),
    }
  }

  const teamMap = new Map(teamsRes.data.map((team) => [team.id, team]))
  const groups = (groupsRes.data.groups ?? []).sort((a, b) => GROUP_ORDER.indexOf(a.name) - GROUP_ORDER.indexOf(b.name))
  const standings: Standing[] = []

  for (const group of groups) {
    const rows = [...(group.teams ?? [])].sort((a, b) => {
      const points = toNumber(b.pts) - toNumber(a.pts)
      if (points !== 0) return points
      const diff = toNumber(b.gd) - toNumber(a.gd)
      if (diff !== 0) return diff
      return toNumber(b.gf) - toNumber(a.gf)
    })

    rows.forEach((row, idx) => {
      const team = teamMap.get(toNumber(row.team_id))
      if (!team) return

      standings.push({
        rank: idx + 1,
        team: { ...team, group: group.name, matchesCount: toNumber(row.mp) },
        played: toNumber(row.mp),
        won: toNumber(row.w),
        drawn: toNumber(row.d),
        lost: toNumber(row.l),
        goalsFor: toNumber(row.gf),
        goalsAgainst: toNumber(row.ga),
        goalDiff: toNumber(row.gd),
        points: toNumber(row.pts),
        qualificationStatus:
          idx <= 1 ? 'qualified'
          : idx === 2 ? 'possible_third_place'
          : 'eliminated',
      })
    })
  }

  return { data: standings, source: 'api', error: null, lastUpdated: groupsRes.lastUpdated }
}

export async function getFixtures(): Promise<ApiResponse<Match[]>> {
  await loadManifestSyncedAt()
  const [teamsRes, stadiumsRes, gamesRes] = await Promise.all([
    getTeams(),
    loadStadiums(),
    loadJson<GamesPayload>('games.json'),
  ])

  if (teamsRes.error || stadiumsRes.error || gamesRes.error || !gamesRes.data) {
    return {
      data: [],
      source: 'api',
      error: teamsRes.error ?? stadiumsRes.error ?? gamesRes.error,
      lastUpdated: DEFAULT_UPDATED_AT(),
    }
  }

  const teamMap = new Map(teamsRes.data.map((team) => [team.id, team]))
  const stadiumMap = new Map(stadiumsRes.data.map((stadium) => [stadium.id, stadium]))
  const matches = (gamesRes.data.games ?? [])
    .map((game) => mapGame(game, teamMap, stadiumMap))
    .sort((a, b) => a.id - b.id)

  return { data: matches, source: 'api', error: null, lastUpdated: gamesRes.lastUpdated }
}

export async function getLiveMatches(): Promise<ApiResponse<Match[]>> {
  const fixtures = await getFixtures()
  const liveScores = await loadJson<unknown[]>('liveScores.json')
  const fromLiveScores = (liveScores.data ?? [])
    .map((row) => matchLiveScore(row, fixtures.data))
    .filter((match): match is Match => match !== null)

  if (fromLiveScores.length > 0) {
    return {
      data: fromLiveScores,
      source: 'api',
      error: liveScores.error,
      lastUpdated: liveScores.lastUpdated,
    }
  }

  return {
    ...fixtures,
    data: fixtures.data.filter((match) => ['LIVE', '1H', '2H', 'HT', 'ET', 'PEN'].includes(match.status)),
  }
}

export async function getMatchById(id: number): Promise<ApiResponse<Match | null>> {
  await loadManifestSyncedAt()
  const [fixtures, gameDetails, teamsRes, stadiumsRes] = await Promise.all([
    getFixtures(),
    loadJson<GameDetailsPayload>('gameDetails.json'),
    getTeams(),
    loadStadiums(),
  ])

  const detail = gameDetails.data?.[String(id)]
  const rawGame = detail?.game ?? detail?.data?.game
  if (rawGame && !detail?.error) {
    return {
      data: mapGame(
        rawGame,
        new Map(teamsRes.data.map((team) => [team.id, team])),
        new Map(stadiumsRes.data.map((stadium) => [stadium.id, stadium]))
      ),
      source: 'api',
      error: null,
      lastUpdated: gameDetails.lastUpdated,
    }
  }

  return {
    data: fixtures.data.find((match) => match.id === id) ?? null,
    source: 'api',
    error: fixtures.error,
    lastUpdated: fixtures.lastUpdated,
  }
}

export async function getPlayers(): Promise<ApiResponse<Player[]>> {
  await loadManifestSyncedAt()
  const [squadsRes, goalsRes, cardsRes] = await Promise.all([
    loadJson<ExtraSquadsPayload>('squads.json'),
    loadJson<ExtraPlayerStat[]>('goalscorers.json'),
    loadJson<ExtraPlayerStat[]>('cards.json'),
  ])

  if (squadsRes.error || !squadsRes.data) {
    return {
      data: [],
      source: 'api',
      error: squadsRes.error,
      lastUpdated: DEFAULT_UPDATED_AT(),
    }
  }

  const stats = buildStatMaps(goalsRes.data ?? [], cardsRes.data ?? [])
  return {
    data: flattenSquads(squadsRes.data, stats),
    source: 'api',
    error: null,
    lastUpdated: squadsRes.lastUpdated,
  }
}

export async function getSquadByTeam(teamId?: number): Promise<ApiResponse<Player[]>> {
  await loadManifestSyncedAt()
  const [teamsRes, squadsRes, playersRes] = await Promise.all([
    getTeams(),
    loadJson<ExtraSquadsPayload>('squads.json'),
    getPlayers(),
  ])

  const team = teamsRes.data.find((item) => item.id === teamId)
  const squad = team && squadsRes.data ? findSquadForTeam(team, squadsRes.data) : null

  if (!team || !squad) {
    return {
      data: [],
      source: 'api',
      error: null,
      lastUpdated: squadsRes.lastUpdated ?? DEFAULT_UPDATED_AT(),
    }
  }

  const playerIds = new Set((squad.players ?? []).map((player) => toNumber(player.id)))
  const teamPlayers = playersRes.data.filter((player) => playerIds.has(player.id))

  return {
    data: teamPlayers.map((player, index) => ({
      ...player,
      role: index < 11 ? 'ilk11' : 'ehtiyat',
    })),
    source: 'api',
    error: null,
    lastUpdated: squadsRes.lastUpdated,
  }
}

interface RawMatchDetailEntry {
  matchId?: number
  events?: unknown[]
  statistics?: unknown
  lineups?: unknown
  error?: string
}

type MatchDetailsPayload = Record<string, RawMatchDetailEntry>

const EVENT_TYPE_MAP: Record<string, MatchEvent['type']> = {
  goal: 'goal',
  'own goal': 'goal',
  owngoal: 'goal',
  penalty: 'goal',
  'penalty goal': 'goal',
  'penalty scored': 'goal',
  'penalty missed': 'penalty_missed',
  'missed penalty': 'penalty_missed',
  'yellow card': 'yellow_card',
  yellowcard: 'yellow_card',
  'second yellow card': 'red_card',
  'red card': 'red_card',
  redcard: 'red_card',
  substitution: 'substitution',
  sub: 'substitution',
  subst: 'substitution',
}

function normalizeEventType(value: unknown): MatchEvent['type'] {
  const key = String(value ?? '').trim().toLowerCase()
  return EVENT_TYPE_MAP[key] ?? 'substitution'
}

function extractName(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.name === 'string') return obj.name
    if (typeof obj.name_en === 'string') return obj.name_en
    if (typeof obj.player === 'string') return obj.player
  }
  return ''
}

function mapMatchEvent(raw: unknown): MatchEvent | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const player = extractName(row.player ?? row.player_name ?? row.scorer)
  if (!player) return null
  const assist = extractName(row.assist ?? row.assist_player ?? row.assistant)

  return {
    minute: toNumber((row.minute ?? row.time ?? row.elapsed) as string | number),
    type: normalizeEventType(row.type ?? row.event_type ?? row.event),
    player,
    team: extractName(row.team ?? row.team_name ?? row.club),
    assist: assist || undefined,
  }
}

function toStatsDetail(raw: unknown): StatsDetail {
  const row = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    possession: toNumber((row.possession ?? row.ball_possession ?? row.possession_percentage) as string | number),
    shots: toNumber((row.shots ?? row.total_shots ?? row.shots_total) as string | number),
    shotsOnTarget: toNumber((row.shots_on_target ?? row.shotsOnTarget ?? row.shots_on_goal) as string | number),
    corners: toNumber((row.corners ?? row.corner_kicks) as string | number),
    fouls: toNumber((row.fouls ?? row.fouls_committed) as string | number),
    yellowCards: toNumber((row.yellow_cards ?? row.yellowCards) as string | number),
    redCards: toNumber((row.red_cards ?? row.redCards) as string | number),
  }
}

function pickSide(payload: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (payload[key] !== undefined) return payload[key]
  }
  return undefined
}

function mapMatchStats(raw: unknown): MatchStats | null {
  if (!raw) return null
  if (Array.isArray(raw)) {
    if (raw.length < 2) return null
    return { teamA: toStatsDetail(raw[0]), teamB: toStatsDetail(raw[1]) }
  }
  if (typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const home = pickSide(row, ['home', 'home_team', 'teamA', 'team_a'])
  const away = pickSide(row, ['away', 'away_team', 'teamB', 'team_b'])
  if (home === undefined || away === undefined) return null
  return { teamA: toStatsDetail(home), teamB: toStatsDetail(away) }
}

function toLineupPlayer(raw: unknown): LineupPlayer | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const name = extractName(row.name ?? row.player ?? row.player_name)
  if (!name) return null
  return {
    id: toNumber((row.id ?? row.player_id) as string | number),
    name,
    shirtNumber: toNumber((row.shirt_number ?? row.number ?? row.shirtNumber) as string | number),
    position: normalizePosition((row.position ?? row.pos) as string | undefined),
  }
}

function toLineupPlayers(raw: unknown): LineupPlayer[] {
  if (!Array.isArray(raw)) return []
  return raw.map(toLineupPlayer).filter((player): player is LineupPlayer => player !== null)
}

function toLineupTeam(raw: unknown, fallbackName: string): LineupTeam {
  const row = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    team: extractName(row.team ?? row.team_name) || fallbackName,
    formation: String(row.formation ?? row.formation_used ?? ''),
    startingXI: toLineupPlayers(row.starting_xi ?? row.startingXI ?? row.lineup ?? row.starting11),
    substitutes: toLineupPlayers(row.substitutes ?? row.subs ?? row.substitutes_list),
    coach: extractName(row.coach ?? row.manager) || 'Açıqlanmayıb',
  }
}

function mapMatchLineups(raw: unknown, match: Match): MatchLineups | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const home = pickSide(row, ['home', 'home_team', 'teamA', 'team_a'])
  const away = pickSide(row, ['away', 'away_team', 'teamB', 'team_b'])
  if (home === undefined && away === undefined) return null
  return {
    teamA: toLineupTeam(home, match.teamA.name),
    teamB: toLineupTeam(away, match.teamB.name),
  }
}

async function loadMatchDetail(fixtureId: number): Promise<{ entry: RawMatchDetailEntry | null; lastUpdated: string }> {
  const res = await loadJson<MatchDetailsPayload>('matchDetails.json')
  return { entry: res.data?.[String(fixtureId)] ?? null, lastUpdated: res.lastUpdated }
}

function mapCommentaryItem(raw: unknown): CommentaryItem | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const text = textValue(row, ['text', 'comment', 'commentary', 'description', 'message'])
  if (!text) return null

  return {
    minute: scoreValue(row, ['minute', 'time', 'elapsed']),
    second: scoreValue(row, ['second', 'seconds']),
    text,
    team: extractName(row.team ?? row.team_name),
    player: extractName(row.player ?? row.player_name),
    type: textValue(row, ['type', 'event_type']),
  }
}

export async function getMatchCommentary(fixtureId?: number): Promise<ApiResponse<CommentaryItem[]>> {
  if (!fixtureId) return { data: [], source: 'api', error: null, lastUpdated: DEFAULT_UPDATED_AT() }

  const res = await loadJson<CommentaryPayload>('commentary.json')
  const entry = res.data?.[String(fixtureId)]
  const rows = (entry?.rows ?? [])
    .map(mapCommentaryItem)
    .filter((item): item is CommentaryItem => item !== null)

  return {
    data: rows,
    source: 'api',
    error: entry?.error ?? null,
    lastUpdated: res.lastUpdated,
  }
}

export async function getHeadToHead(fixtureId?: number): Promise<ApiResponse<HeadToHead | null>> {
  if (!fixtureId) return { data: null, source: 'api', error: null, lastUpdated: DEFAULT_UPDATED_AT() }

  const res = await loadJson<HeadToHeadPayload>('headToHead.json')
  const entry = res.data?.[String(fixtureId)]
  return {
    data: entry?.data ?? null,
    source: 'api',
    error: entry?.error ?? null,
    lastUpdated: res.lastUpdated,
  }
}

export async function getApiHealth(): Promise<ApiResponse<ApiHealth | null>> {
  const res = await loadJson<ApiHealth>('apiHealth.json')
  return {
    data: res.data ?? null,
    source: 'api',
    error: res.error,
    lastUpdated: res.lastUpdated,
  }
}

export async function getMatchEvents(fixtureId?: number): Promise<ApiResponse<MatchEvent[]>> {
  if (!fixtureId) return { data: [], source: 'api', error: null, lastUpdated: DEFAULT_UPDATED_AT() }

  const { entry, lastUpdated } = await loadMatchDetail(fixtureId)
  const events = (entry?.events ?? [])
    .map(mapMatchEvent)
    .filter((event): event is MatchEvent => event !== null)
    .sort((a, b) => a.minute - b.minute)

  return { data: events, source: 'api', error: entry?.error ?? null, lastUpdated }
}

export async function getMatchStats(fixtureId?: number): Promise<ApiResponse<MatchStats | null>> {
  if (!fixtureId) return { data: null, source: 'api', error: null, lastUpdated: DEFAULT_UPDATED_AT() }

  const { entry, lastUpdated } = await loadMatchDetail(fixtureId)
  return { data: mapMatchStats(entry?.statistics), source: 'api', error: entry?.error ?? null, lastUpdated }
}

export async function getMatchLineups(fixtureId?: number): Promise<ApiResponse<MatchLineups | null>> {
  if (!fixtureId) return { data: null, source: 'api', error: null, lastUpdated: DEFAULT_UPDATED_AT() }

  const [{ entry, lastUpdated }, matchRes] = await Promise.all([
    loadMatchDetail(fixtureId),
    getMatchById(fixtureId),
  ])

  if (!matchRes.data) return { data: null, source: 'api', error: entry?.error ?? null, lastUpdated }

  return {
    data: mapMatchLineups(entry?.lineups, matchRes.data),
    source: 'api',
    error: entry?.error ?? null,
    lastUpdated,
  }
}

export async function getStadiums(): Promise<ApiResponse<Stadium[]>> {
  return loadStadiums()
}
