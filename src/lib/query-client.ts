import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Keep unused data in cache for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Retry failed requests up to 2 times
        retry: 2,
        // Don't refetch on window focus in development
        refetchOnWindowFocus: import.meta.env.PROD,
      },
    },
  })
}

// Query keys factory for type-safe query keys
export const queryKeys = {
  all: ['arc-raiders'] as const,

  items: {
    all: ['arc-raiders', 'items'] as const,
    list: (filters?: {
      type?: string
      rarity?: string
      category?: string
      search?: string
      page?: number
      limit?: number
    }) => ['arc-raiders', 'items', 'list', filters] as const,
    detail: (id: string) => ['arc-raiders', 'items', 'detail', id] as const,
  },

  quests: {
    all: ['arc-raiders', 'quests'] as const,
    list: (filters?: { trader?: string; page?: number; limit?: number }) =>
      ['arc-raiders', 'quests', 'list', filters] as const,
  },

  traders: {
    all: ['arc-raiders', 'traders'] as const,
    list: () => ['arc-raiders', 'traders', 'list'] as const,
  },

  events: {
    all: ['arc-raiders', 'events'] as const,
    list: () => ['arc-raiders', 'events', 'list'] as const,
  },

  arcs: {
    all: ['arc-raiders', 'arcs'] as const,
    list: () => ['arc-raiders', 'arcs', 'list'] as const,
  },
}
