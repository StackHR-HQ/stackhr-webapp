import { isAxiosError } from 'axios'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { useAuthStore } from './features/auth/store/auth-store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A 4xx (e.g. a role without access) won't change on retry.
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        return !(status && status >= 400 && status < 500) && failureCount < 3
      },
    },
  },
})

useAuthStore.subscribe((state, previous) => {
  if (state.user?.id !== previous.user?.id) queryClient.clear()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
