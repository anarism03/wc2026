import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const API_BASE_URL = process.env.WORLDCUP_API_BASE_URL ?? 'http://worldcup26.ir:3050'
const EXTRA_API_BASE_URL = process.env.WORLDCUP_EXTRA_API_BASE_URL ?? 'https://api.worldcupapi.com'
const OUT_DIR = path.join(process.cwd(), 'public', 'data')

const endpoints = [
  ['teams', '/get/teams'],
  ['groups', '/get/groups'],
  ['games', '/get/games'],
  ['stadiums', '/get/stadiums'],
]

async function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  try {
    const content = await readFile(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
      if (!match) continue
      const [, key, rawValue] = match
      if (process.env[key]) continue
      process.env[key] = rawValue.replace(/^["']|["']$/g, '')
    }
  } catch {
    // .env.local is optional. The base worldcup26.ir sync still works without it.
  }
}

function toApiArray(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function toApiObject(payload) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) return payload.data ?? payload
  return payload ?? null
}

const COMBINING_MARKS_RE = new RegExp('[\\u0300-\\u036f]', 'g')

function normalizeTeamName(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(COMBINING_MARKS_RE, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function teamNameAliases(value) {
  const normalized = normalizeTeamName(value)
  const aliases = new Set([normalized])
  if (normalized === 'united states') aliases.add('usa')
  if (normalized === 'usa') aliases.add('united states')
  if (normalized === 'ivory coast') aliases.add('cote d ivoire')
  if (normalized === 'cote d ivoire') aliases.add('ivory coast')
  if (normalized === 'south korea') aliases.add('korea republic')
  if (normalized === 'korea republic') aliases.add('south korea')
  if (normalized === 'democratic republic of the congo') aliases.add('dr congo')
  if (normalized === 'dr congo') aliases.add('democratic republic of the congo')
  return aliases
}

function namesMatch(a, b) {
  const aliasesA = teamNameAliases(a)
  for (const alias of teamNameAliases(b)) {
    if (aliasesA.has(alias)) return true
  }
  return false
}

// "06/11/2026 13:00" -> "2026-06-11"
function localDateToIso(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(value ?? ''))
  if (!match) return null
  const [, month, day, year] = match
  return `${year}-${month}-${day}`
}

function isMatchStarted(game) {
  if (String(game.finished).toUpperCase() === 'TRUE') return true
  const elapsed = String(game.time_elapsed ?? '').toLowerCase()
  return elapsed !== '' && elapsed !== 'notstarted' && elapsed !== 'not_started'
}

// Maps internal worldcup26.ir game ids to worldcupapi.com fixture ids by
// comparing home/away team names (with alias handling) and kickoff date —
// the two providers use unrelated id spaces so there is no shared key.
function buildMatchIdMap(games, extraFixtures) {
  const map = new Map()
  for (const game of games) {
    const gameDate = localDateToIso(game.local_date)
    const fixture = extraFixtures.find((f) => {
      if (gameDate && f.date && f.date !== gameDate) return false
      return (
        namesMatch(game.home_team_name_en, f.home?.name) &&
        namesMatch(game.away_team_name_en, f.away?.name)
      )
    })
    if (fixture?.id) map.set(String(game.id), fixture.id)
  }
  return map
}

async function fetchJson(endpoint, baseUrl = API_BASE_URL) {
  const url = `${baseUrl.replace(/\/$/, '')}${endpoint}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`${endpoint} failed with HTTP ${res.status}`)
  }
  return res.json()
}

async function fetchExtraJson(endpoint, params = {}) {
  const apiKey = process.env.WORLDCUP_API_KEY
  if (!apiKey) {
    throw new Error('WORLDCUP_API_KEY is not set')
  }

  const url = new URL(`${EXTRA_API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`)
  url.searchParams.set('key', apiKey)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }

  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`${endpoint} failed with HTTP ${res.status}`)
  }

  return res.json()
}

async function fetchOptionalJson(endpoint, baseUrl = API_BASE_URL) {
  try {
    return await fetchJson(endpoint, baseUrl)
  } catch (err) {
    return { error: err instanceof Error ? err.message : `${endpoint} failed` }
  }
}

async function fetchPagedExtra(endpoint) {
  const rows = []
  for (let page = 1; page <= 20; page += 1) {
    const payload = await fetchExtraJson(endpoint, { page })
    const pageRows = toApiArray(payload)
    if (!pageRows.length) break
    rows.push(...pageRows)
    if (pageRows.length < 30) break
  }
  return rows
}

await mkdir(OUT_DIR, { recursive: true })
await loadLocalEnv()

const manifest = {
  source: {
    base: API_BASE_URL,
    extra: EXTRA_API_BASE_URL,
  },
  syncedAt: new Date().toISOString(),
  files: {},
}

let gamesData = null
for (const [name, endpoint] of endpoints) {
  const data = await fetchJson(endpoint)
  if (name === 'games') gamesData = data
  const fileName = `${name}.json`
  await writeFile(path.join(OUT_DIR, fileName), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  manifest.files[name] = fileName
}

try {
  const extraFixtures = await fetchPagedExtra('fixtures')
  const liveScores = await fetchExtraJson('livescores')
  const goalscorers = await fetchExtraJson('goalscorers')
  const cards = await fetchExtraJson('cards')
  const teamMap = new Map()

  for (const fixture of extraFixtures) {
    if (fixture?.home?.id) teamMap.set(fixture.home.id, fixture.home)
    if (fixture?.away?.id) teamMap.set(fixture.away.id, fixture.away)
  }

  const squads = {}
  for (const [teamId, team] of teamMap.entries()) {
    try {
      squads[teamId] = {
        team,
        players: toApiArray(await fetchExtraJson('squads', { team_id: teamId })),
      }
    } catch (err) {
      squads[teamId] = {
        team,
        players: [],
        error: err instanceof Error ? err.message : 'Squad sync failed',
      }
    }
  }

  // Match-by-match data (events/statistics/lineups) only exists once a game has
  // kicked off, so we only fetch it for started/finished games to avoid
  // hammering the API with ~100 empty requests before the tournament begins.
  const matchDetails = {}
  const commentary = {}
  const headToHead = {}
  const games = gamesData?.games ?? []
  const startedGames = games.filter(isMatchStarted)
  const matchIdMap = buildMatchIdMap(games, extraFixtures)

  for (const game of startedGames) {
    const matchId = matchIdMap.get(String(game.id))
    if (!matchId) continue

    try {
      const [events, statistics, lineups] = await Promise.all([
        fetchExtraJson('events', { match_id: matchId }),
        fetchExtraJson('statistics', { match_id: matchId }),
        fetchExtraJson('lineups', { match_id: matchId }),
      ])
      matchDetails[String(game.id)] = {
        matchId,
        events: toApiArray(events),
        statistics: statistics?.data ?? statistics ?? null,
        lineups: lineups?.data ?? lineups ?? null,
      }

      try {
        const commentaryPayload = await fetchExtraJson('commentary', { match_id: matchId })
        commentary[String(game.id)] = {
          matchId,
          rows: toApiArray(commentaryPayload),
          raw: toApiArray(commentaryPayload).length ? undefined : toApiObject(commentaryPayload),
        }
      } catch (err) {
        commentary[String(game.id)] = {
          matchId,
          rows: [],
          error: err instanceof Error ? err.message : 'Commentary sync failed',
        }
      }
    } catch (err) {
      matchDetails[String(game.id)] = {
        matchId,
        events: [],
        statistics: null,
        lineups: null,
        error: err instanceof Error ? err.message : 'Match detail sync failed',
      }
    }
  }

  for (const game of games) {
    const matchId = matchIdMap.get(String(game.id))
    const fixture = extraFixtures.find((item) => item.id === matchId)
    const team1 = fixture?.home?.id
    const team2 = fixture?.away?.id
    if (!team1 || !team2) continue

    try {
      headToHead[String(game.id)] = {
        matchId,
        team1,
        team2,
        data: toApiObject(await fetchExtraJson('head2head', { team1_id: team1, team2_id: team2 })),
      }
    } catch (err) {
      headToHead[String(game.id)] = {
        matchId,
        team1,
        team2,
        data: null,
        error: err instanceof Error ? err.message : 'Head-to-head sync failed',
      }
    }
  }

  const gameDetails = {}
  for (const game of games) {
    gameDetails[String(game.id)] = await fetchOptionalJson(`/get/game/${game.id}`)
  }

  const apiHealth = await fetchOptionalJson('/health')

  const extraFiles = {
    extraFixtures,
    liveScores: toApiArray(liveScores),
    goalscorers: toApiArray(goalscorers),
    cards: toApiArray(cards),
    squads,
    matchDetails,
    commentary,
    headToHead,
    gameDetails,
    apiHealth,
  }

  for (const [name, data] of Object.entries(extraFiles)) {
    const fileName = `${name}.json`
    await writeFile(path.join(OUT_DIR, fileName), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
    manifest.files[name] = fileName
  }
} catch (err) {
  manifest.extraError = err instanceof Error ? err.message : 'worldcupapi.com sync failed'
}

await writeFile(path.join(OUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(`Synced World Cup API payloads to ${OUT_DIR}`)
