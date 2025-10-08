import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Determine the base path based on environment
  let base = '/'
  
  if (mode === 'production') {
    // For GitHub Pages, use the repository name as base path
    base = process.env.VITE_BASE_PATH || '/sip-vibe-meme/'
  }
  
  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  }
})