import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Filter,
  Package,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react'
import { useItems } from '../lib/queries'
import type { Item, PaginationInfo } from '../lib/metaforge-api'
import {
  ErrorDisplay,
  ItemsGridSkeleton,
  EmptyState,
  CacheIndicator,
} from '../components/LoadingStates'

export const Route = createFileRoute('/items')({
  component: ItemsPage,
})

// Rarity colors
const rarityColors: Record<string, string> = {
  common: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  uncommon: 'bg-green-500/20 text-green-300 border-green-500/30',
  rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  legendary: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

// Category icons/colors
const categoryStyles: Record<string, string> = {
  weapon: 'from-red-500/20 to-orange-500/20 border-red-500/30',
  armor: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  consumable: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  material: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
  key: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  default: 'from-zinc-500/20 to-zinc-600/20 border-zinc-500/30',
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

function ItemCard({ item }: { item: Item }) {
  const rarity = (item.rarity || 'common').toLowerCase()
  const category = (
    item.category ||
    item.item_type ||
    item.type ||
    'default'
  ).toLowerCase()
  const categoryStyle = categoryStyles[category] || categoryStyles.default
  const rarityStyle = rarityColors[rarity] || rarityColors.common
  const itemIcon = item.icon || item.image

  return (
    <Link
      to="/items/$itemId"
      params={{ itemId: item.id }}
      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${categoryStyle} border p-4 transition-all hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="flex items-start gap-4">
        {/* Item icon */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-zinc-900/50 flex items-center justify-center overflow-hidden">
          {itemIcon ? (
            <img
              src={itemIcon}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <Package className="h-8 w-8 text-zinc-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-bold text-zinc-100 truncate"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {item.name}
            </h3>
            <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>

          {/* Rarity badge */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mt-1 ${rarityStyle}`}
          >
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </span>

          {/* Description preview */}
          {item.description && (
            <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
            {(item.item_type || item.type) && (
              <span>{item.item_type || item.type}</span>
            )}
            {item.weight && <span>{item.weight}kg</span>}
            {item.value && <span>{item.value}₽</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

function Pagination({
  pagination,
  currentPage,
  onPageChange,
  isLoading,
}: {
  pagination: PaginationInfo
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}) {
  const { totalPages, hasNextPage, hasPrevPage, total } = pagination

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const showPages = 5 // Max pages to show

    if (totalPages <= showPages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-zinc-800">
      {/* Info */}
      <div className="text-sm text-zinc-500">
        Page {currentPage} of {totalPages} • {total.toLocaleString()} total items
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage || isLoading}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isLoading}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, idx) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-zinc-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
                  page === currentPage
                    ? 'bg-amber-500 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                } disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage || isLoading}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function ItemsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [selectedRarity, setSelectedRarity] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(50)

  // Debounce search input to avoid too many API calls
  const debouncedSearch = useDebounce(searchInput, 300)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  // Use TanStack Query hook with pagination and server-side search
  const { data, isLoading, isError, error, refetch, isFetching } = useItems({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined, // Pass search to API
    rarity: selectedRarity || undefined,
    category: selectedCategory || undefined,
  })

  // Extract data (must be before useMemo hooks)
  const items = data?.items || []
  const pagination = data?.pagination

  // Get unique categories and rarities for filters (from current results)
  // These hooks MUST be called before any early returns
  const categories = useMemo(() => {
    return [
      ...new Set(
        items
          .map((item) => item.category || item.item_type || item.type)
          .filter(Boolean)
      ),
    ].sort()
  }, [items])

  const rarities = useMemo(() => {
    return [...new Set(items.map((item) => item.rarity).filter(Boolean))].sort()
  }, [items])

  // Check if any filters are active
  const hasActiveFilters = searchInput || selectedRarity || selectedCategory

  // Clear all filters
  const clearFilters = () => {
    setSearchInput('')
    setSelectedRarity('')
    setSelectedCategory('')
    setCurrentPage(1)
  }

  // Loading state (only show full loading on initial load)
  if (isLoading && !data) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-8 w-8 text-blue-400" />
              <h1
                className="text-3xl font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                Items Database
              </h1>
            </div>
            <p className="text-zinc-400">
              Browse all items, weapons, equipment, and materials in ARC Raiders
            </p>
          </div>

          {/* Search skeleton */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Loading items..."
                disabled
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          <ItemsGridSkeleton count={9} />
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-7xl">
          <ErrorDisplay
            title="Failed to Load Items"
            message={error?.message || 'An unexpected error occurred'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8 text-blue-400" />
            <h1
              className="text-3xl font-bold text-zinc-100"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Items Database
            </h1>
            {isFetching && (
              <div className="ml-2 w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <p className="text-zinc-400">
            Browse all items, weapons, equipment, and materials in ARC Raiders
          </p>

          {/* Cache info */}
          <div className="mt-2 flex items-center gap-4">
            <CacheIndicator
              fromCache={data?.fromCache || false}
              cachedAt={data?.cachedAt}
            />
            {pagination && (
              <span className="text-xs text-zinc-500">
                {pagination.total.toLocaleString()} total items
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search items by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-500">Filters:</span>
            </div>

            {/* Rarity filter */}
            <select
              value={selectedRarity}
              onChange={(e) => {
                setSelectedRarity(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All Rarities</option>
              {rarities.map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity}
                </option>
              ))}
            </select>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                Clear all
              </button>
            )}

            {/* Results count */}
            <span className="text-sm text-zinc-500 ml-auto">
              {items.length} items on this page
            </span>
          </div>

          {/* Active search indicator */}
          {debouncedSearch && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500">Searching for:</span>
              <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400">
                "{debouncedSearch}"
              </span>
            </div>
          )}
        </div>

        {/* Items Grid */}
        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                isLoading={isFetching}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon="items"
            title="No Items Found"
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters'
                : 'No items available'
            }
          />
        )}
      </div>
    </div>
  )
}
