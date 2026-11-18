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

## Troubleshooting

- `tsc: not found` or `oxlint: not found`: dependencies are not installed. Run `npm install` (or `npm ci`) inside `soccer-app/`.
- Wrong Node.js version or engine errors: run `mise install` from the repository root to get Node.js 24, then check with `node --version`.
- Port 5173 already in use: stop the other process, or run `npm run dev -- --port 5174` and open the URL Vite prints.

## Reference

- [GitHub Hello World quickstart](https://docs.github.com/en/get-started/quickstart/hello-world)

Last verified: 2026-11-18
