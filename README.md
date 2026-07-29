# Soccer Teams ⚽

A React + TypeScript web application that displays statistics and squad information for top European soccer clubs.

## Features

- **Team browser** — browse 5 top European clubs (Real Madrid, Manchester City, FC Barcelona, Bayern Munich, PSG)
- **Search & filter** — filter teams by name, league, or country
- **Sort controls** — sort teams by points, goals, name, or league
- **Team details** — view full squad roster with player stats (goals, assists, nationality, age)
- **Player images** — real player photos where available, avatar fallbacks for others

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | [React 19](https://react.dev/) |
| Language | [TypeScript 6](https://www.typescriptlang.org/) |
| Build Tool | [Vite 8](https://vite.dev/) |
| Linter | [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) |
| Runtime | Node 24 (via [mise](https://mise.jdx.dev/)) |

## Getting Started

### Prerequisites

- [mise](https://mise.jdx.dev/) — manages the correct Node version automatically

### Install & run

```bash
# Install the correct Node version and project dependencies
mise install
cd soccer-app && npm install

# Start the development server (http://localhost:5173)
mise run dev
```

### Build

```bash
mise run build
```

### Lint

```bash
mise run lint
```

## Project Structure

```
.
├── README.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTORS.md
├── mise.toml              # Task runner & tool versions
└── soccer-app/            # Main application
    ├── src/
    │   ├── App.tsx        # Root component (search, sort, layout)
    │   ├── components/
    │   │   ├── TeamCard.tsx    # Sidebar team card
    │   │   └── TeamDetail.tsx  # Main panel with stats & squad
    │   └── data/
    │       └── teams.ts   # Team & player data (interfaces + fixtures)
    └── public/
        ├── harry-kane.jpeg
        └── raphinha.jpeg
```

## Contributing

Contributions are welcome! Please open a pull request and add yourself to [CONTRIBUTORS.md](./CONTRIBUTORS.md).
