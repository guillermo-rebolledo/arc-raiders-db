/**
 * TanStack Query hooks for ARC Raiders API
 */

import { useQuery, useSuspenseQuery, useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from './query-client'
import {
  fetchItems,
  fetchQuests,
  fetchTraders,
  fetchEventTimers,
  fetchArcs,
} from './server-api'

// Types for filters
interface ItemFilters {
  type?: string
  rarity?: string
  item_type?: string
  search?: string
  page?: number
  limit?: number
}

/**
 * Hook to fetch items with optional filters and pagination
 */
export function useItems(filters: ItemFilters = {}) {
  const { page = 1, limit = 50, ...otherFilters } = filters

  return useQuery({
    queryKey: queryKeys.items.list({ ...otherFilters, page, limit }),
    queryFn: async () => {
      const result = await fetchItems({
        data: {
          ...otherFilters,
          page: String(page),
          limit: String(limit),
        },
      })
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch items')
      }
      return result
    },
  })
}

/**
 * Hook to fetch items with infinite scrolling/load more
 */
export function useItemsInfinite(filters: Omit<ItemFilters, 'page'> = {}) {
  const { limit = 50, ...otherFilters } = filters

  return useInfiniteQuery({
    queryKey: ['arc-raiders', 'items', 'infinite', { ...otherFilters, limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchItems({
        data: {
          ...otherFilters,
          page: String(pageParam),
          limit: String(limit),
        },
      })
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch items')
      }
      return result
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNextPage) {
        return (lastPage.pagination.page || 1) + 1
      }
      return undefined
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.pagination?.hasPrevPage) {
        return (firstPage.pagination.page || 1) - 1
      }
      return undefined
    },
  })
}

/**
 * Suspense version of useItems for use with React Suspense
 */
export function useItemsSuspense(filters: ItemFilters = {}) {
  const { page = 1, limit = 50, ...otherFilters } = filters

  return useSuspenseQuery({
    queryKey: queryKeys.items.list({ ...otherFilters, page, limit }),
    queryFn: async () => {
      const result = await fetchItems({
        data: {
          ...otherFilters,
          page: String(page),
          limit: String(limit),
        },
      })
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch items')
      }
      return result
    },
  })
}

// Types for quest filters
interface QuestFilters {
  trader?: string
  page?: number
  limit?: number
}

/**
 * Hook to fetch quests with optional filters and pagination
 */
export function useQuests(filters: QuestFilters = {}) {
  const { page = 1, limit = 50, ...otherFilters } = filters

  return useQuery({
    queryKey: queryKeys.quests.list({ ...otherFilters, page, limit }),
    queryFn: async () => {
      const result = await fetchQuests({
        data: {
          ...otherFilters,
          page: String(page),
          limit: String(limit),
        },
      })
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch quests')
      }
      return result
    },
  })
}

/**
 * Hook to fetch traders
 */
export function useTraders() {
  return useQuery({
    queryKey: queryKeys.traders.list(),
    queryFn: async () => {
      const result = await fetchTraders()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch traders')
      }
      return result
    },
  })
}

/**
 * Hook to fetch raw event timers (for processing on client)
 */
export function useEventTimersRaw() {
  return useQuery({
    queryKey: queryKeys.events.list(),
    queryFn: async () => {
      const result = await fetchEventTimers()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch events')
      }
      return result
    },
    // Events need fresher data, refetch more often
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

/**
 * Hook to fetch ARCs
 */
export function useArcs() {
  return useQuery({
    queryKey: queryKeys.arcs.list(),
    queryFn: async () => {
      const result = await fetchArcs()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch ARCs')
      }
      return result
    },
  })
}

