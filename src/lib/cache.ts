/**
 * Simple in-memory cache with TTL support
 * This cache persists across requests in development and production
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map()

  /**
   * Get a value from cache
   * Returns undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      return undefined
    }

    const now = Date.now()
    const isExpired = now - entry.timestamp > entry.ttl

    if (isExpired) {
      this.cache.delete(key)
      return undefined
    }

    return entry.data
  }

  /**
   * Set a value in cache with TTL (in milliseconds)
   */
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  /**
   * Delete a specific key
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    // Clean up expired entries first
    for (const [key] of this.cache) {
      this.get(key) // This will delete expired entries
    }

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Singleton instance
export const cache = new MemoryCache()

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  // Items don't change often - cache for 1 hour
  ITEMS: 60 * 60 * 1000,
  // Quests are relatively static - cache for 1 hour
  QUESTS: 60 * 60 * 1000,
  // ARCs are relatively static - cache for 1 hour
  ARCS: 60 * 60 * 1000,
  // Traders might update more frequently - cache for 30 minutes
  TRADERS: 30 * 60 * 1000,
  // Event timers need fresher data - cache for 5 minutes
  EVENT_TIMERS: 5 * 60 * 1000,
  // Map data is static - cache for 2 hours
  MAPS: 2 * 60 * 60 * 1000,
} as const

