import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '../components/Layout'
import { UmamiAnalytics } from '../components/Analytics'

import appCss from '../styles.css?url'

// Root route with query client context
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'ARC Raiders Wiki - Community Database' },
        {
          name: 'description',
          content:
            'Community-driven wiki and database for ARC Raiders. Find items, quests, traders, ARCs, and live event timers. Your ultimate guide to surviving the ARC.',
        },
        // SEO keywords
        {
          name: 'keywords',
          content:
            'ARC Raiders, wiki, database, items, quests, traders, events, guide, game wiki, ARCs, loot',
        },
        // Open Graph (Facebook, Discord, etc.)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'ARC Raiders Wiki' },
        {
          property: 'og:title',
          content: 'ARC Raiders Wiki - Community Database',
        },
        {
          property: 'og:description',
          content:
            'Community-driven wiki and database for ARC Raiders. Find items, quests, traders, and event timers.',
        },
        { property: 'og:locale', content: 'en_US' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'ARC Raiders Wiki - Community Database',
        },
        {
          name: 'twitter:description',
          content:
            'Community-driven wiki and database for ARC Raiders. Find items, quests, traders, and event timers.',
        },
        // Additional SEO
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'ARC Raiders Community' },
        { name: 'theme-color', content: '#18181b' },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap',
        },
        // Favicon (you should add these files to public/)
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    }),

    component: RootComponent,
    shellComponent: RootDocument,
  },
)

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <UmamiAnalytics />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
