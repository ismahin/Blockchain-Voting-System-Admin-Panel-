import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Blockchain-Voting-System-Admin-Panel-/', // 👈 important! 
  plugins: [react()]
})
