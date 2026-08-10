# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Features

### Team insights panel

Each team's detail view opens with a compact **Team Insights** panel that
summarises the selected team's form at a glance. It reuses the shared team
metric helpers to show:

- **Goal difference** — with a plain-text trend tag (Positive / Even /
  Negative) alongside goals scored and conceded.
- **Win rate** — as a percentage of matches played.
- **Performance label** — a qualitative rating (Elite / Strong / Average /
  Struggling) derived from the win rate.

The panel uses semantic headings and a description list, conveys meaning
through text (not colour alone), and collapses to a single column on narrow
screens.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Shared team metrics

Team statistics are derived through a single set of shared helpers in
[`src/utils/teamMetrics.ts`](src/utils/teamMetrics.ts) so that every view renders
consistent numbers instead of duplicating inline calculations.

- `goalDifference(stats)` — goals scored minus goals conceded (signed).
- `winRate(stats)` — win rate as a fraction in the range `[0, 1]`, returning `0`
  when no matches have been played (avoids division by zero).
- `performanceLabel(stats)` — a concise label (`"Elite"`, `"Strong"`,
  `"Average"`, or `"Struggling"`) derived from the win rate.

Components such as `TeamCard` and `TeamDetail` import these helpers rather than
recomputing the formulas locally. When adding a new team statistic, extend
`teamMetrics.ts` so the logic stays centralized and testable.
