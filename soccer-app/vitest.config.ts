import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Vitest configuration. Kept separate from vite.config.ts because the root
// project uses Vite 8 (rolldown) while Vitest bundles Vite 7, and mixing the
// two plugin types in a single config trips up `tsc -b`.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
