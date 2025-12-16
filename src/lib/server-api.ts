/**
 * Server functions for ARC Raiders API
 * These wrap the MetaForge API with caching
 */

import { createServerFn } from '@tanstack/react-start'
import {
  getItems,
  getArcs,
  getQuests,
  getTraders,
  getEventTimers,
  getCacheStats,
  clearCache,
  type Item,
  type Arc,
  type Quest,
  type Trader,
  type EventTimerRaw,
  type PaginationInfo,
} from './metaforge-api'

/**
 * Ensure data is an array, with fallback to empty array
 */
function ensureArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data
  return []
}

// Server function to fetch items with pagination
export const fetchItems = createServerFn({ method: 'GET' })
  .inputValidator(
    (params: {
      type?: string
      rarity?: string
      item_type?: string
      search?: string
      page?: string
      limit?: string
    }) => params,
  )
  .handler(async ({ data }) => {
    try {
      const result = await getItems(data)
      return {
        success: true as const,
        items: ensureArray<Item>(result.items),
        pagination: result.pagination,
        fromCache: result.fromCache,
        cachedAt: result.cachedAt,
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Unknown error',
        items: [] as Item[],
        pagination: null as PaginationInfo | null,
      }
    }
  })

// Server function to fetch ARCs
export const fetchArcs = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const result = await getArcs({ includeLoot: 'true' })
    return {
      success: true as const,
      arcs: ensureArray<Arc>(result.data),
      fromCache: result.fromCache,
      cachedAt: result.cachedAt,
    }
  } catch (error) {
    console.error('Error fetching arcs:', error)
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Unknown error',
      arcs: [] as Arc[],
    }
  }
})

// Server function to fetch quests with pagination and search
export const fetchQuests = createServerFn({ method: 'GET' })
  .inputValidator(
    (params: { page?: string; limit?: string; search?: string }) => params,
  )
  .handler(async ({ data }) => {
    try {
      const result = await getQuests(data)
      return {
        success: true as const,
        quests: ensureArray<Quest>(result.quests),
        pagination: result.pagination,
        fromCache: result.fromCache,
        cachedAt: result.cachedAt,
      }
    } catch (error) {
      console.error('Error fetching quests:', error)
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Unknown error',
        quests: [] as Quest[],
        pagination: null as PaginationInfo | null,
      }
    }
  })

// Server function to fetch traders
export const fetchTraders = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const result = await getTraders()
      return {
        success: true as const,
        traders: ensureArray<Trader>(result.data),
        fromCache: result.fromCache,
        cachedAt: result.cachedAt,
      }
    } catch (error) {
      console.error('Error fetching traders:', error)
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Unknown error',
        traders: [] as Trader[],
      }
    }
  },
)

// Server function to fetch event timers (returns raw data, processing happens client-side)
export const fetchEventTimers = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const result = await getEventTimers()
      // Return raw events - processing is done client-side to calculate real-time status
      return {
        success: true as const,
        events: ensureArray<EventTimerRaw>(result.data),
        fromCache: result.fromCache,
        cachedAt: result.cachedAt,
      }
    } catch (error) {
      console.error('Error fetching event timers:', error)
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Unknown error',
        events: [] as EventTimerRaw[],
      }
    }
  },
)

// Server function to get cache stats
export const fetchCacheStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getCacheStats()
  },
)

// Server function to clear cache
export const clearApiCache = createServerFn({ method: 'POST' }).handler(
  async () => {
    clearCache()
    return { success: true, message: 'Cache cleared' }
  },
)
