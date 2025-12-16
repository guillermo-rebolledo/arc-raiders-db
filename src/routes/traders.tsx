import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Store,
  Package,
  ChevronDown,
  ChevronUp,
  Search,
  Coins,
  Tag,
} from 'lucide-react'
import { useTraders } from '../lib/queries'
import type { Trader, TraderItem } from '../lib/metaforge-api'
import {
  ErrorDisplay,
  TradersListSkeleton,
  EmptyState,
  CacheIndicator,
} from '../components/LoadingStates'

export const Route = createFileRoute('/traders')({
  component: TradersPage,
})

// Rarity colors
const rarityColors: Record<string, string> = {
  common: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  uncommon: 'bg-green-500/20 text-green-300 border-green-500/30',
  rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  legendary: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

function InventoryItem({ item }: { item: TraderItem }) {
  const rarity = (item.rarity || 'common').toLowerCase()
  const rarityStyle = rarityColors[rarity] || rarityColors.common

  return (
    <div className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors group">
      {/* Item icon */}
      <div className="w-12 h-12 rounded-lg bg-zinc-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
        {item.icon ? (
          <img
            src={item.icon}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <Package className="h-6 w-6 text-zinc-500" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-zinc-100 font-medium group-hover:text-white transition-colors">
              {item.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded border ${rarityStyle}`}
              >
                {item.rarity}
              </span>
              <span className="text-xs text-zinc-500">{item.item_type}</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Coins className="h-4 w-4" />
              <span>{item.trader_price.toLocaleString()}</span>
            </div>
            <div className="text-xs text-zinc-500">
              Value: {item.value.toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Description */}
        {item.description && (
          <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}

function TraderCard({ trader }: { trader: Trader }) {
  const [expanded, setExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const inventory = trader.inventory || []
  
  // Get unique rarities and types
  const rarities = [...new Set(inventory.map(i => i.rarity))].sort()
  const types = [...new Set(inventory.map(i => i.item_type))].sort()
  
  // Filter inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRarity = !selectedRarity || item.rarity === selectedRarity
    const matchesType = !selectedType || item.item_type === selectedType
    return matchesSearch && matchesRarity && matchesType
  })

  // Calculate total inventory value
  const totalValue = inventory.reduce((sum, item) => sum + item.trader_price, 0)

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors">
      {/* Trader header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Store className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h3
                className="text-2xl font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {trader.name}
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-purple-400">
                  {inventory.length} items
                </span>
                <span className="text-sm text-zinc-500">
                  Total value: <span className="text-amber-400">{totalValue.toLocaleString()}</span>
                </span>
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

      {/* Expanded content - Inventory */}
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
            
            {/* Rarity filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50"
            >
              <option value="">All Rarities</option>
              {rarities.map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity}
                </option>
              ))}
            </select>
            
            {/* Type filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50"
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            
            <span className="text-xs text-zinc-500 ml-auto">
              {filteredInventory.length} items
            </span>
          </div>

          {/* Inventory grid */}
          {filteredInventory.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredInventory.map((item) => (
                <InventoryItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500 py-8">
              {searchQuery || selectedRarity || selectedType
                ? 'No items match your filters'
                : 'No items in inventory'}
            </p>
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
  const totalItems = traders.reduce((sum, t) => sum + t.inventory.length, 0)

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
            <CacheIndicator fromCache={data?.fromCache || false} cachedAt={data?.cachedAt} />
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
            {filteredTraders.map((trader) => (
              <TraderCard key={trader.id} trader={trader} />
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
