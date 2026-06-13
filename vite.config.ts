import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/receipt-scanner-expense/',
  build: { outDir: 'dist' }
})
