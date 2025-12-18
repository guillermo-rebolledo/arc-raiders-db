import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Search,
  ScrollText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Gift,
  CheckCircle2,
} from 'lucide-react'
import { useQuests } from '../lib/queries'
import type { Quest } from '../lib/metaforge-api'

// Pagination info type
interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
import {
  ErrorDisplay,
  QuestsListSkeleton,
  EmptyState,
  CacheIndicator,
} from '../components/LoadingStates'

export const Route = createFileRoute('/quests')({
  component: QuestsPage,
  head: () => ({
    meta: [
      { title: 'Quests Guide - ARC Raiders Wiki' },
      {
        name: 'description',
        content:
          'Complete guide to all quests in ARC Raiders. Find objectives, required items, and rewards for every quest.',
      },
      { property: 'og:title', content: 'Quests Guide - ARC Raiders Wiki' },
      {
        property: 'og:description',
        content:
          'Complete guide to all quests in ARC Raiders with objectives and rewards.',
      },
    ],
  }),
})

function QuestCard({ quest }: { quest: Quest }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-colors">
      {/* Quest header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ScrollText className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3
                className="text-lg font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {quest.name}
              </h3>
              {quest.description && (
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                  {quest.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {quest.xp != null && quest.xp > 0 && (
              <span className="text-sm text-amber-400 font-medium">
                +{quest.xp} XP
              </span>
            )}
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-6 pb-6 pt-0 border-t border-zinc-800">
          {/* Objectives */}
          {quest.objectives && quest.objectives.length > 0 && (
            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
                <CheckCircle2 className="h-4 w-4" />
                Objectives
              </h4>
              <ul className="space-y-2 pl-6">
                {quest.objectives.map((objective, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-zinc-300 text-sm"
                  >
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewards */}
          {quest.rewards && quest.rewards.length > 0 && (
            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
                <Gift className="h-4 w-4" />
                Rewards
              </h4>
              <div className="flex flex-wrap gap-2">
                {quest.rewards.map((reward, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                  >
                    {reward.item?.icon ? (
                      <img
                        src={reward.item.icon}
                        alt={reward.item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <Gift className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="text-zinc-300 text-sm">
                      {reward.item?.name || 'Unknown Item'}
                    </span>
                    {reward.quantity > 1 && (
                      <span className="text-xs text-amber-400">
                        x{reward.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full description */}
          {quest.description && (
            <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg">
              <p className="text-zinc-400 text-sm">{quest.description}</p>
            </div>
          )}

          {/* Required Items */}
          {quest.requiredItems && quest.requiredItems.length > 0 && (
            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
                <CheckCircle2 className="h-4 w-4" />
                Required Items
              </h4>
              <div className="flex flex-wrap gap-2">
                {quest.requiredItems.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                  >
                    {req.item?.icon ? (
                      <img
                        src={req.item.icon}
                        alt={req.item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-zinc-500" />
                    )}
                    <span className="text-zinc-300 text-sm">
                      {req.item?.name || 'Unknown Item'}
                    </span>
                    {req.quantity > 1 && (
                      <span className="text-xs text-zinc-500">
                        x{req.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
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
    const showPages = 5

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-zinc-800">
      <div className="text-sm text-zinc-500">
        Page {currentPage} of {totalPages} • {total.toLocaleString()} total
        quests
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage || isLoading}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isLoading}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

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
                    ? 'bg-emerald-500 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                } disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

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

function QuestsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [questsPerPage, setQuestsPerPage] = useState(25)

  // Debounce search input to avoid too many API calls
  const debouncedSearch = useDebounce(searchInput, 300)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  // Use TanStack Query hook with pagination and server-side search
  const { data, isLoading, isError, error, refetch, isFetching } = useQuests({
    page: currentPage,
    limit: questsPerPage,
    search: debouncedSearch || undefined,
  })

  // Extract data
  const quests = data?.quests || []
  const pagination = data?.pagination

  // Loading state (only show full loading on initial load)
  if (isLoading && !data) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <ScrollText className="h-8 w-8 text-emerald-400" />
              <h1
                className="text-3xl font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                Quests
              </h1>
            </div>
            <p className="text-zinc-400">
              Browse all quests, their requirements, and rewards
            </p>
          </div>

          <QuestsListSkeleton count={5} />
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <ErrorDisplay
            title="Failed to Load Quests"
            message={error?.message || 'An unexpected error occurred'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ScrollText className="h-8 w-8 text-emerald-400" />
            <h1
              className="text-3xl font-bold text-zinc-100"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Quests
            </h1>
            {isFetching && !isLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <p className="text-zinc-400">
            Browse all quests, their requirements, and rewards
          </p>

          <div className="mt-2 flex items-center gap-4">
            <CacheIndicator
              fromCache={data?.fromCache || false}
              cachedAt={data?.cachedAt}
            />
            {pagination && (
              <span className="text-xs text-zinc-500">
                {pagination.total.toLocaleString()} total quests
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>

          {/* Quests per page */}
          <select
            value={questsPerPage}
            onChange={(e) => {
              setQuestsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {/* Active search indicator */}
        {debouncedSearch && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Searching for:</span>
            <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400">
              "{debouncedSearch}"
            </span>
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 text-sm text-zinc-500">
          Showing {quests.length} quests
        </div>

        {/* Quests list */}
        {quests.length > 0 ? (
          <>
            <div className="space-y-4">
              {quests.map((quest, idx) => (
                <QuestCard key={`${quest.name}-${idx}`} quest={quest} />
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
            icon="quests"
            title="No Quests Found"
            description={
              debouncedSearch
                ? 'Try adjusting your search'
                : 'No quests available'
            }
          />
        )}
      </div>
    </div>
  )
}
