# Soccer Teams

A React + TypeScript + Vite app for browsing top European club statistics. It
shows a searchable, filterable, and sortable sidebar of teams alongside a
detailed view of the selected team.

## Getting started

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # type-check (tsc -b) and build for production (vite build)
npm run lint     # run oxlint
npm run preview  # preview the production build
```

From the repository root you can also use the `mise` tasks:

```bash
mise run dev
mise run build
mise run lint
```

## Browsing and filtering teams

The sidebar provides several ways to narrow down the team list:

- **Search** — free-text search across team name, league, and country
  (case-insensitive).
- **Country filter** — an accessible native `<select>` dropdown with an
  **"All countries"** default. The available countries are derived from the
  team data (de-duplicated and alphabetically sorted).
- **Sort** — reorder the results by points, goals, name, or league.

Search, country, and sort are combined: results must match the search query and
the selected country before being sorted.

### Active-filter summary

When any filter is active, a compact summary appears below the controls:

- A live-updating result count (e.g. "3 teams") announced to screen readers via
  `aria-live="polite"`.
- Removable chips for the active country and search filters. Each chip has an
  accessible label and a `×` button to clear just that filter.
- A **Clear all** button to reset every filter at once.

### Keyboard accessibility

- The country dropdown has an associated `<label>` and an explicit
  `aria-label`, so it is announced correctly by screen readers.
- The native `<select>` is keyboard-operable by default; pressing **Escape**
  while it is focused resets it to "All countries".
- Filter chip remove buttons and the "Clear all" button are focusable and show
  a visible focus ring (`:focus-visible`).

## Filter logic

The pure query/filter helpers live in `src/utils/teamQuery.ts`:

- `ALL_COUNTRIES` — sentinel value for the "All countries" option.
- `getCountries(teams)` — sorted, de-duplicated list of countries.
- `matchesSearch(team, query)` / `matchesCountry(team, country)` — predicate
  helpers.
- `compareTeams(a, b, sortKey)` — comparator for the supported sort keys.
- `queryTeams(teams, searchQuery, sortKey, country?)` — filters by search and
  country, then sorts. `country` is optional and defaults to `ALL_COUNTRIES`.

## Project structure

```
src/
  App.tsx              # top-level layout, filter state, and sidebar
  App.css              # styling (dark slate palette)
  components/          # TeamCard, TeamDetail, etc.
  data/teams.ts        # static team dataset and types
  utils/teamQuery.ts   # pure search / filter / sort helpers
```
