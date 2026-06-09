export type MatchStatus = 'NS' | 'LIVE' | 'HT' | 'FT' | '1H' | '2H' | 'ET' | 'PEN'
export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD'
export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty_missed'
export type QualificationStatus = 'qualified' | 'possible_third_place' | 'eliminated'

export interface Team {
  id: number
  externalId?: number
  apiName?: string
  name: string
  country: string
  continent: string
  fifaRanking: number
  flag: string
  group: string
  coach: string
  matchesCount: number
  logo: string
}

export interface Player {
  id: number
  name: string
  position: PlayerPosition
  shirtNumber?: number
  team: string
  country: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  rating: number
  photo: string
  transfermarktUrl?: string
  role?: 'ilk11' | 'ehtiyat' | 'zedeli'
}

export interface Match {
  id: number
  teamA: Team
  teamB: Team
  scoreA: number | null
  scoreB: number | null
  date: string
  time: string
  stadium: string
  referee: string
  group: string
  status: MatchStatus
  minute: number | null
}

export interface MatchEvent {
  minute: number
  type: EventType
  player: string
  team: string
  assist?: string
}

export interface StatsDetail {
  possession: number
  shots: number
  shotsOnTarget: number
  corners: number
  fouls: number
  yellowCards: number
  redCards: number
}

export interface MatchStats {
  teamA: StatsDetail
  teamB: StatsDetail
}

export interface LineupPlayer {
  id: number
  name: string
  shirtNumber: number
  position: PlayerPosition
}

export interface LineupTeam {
  team: string
  formation: string
  startingXI: LineupPlayer[]
  substitutes: LineupPlayer[]
  coach: string
}

export interface MatchLineups {
  teamA: LineupTeam
  teamB: LineupTeam
}

export interface CommentaryItem {
  minute: number | null
  second?: number | null
  text: string
  team?: string
  player?: string
  type?: string
}

export interface HeadToHeadMatch {
  id?: string | number
  date?: string
  home_name?: string
  away_name?: string
  score?: string
  status?: string
  location?: string
}

export interface HeadToHeadTeam {
  id?: string | number
  name: string
  overall_form?: string[]
  h2h_form?: string[]
}

export interface HeadToHead {
  team1?: HeadToHeadTeam
  team2?: HeadToHeadTeam
  team1_last_6?: HeadToHeadMatch[]
  team2_last_6?: HeadToHeadMatch[]
  h2h?: HeadToHeadMatch[]
}

export interface ApiHealth {
  status: string
  timestamp?: string
  uptime?: number
  version?: string
  environment?: string
  database?: {
    status?: string
    name?: string
  }
  memory?: {
    used?: string
    total?: string
  }
}

export interface Standing {
  rank: number
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
  qualificationStatus: QualificationStatus
}

export interface Stadium {
  id: number
  name: string
  city: string
  country: 'ABŞ' | 'Kanada' | 'Meksika'
  capacity: number
  matchCount: number
  photo: string
  latitude: number
  longitude: number
  mapUrl: string
}

export interface Prize {
  team: Team
  stage: string
  amount: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  source: 'api' | 'mock' | 'cache'
  error: string | null
  lastUpdated: string
}
