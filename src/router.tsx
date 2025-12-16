import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { createQueryClient } from './lib/query-client'

// Create a new router instance with TanStack Query integration
export const getRouter = () => {
  const queryClient = createQueryClient()

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
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
