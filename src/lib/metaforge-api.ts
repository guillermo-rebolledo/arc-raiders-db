/**
 * MetaForge ARC Raiders API Client with Caching
 * Base URL: https://metaforge.app/api/arc-raiders
 */

import { cache, CACHE_TTL } from './cache'

const BASE_URL = 'https://metaforge.app/api/arc-raiders'

// Type definitions based on expected API responses
export interface Item {
  id: string
  name: string
  description?: string
  type?: string
  rarity?: string
  tier?: string
  weight?: number
  value?: number
  icon?: string
  image?: string
  category?: string
  item_type?: string
  components?: Item[]
  [key: string]: unknown
}

// Pagination info from API
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationInfo
}

export interface Arc {
  id: string
  name: string
  description?: string
  location?: string
  difficulty?: string
  loot?: Item[]
  [key: string]: unknown
}

export interface Quest {
  id: string
  name: string
  description?: string
  objectives?: string[]
  requiredItems?: Array<{ item: Item; quantity: number }>
  rewards?: Array<{ item: Item; quantity: number }>
  xp?: number
  [key: string]: unknown
}

// Individual item sold by a trader
export interface TraderItem {
  id: string
  icon: string
  name: string
  value: number
  rarity: string
  item_type: string
  description: string
  trader_price: number
}

// Raw traders response from API (object with trader names as keys)
export interface TradersRawResponse {
  success?: boolean
  data?: Record<string, TraderItem[]>
  [key: string]: unknown
}

// Processed trader with inventory
export interface Trader {
  id: string
  name: string
  inventory: TraderItem[]
}

// Time slot for recurring events
export interface EventTimeSlot {
  start: string // "HH:MM" format in UTC
  end: string // "HH:MM" format in UTC
}

// Raw event data from API
export interface EventTimerRaw {
  game: string
  name: string
  map: string
  icon: string
  description: string
  days: string[]
  times: EventTimeSlot[]
}

// Processed event with calculated status
export interface EventTimer {
  id: string
  name: string
  map: string
  icon: string
  description: string
  times: EventTimeSlot[]
  // Calculated fields
  status: 'active' | 'upcoming' | 'ended'
  currentSlot?: EventTimeSlot
  nextSlot?: EventTimeSlot
  nextStartTime?: Date
  nextEndTime?: Date
  timeUntilStart?: number // milliseconds
  timeUntilEnd?: number // milliseconds
}

export interface MapData {
  id: string
  name: string
  markers?: Array<{
    id: string
    type: string
    x: number
    y: number
    name?: string
  }>
  [key: string]: unknown
}

interface ApiResponse<T> {
  data: T
  fromCache: boolean
  cachedAt?: number
}

/**
 * Extract array data from API response
 * The API may return data in various formats:
 * - Direct array: [...]
 * - Wrapped: { data: [...] }
 * - Named: { items: [...], quests: [...], etc. }
 */
function extractArrayData<T>(response: unknown): T[] {
  // If it's already an array, return it
  if (Array.isArray(response)) {
    return response as T[]
  }

  // If it's an object, try to find the array
  if (response && typeof response === 'object') {
    const obj = response as Record<string, unknown>

    // Common wrapper keys
    const arrayKeys = [
      'data',
      'items',
      'quests',
      'arcs',
      'traders',
      'events',
      'results',
    ]
    for (const key of arrayKeys) {
      if (Array.isArray(obj[key])) {
        return obj[key] as T[]
      }
    }

    // Try to find any array property
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        return value as T[]
      }
    }
  }

  // Return empty array if nothing found
  console.warn('Could not extract array from API response:', response)
  return []
}

/**
 * Generic fetch function with caching
 */
async function fetchWithCache<T>(
  endpoint: string,
  cacheKey: string,
  ttl: number,
  params?: Record<string, string>,
  extractArray = false,
): Promise<ApiResponse<T>> {
  // Check cache first
  const cached = cache.get<{ data: T; cachedAt: number }>(cacheKey)
  if (cached) {
    return {
      data: cached.data,
      fromCache: true,
      cachedAt: cached.cachedAt,
    }
  }

  // Build URL with params
  const url = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value)
    })
  }

  // Fetch from API
  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const rawData = await response.json()

  // Extract array if needed, otherwise use raw data
  const data = extractArray ? (extractArrayData(rawData) as T) : (rawData as T)

  const cachedAt = Date.now()

  // Store in cache
  cache.set(cacheKey, { data, cachedAt }, ttl)

  return {
    data,
    fromCache: false,
    cachedAt,
  }
}

