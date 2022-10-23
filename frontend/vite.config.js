import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@components', replacement: resolve(__dirname, 'src', 'components') },
      { find: '@services', replacement: resolve(__dirname, 'src', 'services') },
      { find: '@store', replacement: resolve(__dirname, 'src', 'store') },
      { find: '@utils', replacement: resolve(__dirname, 'src', 'utils') },
      { find: '@views', replacement: resolve(__dirname, 'src', 'views') },
    ],
  }
})
