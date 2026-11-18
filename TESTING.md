# Testing

How to run the soccer-app locally.

## Prerequisites

- Node.js 24 (the version pinned in `mise.toml`; run `mise install` to get it)
- npm (included with Node.js)
- Git, to clone the repository

## Running locally

From the repository root, run:

```bash
cd soccer-app && npm install && npm run dev
```

Then open the URL that Vite prints (usually http://localhost:5173) in your browser.

## Project layout

Top-level contents of `soccer-app/src/`:

- `main.tsx`: entry point. Mounts `<App />` into the `#root` element inside `StrictMode` and imports the global `index.css`.
- `App.tsx`: root component. Holds the selected team, search, sort, and dark mode state. Renders the header, the sidebar team list, and the detail panel.
- `App.css`: styles for the app layout, including the header, sidebar, search and sort controls, and the team list.
- `index.css`: global styles and theme variables (CSS custom properties) for light mode and the `dark-mode` class.
- `components/`: presentational React components. `TeamCard.tsx` is one clickable team row in the sidebar. `TeamDetail.tsx` is the detail panel for the selected team, with its squad sorted by position.
- `data/`: static data. `teams.ts` defines the `Player`, `TeamStats`, and `Team` types and exports the `teams` array the app shows.
- `assets/`: static images (`hero.png`, `react.svg`, `vite.svg`) from the Vite template. Nothing in `src/` imports them at the moment.

## Common commands

Run these from inside `soccer-app/`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Vite dev server with hot reload (usually http://localhost:5173). |
| `npm run build` | Type-checks with `tsc -b`, then builds a production bundle into `dist/` with `vite build`. |
| `npm run lint` | Lints the source with oxlint. |
| `npm run preview` | Serves the production build from `dist/` locally so you can check it (run `npm run build` first). |

## Troubleshooting

- `tsc: not found` or `oxlint: not found`: dependencies are not installed. Run `npm install` (or `npm ci`) inside `soccer-app/`.
- Wrong Node.js version or engine errors: run `mise install` from the repository root to get Node.js 24, then check with `node --version`.
- Port 5173 already in use: stop the other process, or run `npm run dev -- --port 5174` and open the URL Vite prints.

## Reference

- [GitHub Hello World quickstart](https://docs.github.com/en/get-started/quickstart/hello-world)

Last verified: 2026-11-18
