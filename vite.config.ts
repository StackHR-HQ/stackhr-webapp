import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL

  // The backend sends no CORS headers for localhost, so dev requests go through this proxy
  let proxy: Record<string, object> | undefined
  if (apiBaseUrl && /^https?:\/\//.test(apiBaseUrl)) {
    const { origin, pathname } = new URL(apiBaseUrl)
    proxy = {
      [pathname]: {
        target: origin,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
      },
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
  }
})
