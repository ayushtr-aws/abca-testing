# soccer-app architecture

`soccer-app/` is a client-only single-page app built with Vite, React 19 and
TypeScript. It shows season statistics and squads for a fixed set of European
clubs. It has no backend, API calls or router: all data is a static
TypeScript module bundled into the app.

## Data-flow overview

```
index.html ──loads──▶ src/main.tsx ──renders──▶ <App/>  (src/App.tsx)
                           │                       │
                     imports index.css      imports teams (src/data/teams.ts)
                                            imports App.css
                                                   │
                     state: selectedTeamId, searchQuery, sortKey, isDarkMode
                                                   │
                        teams ─▶ filter(searchQuery) ─▶ sort(sortKey) ─▶ filteredTeams
                                                   │
                  ┌────────────────────────────────┴───────────────────────┐
                  ▼                                                        ▼
   <TeamCard team isSelected onClick/>  × N                    <TeamDetail team={selectedTeam}/>
   (sidebar list)                                              (main panel)
                  │
                  └── onClick ─▶ setSelectedTeamId(team.id) ─▶ App re-renders
```

- **One source of data.** `src/data/teams.ts` exports a `teams` array. Only
  `App` imports the data itself; the components import just the `Team` type
  and get their data through props.
- **State lives in `App`.** The selected team, search text, sort key and theme
  flag are `useState` hooks in `App`. The child components are presentational
  and have no state of their own.
- **Data flows down, events flow up.** `App` passes a `Team` object to each
  child. `TeamCard` reports clicks through its `onClick` callback, and `App`
  then updates `selectedTeamId`.
- **Derived values are calculated on each render.** `App` works out
  `filteredTeams` and `selectedTeam`. `TeamCard` and `TeamDetail` work out
  goal difference, win rate, the sorted squad and the top scorer/assister.
  Nothing is memoised, which is fine for a dataset this small.
- **Theming uses CSS variables.** `App` adds the `dark-mode` class to
  `<html>` when dark mode is on (the default) and removes it otherwise.
  `index.css` defines the light and dark values of the CSS custom properties,
  and `App.css` uses only those variables, so the whole UI changes theme
  without any component reading the theme.

## Source files

### `src/main.tsx`

- **Purpose:** Entry point. `index.html` loads it with
  `<script type="module" src="/src/main.tsx">`.
- **Exports:** None.
- **Connections:** Imports the global stylesheet `index.css` and the root
  component `App`, then mounts `<App />` inside `<StrictMode>` on the
  `#root` element from `index.html`.

### `src/App.tsx`

- **Purpose:** Root component. It owns all application state and lays out
  the page: a header with the team count and theme toggle, a sidebar with
  search, sort buttons and the team list, and a main panel with the selected
  team's details.
- **Exports:** `default App` (React component, no props). There is also a
  local `SortKey` type (`"points" | "goals" | "name" | "league"`), which is
  not exported.
- **Behaviour:**
  - Search matches the query, case-insensitively, against a team's name,
    league or country.
  - Sorting: `points` and `goals` (goals scored) sort highest first; `name`
    and `league` sort alphabetically.
  - `selectedTeam` falls back to `teams[0]` if the ID is not found. The
    selected team stays in the detail panel even when search hides it from
    the list.
  - A `useEffect` adds or removes the `dark-mode` class on
    `document.documentElement` when `isDarkMode` changes.
- **Connections:** Imports `teams` from `data/teams.ts`, `TeamCard` and
  `TeamDetail` from `components/`, and `App.css`. `main.tsx` renders it.

### `src/components/TeamCard.tsx`

- **Purpose:** A compact, clickable summary of one team for the sidebar
  list: logo, name, league, country, points, and a W/D/L/goal-difference row.
- **Exports:** `TeamCard` (named React component). Props (`TeamCardProps`,
  not exported): `team: Team`, `isSelected: boolean`, `onClick: () => void`.