// Response type for paginated items
export interface ItemsApiResponse {
  items: Item[]
  pagination: PaginationInfo | null
  fromCache: boolean
  cachedAt?: number
}

/**
 * Get items with optional filtering and pagination
 */
export async function getItems(params?: {
  type?: string
  rarity?: string
  item_type?: string
  search?: string
  page?: string
  limit?: string
}): Promise<ItemsApiResponse> {
  const cacheKey = `items:${JSON.stringify(params || {})}`

  // Check cache first
  const cached = cache.get<{
    items: Item[]
    pagination: PaginationInfo | null
    cachedAt: number
  }>(cacheKey)
  if (cached) {
    return {
      items: cached.items,
      pagination: cached.pagination,
      fromCache: true,
      cachedAt: cached.cachedAt,
    }
  }

  // Build URL with params
  const url = new URL(`${BASE_URL}/items`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value)
    })
  }

  // Fetch from API
  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const rawData = await response.json()

  // Extract items and pagination
  let items: Item[] = []
  let pagination: PaginationInfo | null = null

  if (rawData && typeof rawData === 'object') {
    // Items can be in 'data' property or directly in the response
    if (Array.isArray(rawData.data)) {
      items = rawData.data
    } else if (Array.isArray(rawData)) {
      items = rawData
    }

    // Extract pagination if present
    if (rawData.pagination && typeof rawData.pagination === 'object') {
      pagination = {
        page: Number(rawData.pagination.page) || 1,
        limit: Number(rawData.pagination.limit) || 50,
        total: Number(rawData.pagination.total) || items.length,
        totalPages: Number(rawData.pagination.totalPages) || 1,
        hasNextPage: Boolean(rawData.pagination.hasNextPage),
        hasPrevPage: Boolean(rawData.pagination.hasPrevPage),
      }
    }
  }

  const cachedAt = Date.now()

  // Store in cache
  cache.set(cacheKey, { items, pagination, cachedAt }, CACHE_TTL.ITEMS)

  return {
    items,
    pagination,
    fromCache: false,
    cachedAt,
  }
}

/**
 * Get a single item by ID
 */
export async function getItem(id: string): Promise<ApiResponse<Item>> {
  const cacheKey = `item:${id}`
  return fetchWithCache<Item>(`/items/${id}`, cacheKey, CACHE_TTL.ITEMS)
}

/**
 * Get all ARCs (missions/activities)
 */
export async function getArcs(params?: {
  includeLoot?: string
}): Promise<ApiResponse<Arc[]>> {
  const cacheKey = `arcs:${JSON.stringify(params || {})}`
  return fetchWithCache<Arc[]>('/arcs', cacheKey, CACHE_TTL.ARCS, params, true)
}

// Response type for paginated quests
export interface QuestsApiResponse {
  quests: Quest[]
  pagination: PaginationInfo | null
  fromCache: boolean
  cachedAt?: number
}

/**
 * Get quests with optional pagination and search
 */
