export const labels = {
  name: 'Ad',
  country: 'Ölkə',
  group: 'Qrup',
  coach: 'Məşqçi',
  goals: 'Qollar',
  assists: 'Ötürmələr',
  yellowCards: 'Sarı kart',
  redCards: 'Qırmızı kart',
  rating: 'Reytinq',
  position: 'Mövqe',
  played: 'Oynadı',
  won: 'Qazandı',
  drawn: 'Bərabər',
  lost: 'Uduzdu',
  goalsFor: 'Vurdu',
  goalsAgainst: 'Yedi',
  goalDiff: 'Fərq',
  points: 'Xal',
} as const

export type LabelKey = keyof typeof labels
