import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import { VitePWA } from 'vite-plugin-pwa'

import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'apple-touch-icon-precomposed.png',
        'Logo Trường Đại học Greenwich Việt Nam.svg',
        'pwa-192x192.png',
        'pwa-180x180.png',
        'pwa-512x512.png'
      ],
      manifest: {
        name: 'Greenwich Ceremony Registration',
        short_name: 'Greenwich Ceremony',
        description: 'Greenwich Vietnam Graduation Ceremony Registration',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-180x180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: false, // Disable PWA in dev to bypass SSL script fetch errors
        type: 'module',
        suppressWarnings: true,
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Listen on all network interfaces
    strictPort: true, // Ensuring port 3000 is always used
    hmr: {
      host: 'khuong.local', // Target the mDNS hostname
      clientPort: 3000,
      protocol: 'wss',
    },
    https: true, // Use the basic-ssl plugin certificates
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5000',
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