- **Behaviour:** Renders a `<button>` and adds the `selected` class when
  `isSelected` is true. The left border uses the secondary colour, then the
  primary colour, then `#6CABDD`, skipping any colour that is `#FFFFFF`.
  Goal difference is coloured with the `won`/`lost` classes.
- **Connections:** Imports the `Team` type from `data/teams.ts`. `App`
  renders one per entry in `filteredTeams`. Its styles are in the
  "Team Card" section of `App.css`.

### `src/components/TeamDetail.tsx`

- **Purpose:** The full detail panel for the selected team: a header in the
  team's colours (stadium, capacity, manager, founding year), a season stats
  grid, a win/draw/loss form bar, top scorer and top assister highlights, and
  the squad table.
- **Exports:** `TeamDetail` (named React component). Props
  (`TeamDetailProps`, not exported): `team: Team`.
- **Internal constants:** `positionOrder`, which sorts the squad from GK to
  ST (unknown positions go last), and `positionColors`, which sets the badge
  colour for each position (unknown positions get `#64748b`).
- **Behaviour:** Calculates win rate, goal difference, the sorted squad and
  the top scorer and top assister. It assumes `team.players` is not empty and
  `team.stats.played > 0`.
- **Connections:** Imports the `Team` type from `data/teams.ts`. `App`
  renders it with `selectedTeam`. Player avatars load from the URLs in
  `Player.imageUrl` (ui-avatars.com). Its styles are in the "Team Detail" to
  "Players Table" sections of `App.css`.

### `src/data/teams.ts`

- **Purpose:** The static dataset and its types. This is the app's only data
  source.
- **Exports:**
  - `interface Player`: `id`, `name`, shirt `number`, `position` code,
    `nationality`, `age`, `goals`, `assists`, `imageUrl`.
  - `interface TeamStats`: `played`, `won`, `drawn`, `lost`, `goalsFor`,
    `goalsAgainst`, `points`.
  - `interface Team`: profile fields (`id`, `name`, `shortName`, `country`,
    `league`, `founded`, `stadium`, `stadiumCapacity`, `manager`), display
    fields (`primaryColor`, `secondaryColor`, emoji `logo`), `stats: TeamStats`
    and `players: Player[]`.
  - `const teams: Team[]`: 5 clubs (Real Madrid, Manchester City,
    FC Barcelona, Bayern Munich, PSG). Player IDs are unique across all
    teams.
- **Connections:** `App.tsx` imports `teams`. `TeamCard.tsx` and
  `TeamDetail.tsx` import only the `Team` type. `shortName` is not
  currently used in the UI.

### `src/index.css`

- **Purpose:** Global styles: box-sizing reset, base font, `body`/`#root`
  sizing, and button and heading defaults. It also defines the theme as CSS
  custom properties (`--bg-*`, `--text-*`, `--border*`, `--accent*`, and
  others), with light values on `:root` and dark values on `:root.dark-mode`.
- **Exports:** None (side-effect stylesheet).
- **Connections:** `main.tsx` imports it. `App.css` uses its variables, and
  the `dark-mode` class that `App` toggles switches between them.

### `src/App.css`

- **Purpose:** Styles for each component, in sections: App Layout, Header,
  Theme Toggle Button, Layout, Sidebar, Team Card, Main Content, Team Detail,
  Team Detail Body, Stats Grid, Color helpers (`won`/`drawn`/`lost`), Form
  Bar, Highlights, Players Table, and Responsive (a `max-width: 768px`
  breakpoint).
- **Exports:** None (side-effect stylesheet).
- **Connections:** `App.tsx` imports it. Its class names match the
  `className`s used in `App.tsx`, `TeamCard.tsx` and `TeamDetail.tsx`. Its
  colours come from the variables in `index.css`.

### `src/assets/` (`hero.png`, `react.svg`, `vite.svg`)

- **Purpose:** Image files left over from the Vite React template.
- **Exports:** None.
- **Connections:** Nothing in `src/` imports these files, so they are not
  part of the bundle. The favicon is `public/favicon.svg`, which
  `index.html` links to.
