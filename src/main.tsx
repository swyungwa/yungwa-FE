import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_TOKEN
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (posthogToken) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: '2026-01-30',
    autocapture: false,
    capture_pageview: true,
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)