import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Store,
  Package,
  ChevronDown,
  ChevronUp,
  Search,
  Coins,
  Lock,
} from 'lucide-react'
import { useTraders } from '../lib/queries'
import type { Trader, ShopItem } from '../lib/wiki-api'
import {
  ErrorDisplay,
  TradersListSkeleton,
  EmptyState,
  CacheIndicator,
} from '../components/LoadingStates'

export const Route = createFileRoute('/traders')({
  component: TradersPage,
  head: () => ({
    meta: [
      { title: 'Traders & Shops - ARC Raiders Wiki' },
      {
        name: 'description',
        content:
          'Browse all traders and their inventories in ARC Raiders. Find items for sale, prices, and stock information.',
      },
      { property: 'og:title', content: 'Traders & Shops - ARC Raiders Wiki' },
      {
        property: 'og:description',
        content: 'Browse all traders and their inventories in ARC Raiders.',
      },
    ],
  }),
})

// Currency colors
const currencyColors: Record<string, string> = {
  cred: 'text-green-400',
  coins: 'text-amber-400',
  'assorted seeds': 'text-emerald-400',
  augment: 'text-purple-400',
}

function ShopItemCard({ item }: { item: ShopItem }) {
  const currencyLower = item.currency.toLowerCase()
  const currencyColor = currencyColors[currencyLower] || 'text-zinc-300'

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center flex-shrink-0">
          <Package className="h-5 w-5 text-zinc-500" />
        </div>
        <div className="min-w-0">
          <p className="text-zinc-100 font-medium group-hover:text-white transition-colors truncate">
            {item.name}
          </p>
          {item.is_limited && item.stock && (
            <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
              <Lock className="h-3 w-3" />
              <span>Stock: {item.stock}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <div className={`flex items-center gap-1 font-bold ${currencyColor}`}>
          <Coins className="h-4 w-4" />
          <span>{item.price.toLocaleString()}</span>
        </div>
        <div className="text-xs text-zinc-500">{item.currency}</div>
      </div>
    </div>
  )
}

function TraderCard({ trader }: { trader: Trader }) {
  const [expanded, setExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLimitedOnly, setShowLimitedOnly] = useState(false)

  const shop = trader.shop || []

  // Filter shop items
  const filteredShop = shop.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesLimited = !showLimitedOnly || item.is_limited
    return matchesSearch && matchesLimited
  })

  // Count limited items
  const limitedCount = shop.filter((i) => i.is_limited).length

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors">
      {/* Trader header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Trader image */}
            <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-purple-500/10">
              {trader.image_urls?.original ? (
                <img
                  src={trader.image_urls.original}
                  alt={trader.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Store className="h-8 w-8 text-purple-400" />
                </div>
              )}
            </div>
            <div>
              <h3
                className="text-2xl font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {trader.name}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="text-purple-400">{shop.length} items</span>
                {limitedCount > 0 && (
                  <span className="text-amber-400">
                    {limitedCount} limited stock
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronUp className="h-6 w-6 text-zinc-500" />
            ) : (
              <ChevronDown className="h-6 w-6 text-zinc-500" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded content - Shop */}
      {expanded && (
        <div className="px-6 pb-6 pt-0 border-t border-zinc-800">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Limited only toggle */}
            {limitedCount > 0 && (
              <button
                onClick={() => setShowLimitedOnly(!showLimitedOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  showLimitedOnly
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                Limited Only
              </button>
            )}

            <span className="text-xs text-zinc-500 ml-auto">
              {filteredShop.length} items
            </span>
          </div>

          {/* Shop grid */}
          {filteredShop.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredShop.map((item, index) => (
                <ShopItemCard key={`${item.name}-${index}`} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500 py-8">
              {searchQuery || showLimitedOnly
                ? 'No items match your filters'
                : 'No items in shop'}
            </p>
          )}

          {/* Wiki link */}
          {trader.wiki_url && (
            <a
              href={trader.wiki_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-300 hover:underline"
            >
              View on Wiki →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function TradersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Use TanStack Query hook
  const { data, isLoading, isError, error, refetch, isFetching } = useTraders()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Store className="h-8 w-8 text-purple-400" />
              <h1
                className="text-3xl font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                Traders
              </h1>
            </div>
            <p className="text-zinc-400">
              Browse all traders and their inventories
            </p>
          </div>

          <TradersListSkeleton count={4} />
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <ErrorDisplay
            title="Failed to Load Traders"
            message={error?.message || 'An unexpected error occurred'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  const traders = data?.traders || []

  // Filter traders
  const filteredTraders = traders.filter((trader) =>
    trader.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate totals
  const totalItems = traders.reduce((sum, t) => sum + (t.shop?.length || 0), 0)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-8 w-8 text-purple-400" />
            <h1
              className="text-3xl font-bold text-zinc-100"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Traders
            </h1>
            {isFetching && !isLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <p className="text-zinc-400">
            Browse all traders and their inventories
          </p>

          <div className="mt-2 flex items-center gap-4">
            <CacheIndicator
              fromCache={data?.fromCache || false}
              cachedAt={data?.cachedAt}
            />
            <span className="text-xs text-zinc-500">
              {traders.length} traders • {totalItems} total items
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search traders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>

        {/* Traders list */}
        {filteredTraders.length > 0 ? (
          <div className="space-y-4">
            {filteredTraders.map((trader, index) => (
              <TraderCard key={`${trader.name}-${index}`} trader={trader} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="traders"
            title="No Traders Found"
            description={
              searchQuery ? 'Try adjusting your search' : 'No traders available'
            }
          />
        )}
      </div>
    </div>
  )
}
