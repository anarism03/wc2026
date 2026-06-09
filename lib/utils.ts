export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('az-AZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(timeStr: string): string {
  return timeStr.substring(0, 5)
}

export function formatAmount(amount: number): string {
  return `${amount.toLocaleString('az-AZ').replace(/,/g, '.')} $`
}

export function getGroupLabel(group: string): string {
  return group.length === 1 ? `Qrup ${group}` : group
}

export function getPositionLabel(position: string): string {
  const map: Record<string, string> = {
    GK: 'Qapıçı',
    DEF: 'Müdafiəçi',
    MID: 'Yarımmüdafiəçi',
    FWD: 'Hücumçu',
  }
  return map[position] ?? position
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    NS: 'Başlamayıb',
    LIVE: 'Canlı',
    HT: 'Fasilə',
    FT: 'Bitdi',
    '1H': '1-ci hissə',
    '2H': '2-ci hissə',
    ET: 'Əlavə vaxt',
    PEN: 'Penaltilər',
  }
  return map[status] ?? status
}
