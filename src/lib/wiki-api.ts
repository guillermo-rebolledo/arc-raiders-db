/**
 * Wiki Data Source for ARC Raiders
 * Fetches data from: https://github.com/wangyz1999/arcforge
 * Data sourced from arcraiders.wiki
 */

import { cache } from './cache'

const DATA_BASE_URL =
  'https://raw.githubusercontent.com/wangyz1999/arcforge/main/data'

// Cache TTLs (in milliseconds)
const CACHE_TTL = {
  ITEMS: 60 * 60 * 1000, // 1 hour
  TRADERS: 30 * 60 * 1000, // 30 minutes
}

// ============ Types ============

export interface Item {
  name: string
  wiki_url?: string
  source_url?: string
  image_urls?: {
    thumb?: string
    original?: string
  }
  infobox?: {
    name?: string
    image?: string
    rarity?: string
    quote?: string
    type?: string
    location?: string
    weight?: number
    sellprice?: number
    stacksize?: number
    shield?: number | null
    usetime?: string | null
    healing?: string
    duration?: string
    radius?: string | null
    special_types?: string[]
  }
  sources?: string[]
  crafting?: Array<{
    recipe?: Array<{ quantity?: number; item: string }>
    workshop?: string
    output_quantity?: number
  }>
  recycling?: {
    recycling?: Array<{ materials: Array<{ quantity: number; item: string }> }>
    salvaging?: Array<{ materials: Array<{ quantity: number; item: string }> }>
  }
}

export interface ShopItem {
  name: string
  price: number
  currency: string
  stock?: string
  is_limited?: boolean
}

export interface Trader {
  name: string
  wiki_url?: string
  source_url?: string
  image_filename?: string
  image_urls?: {
    thumb?: string
    original?: string
  }
  shop: ShopItem[]
}

export interface ApiResponse<T> {
  data: T
  fromCache: boolean
  cachedAt?: number
}

// ============ Fetch with Cache ============

async function fetchWithCache<T>(
  endpoint: string,
  cacheKey: string,
  ttl: number,
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

  // Fetch from data source
  const response = await fetch(`${DATA_BASE_URL}/${endpoint}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as T
  const cachedAt = Date.now()

  // Store in cache
  cache.set(cacheKey, { data, cachedAt }, ttl)

  return {
    data,
    fromCache: false,
    cachedAt,
  }
}

// ============ API Functions ============

/**
 * Get all items
 */
export async function getItems(): Promise<ApiResponse<Item[]>> {
  return fetchWithCache<Item[]>(
    'items_database.json',
    'wiki:items',
    CACHE_TTL.ITEMS,
  )
}

/**
 * Get all traders
 */
export async function getTraders(): Promise<ApiResponse<Trader[]>> {
  return fetchWithCache<Trader[]>(
    'traders_database.json',
    'wiki:traders',
    CACHE_TTL.TRADERS,
  )
}

/**
 * Get all ARCs
 */
// ============ Cache Management ============

export function getCacheStats() {
  return cache.getStats()
}

export function clearCache() {
  cache.clear()
}