export async function getQuests(params?: {
  page?: string
  limit?: string
  search?: string
}): Promise<QuestsApiResponse> {
  const cacheKey = `quests:${JSON.stringify(params || {})}`

  // Check cache first
  const cached = cache.get<{
    quests: Quest[]
    pagination: PaginationInfo | null
    cachedAt: number
  }>(cacheKey)
  if (cached) {
    return {
      quests: cached.quests,
      pagination: cached.pagination,
      fromCache: true,
      cachedAt: cached.cachedAt,
    }
  }

  // Build URL with params
  const url = new URL(`${BASE_URL}/quests`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value)
    })
  }

  // Fetch from API
  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const rawData = await response.json()

  // Extract quests and pagination
  let quests: Quest[] = []
  let pagination: PaginationInfo | null = null

  if (rawData && typeof rawData === 'object') {
    // Quests can be in 'data' property or directly in the response
    if (Array.isArray(rawData.data)) {
      quests = rawData.data
    } else if (Array.isArray(rawData)) {
      quests = rawData
    }

    // Extract pagination if present
    if (rawData.pagination && typeof rawData.pagination === 'object') {
      pagination = {
        page: Number(rawData.pagination.page) || 1,
        limit: Number(rawData.pagination.limit) || 50,
        total: Number(rawData.pagination.total) || quests.length,
        totalPages: Number(rawData.pagination.totalPages) || 1,
        hasNextPage: Boolean(rawData.pagination.hasNextPage),
        hasPrevPage: Boolean(rawData.pagination.hasPrevPage),
      }
    }
  }

  const cachedAt = Date.now()

  // Store in cache
  cache.set(cacheKey, { quests, pagination, cachedAt }, CACHE_TTL.QUESTS)

  return {
    quests,
    pagination,
    fromCache: false,
    cachedAt,
  }
}

/**
 * Get all traders and their inventories
 * The API returns { success: true, data: { "TraderName": [...items] } }
 * We transform this into an array of Trader objects
 */
export async function getTraders(): Promise<ApiResponse<Trader[]>> {
  const cacheKey = 'traders:all'

  // Check cache first
  const cached = cache.get<{ data: Trader[]; cachedAt: number }>(cacheKey)
  if (cached) {
    return {
      data: cached.data,
      fromCache: true,
      cachedAt: cached.cachedAt,
    }
  }

  // Fetch from API
  const response = await fetch(`${BASE_URL}/traders`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const rawData = await response.json()

  // Transform the response into an array of Traders
  // API returns: { success: true, data: { "Apollo": [...], "Celeste": [...], ... } }
  const traders: Trader[] = []

  // Extract the traders object - it's under rawData.data
  let tradersObject: Record<string, unknown> | null = null

  if (rawData && typeof rawData === 'object') {
    // Check if data property exists and is an object (not an array)
    if (
      rawData.data &&
      typeof rawData.data === 'object' &&
      !Array.isArray(rawData.data)
    ) {
      tradersObject = rawData.data as Record<string, unknown>
    } else if (!rawData.success && !rawData.data) {
      // Maybe the response IS the traders object directly
      tradersObject = rawData as Record<string, unknown>
    }
  }

  if (tradersObject) {
    for (const [key, value] of Object.entries(tradersObject)) {
      // Skip non-array values (like 'success: true' if it somehow got here)
      if (!Array.isArray(value)) continue

      // Each key is a trader name, value is array of items
      traders.push({
        id: key.toLowerCase().replace(/\s+/g, '-'),
        name: key,
        inventory: value as TraderItem[],
      })
    }
  }

  // Sort traders alphabetically
  traders.sort((a, b) => a.name.localeCompare(b.name))

  const cachedAt = Date.now()

  // Only cache if we got results - don't cache empty responses
  if (traders.length > 0) {
    cache.set(cacheKey, { data: traders, cachedAt }, CACHE_TTL.TRADERS)
  }

  return {
    data: traders,
    fromCache: false,
    cachedAt,
  }
}

/**
 * Get event timers
 */
export async function getEventTimers(params?: {
  type?: string
  status?: string
}): Promise<ApiResponse<EventTimer[]>> {
  const cacheKey = `events:${JSON.stringify(params || {})}`
  return fetchWithCache<EventTimer[]>(
    '/event-timers',
    cacheKey,
    CACHE_TTL.EVENT_TIMERS,
    params,
    true,
  )
}

/**
 * Get map data
 */
export async function getMapData(mapId: string): Promise<ApiResponse<MapData>> {
  const cacheKey = `map:${mapId}`
  // Note: Map data uses a different endpoint structure
  return fetchWithCache<MapData>(
    `/game-map-data?map=${mapId}`,
    cacheKey,
    CACHE_TTL.MAPS,
  )
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return cache.stats()
}

/**
 * Clear all cache
 */
export function clearCache() {
  cache.clear()
}
