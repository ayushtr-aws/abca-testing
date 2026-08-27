# abca-testing

A sandbox repository used for testing automation, integrations, and coding workflows. The primary project in this repository is **Soccer Teams**, a small React + TypeScript single-page application for browsing top European club statistics.

## Repository structure

| Path | Description |
|------|-------------|
| [`soccer-app/`](./soccer-app) | React + TypeScript + Vite application for browsing soccer team statistics. |
| [`mise.toml`](./mise.toml) | [mise](https://mise.jdx.dev/) task and tool configuration (Node version, build/lint/dev tasks). |
| [`.mcp.json`](./.mcp.json) | Model Context Protocol server configuration (Jira integration). |
| [`CONTRIBUTORS.md`](./CONTRIBUTORS.md) | List of project contributors. |
| [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) | Community code of conduct. |

## Soccer Teams app

The `soccer-app` is a client-side web app that displays statistics for top European soccer clubs. Features include:

- **Team directory** — browse a list of clubs with their leagues, countries, and key stats.
- **Search** — filter teams by name, league, or country.
- **Sorting** — sort the list by points, goals, name, or league.
- **Team detail view** — see squad information, player images, and detailed stats for the selected team.
- **Light / dark mode** — toggle between themes (light mode is the default).

### Tech stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for bundling and the dev server
- [Oxlint](https://oxc.rs/) for linting

## Getting started

This repository uses [mise](https://mise.jdx.dev/) to manage the Node.js toolchain and common tasks.

### Prerequisites

- [mise](https://mise.jdx.dev/getting-started.html) (recommended), or Node.js 24+

### Install

```bash
# Install the pinned Node version and dependencies
mise install
cd soccer-app
npm install
```

### Common tasks

Run these from the repository root using mise:

```bash
mise run dev     # Start the Vite development server
mise run build   # Type-check and build the app for production
mise run lint    # Lint the app with Oxlint
```

Or run the underlying npm scripts directly from the `soccer-app` directory:

```bash
cd soccer-app
npm run dev
npm run build
npm run lint
npm run preview  # Preview the production build locally
```

## Contributing

Contributions are welcome! See [`CONTRIBUTORS.md`](./CONTRIBUTORS.md) for the list of contributors and please review the [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) before participating.
