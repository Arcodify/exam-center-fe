import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import * as path from 'path'; // Not needed in Vite config for aliasing

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
})
