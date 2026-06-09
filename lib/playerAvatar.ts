function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

function colorFromHash(hash: number): string {
  const hue = hash % 360
  return `hsl(${hue} 72% 50%)`
}

export function createPlayerAvatarDataUrl(name: string, team: string): string {
  const hash = hashString(`${name}-${team}`)
  const bg = colorFromHash(hash)
  const fg = '#ffffff'
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${bg}" stop-opacity="1" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.96" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#g)" />
      <circle cx="80" cy="58" r="28" fill="rgba(255,255,255,0.18)" />
      <path d="M28 140c8-28 30-42 52-42s44 14 52 42" fill="rgba(255,255,255,0.18)" />
      <text x="80" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="${fg}">${initials}</text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`
}
