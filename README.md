# WC 2026 Match Center

WC 2026 Match Center is a Vite + React front-end for the 2026 FIFA World Cup. It is a static client application with no custom backend or local API server. All tournament data is synced from the official World Cup API source and stored in `public/data`.

This project is not an official FIFA product.

## Features

- Tournament overview, fixtures, live matches, groups, teams, stadiums, statistics, history, and favorites
- Match detail pages with lineups, events, commentary, and head-to-head context
- Team detail pages with squads, match history, and standings context
- Stadium map and location lookup
- Light and dark mode
- Responsive layout for desktop and tablet
- Real API data synced into static JSON payloads for fast client-side loading

## Tech Stack

- Vite
- React 18
- TypeScript
- Ant Design
- Tailwind CSS
- SWR
- Leaflet
- Zustand

## API Source

Swagger UI: https://worldcup26.ir/api-docs/

Main endpoints used by the app:

- `/get/teams`
- `/get/groups`
- `/get/games`
- `/get/stadiums`
- `/livescores`
- `/commentary`
- `/head2head`
- `/get/game/{id}`
- `/health`

The app does not require a separate Node backend. There are no local `/api/*` routes.

## Data Sync

Tournament data is synchronized into static JSON files before build:

```bash
npm run sync:data
```

This updates the payloads in `public/data`.

## Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Production Build

```bash
npm run build
```

This generates a static `dist/` folder ready for deployment on any static host.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local Vite dev server |
| `npm run build` | Sync data and create a production build |
| `npm run sync:data` | Refresh cached API payloads in `public/data` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript check |

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/live` | Live matches |
| `/fixtures` | Fixture schedule |
| `/matches/:id` | Match detail |
| `/groups` | Group standings |
| `/teams` | Teams |
| `/teams/:id` | Team detail |
| `/stadiums` | Stadiums |
| `/stats` | Statistics |
| `/history` | World Cup history |
| `/favorites` | Favorites |

## Notes

- The app uses synced API payloads for performance and stability.
- Player squads, match events, and commentary are shown only where the source API provides them.
- Media and UI are optimized for a football-first experience rather than a generic dashboard.
