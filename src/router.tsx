import { createRouter, Link } from '@tanstack/react-router'
import { FileQuestion, Home } from 'lucide-react'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { createQueryClient } from './lib/query-client'

// Default 404 component for router-level fallback
function DefaultNotFoundComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-zinc-500/20 blur-xl rounded-full" />
        <FileQuestion className="relative h-16 w-16 text-zinc-500" />
      </div>
      <h1
        className="text-4xl font-bold text-zinc-100 mt-6 mb-2"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        404 - Page Not Found
      </h1>
      <p className="text-zinc-400 mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold rounded-lg transition-all"
      >
        <Home className="h-4 w-4" />
        Go Home
      </Link>
    </div>
  )
}

// Create a new router instance with TanStack Query integration
export const getRouter = () => {
  const queryClient = createQueryClient()

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: DefaultNotFoundComponent,
    context: {
      queryClient,
    },
  })

  return router
}

// Type declaration for router context
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
