import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemapPlugin from 'vite-plugin-sitemap'

const siteUrl = 'https://www.sgbvehiclefinance.com'
const publicRoutes = [
  '/',
  '/about',
  '/services',
  '/contact',
  '/emi-calculator',
  '/privacy-policy',
  '/terms',
]

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Ensure deep-link refresh works with BrowserRouter (history API).
  // Without SPA fallback, refreshing routes like /user can return 404.
  appType: 'spa',
  plugins: [
    react(),
    command === 'build' &&
      sitemapPlugin({
        hostname: siteUrl,
        dynamicRoutes: publicRoutes,
        exclude: [
          '/login',
          '/signup',
          '/user-forgot-password',
          '/reset-user-password',
          '/admin-createaccount',
          '/admin-signin',
          '/admin-createaccount-otp',
          '/admin-login-otp',
          '/admin-forgot-password',
          '/reset-admin-password',
          '/admin',
          '/subadmin',
          '/subadmin/*',
          '/user',
          '/user/*',
        ],
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date(),
        readable: true,
        generateRobotsTxt: true,
        robots: [
          {
            userAgent: '*',
            allow: '/',
          },
        ],
      }),
  ].filter(Boolean),
  server: {
    host: true,   // 👈 allows access from other devices
    port: 5173    // optional
  }
}))
