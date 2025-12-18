/**
 * Server functions for ARC Raiders API
 * Data sourced from wiki JSON for items and traders
 * Quests, ARCs, and event timers use MetaForge API
 */

import { createServerFn } from '@tanstack/react-start'
import {
  getItems,
  getTraders,
  getCacheStats,
  clearCache,
  type Item,
  type Trader,
} from './wiki-api'
import {
  getArcs,
  getQuests,
  getEventTimers,
  type Arc,
  type Quest,
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

/**
 * Extract rarity from item - rarity is in infobox.rarity
 */
function getItemRarity(item: Item): string | undefined {
  return item.infobox?.rarity
}

// Server function to fetch items (with client-side filtering/pagination)
export const fetchItems = createServerFn({ method: 'GET' })
  .inputValidator(
    (params: {
      search?: string
      rarity?: string
      page?: string
      limit?: string
    }) => params,
  )
  .handler(async ({ data }) => {
    try {
      const result = await getItems()
      let items = ensureArray<Item>(result.data)

      // Apply search filter
      if (data.search) {
        const searchLower = data.search.toLowerCase()
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchLower) ||
            item.infobox?.quote?.toLowerCase().includes(searchLower) ||
            item.infobox?.type?.toLowerCase().includes(searchLower),
        )
      }

      // Apply rarity filter
      if (data.rarity) {
        const rarityLower = data.rarity.toLowerCase()
        items = items.filter((item) => {
          const itemRarity = getItemRarity(item)
          return itemRarity?.toLowerCase() === rarityLower
        })
      }

      // Calculate pagination
      const page = parseInt(data.page || '1', 10)
      const limit = parseInt(data.limit || '50', 10)
      const total = items.length
      const totalPages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const paginatedItems = items.slice(startIndex, startIndex + limit)

      return {
        success: true as const,
        items: paginatedItems,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        fromCache: result.fromCache,
        cachedAt: result.cachedAt,
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Unknown error',
        items: [] as Item[],
        pagination: null,
      }
    }
  })

// Server function to fetch ARCs
export const fetchArcs = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const result = await getArcs()
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

// Server function to fetch quests (uses MetaForge API with pagination/search)
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

// Server function to fetch event timers (still from MetaForge - real-time data)
export const fetchEventTimers = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const result = await getEventTimers()
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
