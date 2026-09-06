import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// `@` points at /src so imports stay short and don't turn into ../../../ chains.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Open the browser automatically when `npm run dev` starts.
    open: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
