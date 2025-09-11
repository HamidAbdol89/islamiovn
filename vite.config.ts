import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // port server backend của bạn
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'injectManifest', // dùng SW tùy chỉnh
      srcDir: 'public',             // thư mục chứa service-worker.js
      filename: 'service-worker.js', // tên file SW
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon-96x96.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'prayer-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: "Muslim Việt",
        short_name: "Muslim Việt",
        description: "Ứng dụng toàn diện cho cộng đồng Hồi giáo Việt Nam",
        lang: "vi",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#0c7356",
        icons: [
          { src: "icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
          { src: "icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
          { src: "icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
          { src: "icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ],
        shortcuts: [
          {
            name: "Lịch Cầu Nguyện",
            short_name: "Prayers",
            description: "Xem lịch cầu nguyện hôm nay",
            url: "/prayers",
            icons: [{ src: "icons/prayer-shortcut.png", sizes: "96x96" }]
          },
          {
            name: "Qiblah",
            short_name: "Qiblah",
            description: "Tìm hướng Qiblah",
            url: "/qiblah",
            icons: [{ src: "icons/qiblah-shortcut.png", sizes: "96x96" }]
          },
          {
            name: "Tasbih",
            short_name: "Tasbih",
            description: "Đếm Tasbih",
            url: "/tasbih",
            icons: [{ src: "icons/tasbih-shortcut.png", sizes: "96x96" }]
          }
        ],
        prefer_related_applications: false
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
