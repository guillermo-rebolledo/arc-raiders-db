import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Swords,
  MapPin,
  Package,
  ChevronDown,
  ChevronUp,
  Search,
  Target,
} from 'lucide-react'
import { useArcs } from '../lib/queries'
import type { Arc, Item } from '../lib/metaforge-api'
import {
  ErrorDisplay,
  ArcsListSkeleton,
  EmptyState,
  CacheIndicator,
} from '../components/LoadingStates'

export const Route = createFileRoute('/arcs')({
  component: ArcsPage,
  head: () => ({
    meta: [
      { title: 'ARCs & Missions - ARC Raiders Wiki' },
      {
        name: 'description',
        content:
          'Complete guide to all ARCs and missions in ARC Raiders. Find loot tables, rewards, and strategies for each mission.',
      },
      { property: 'og:title', content: 'ARCs & Missions - ARC Raiders Wiki' },
      {
        property: 'og:description',
        content:
          'Complete guide to all ARCs and missions in ARC Raiders with loot tables.',
      },
    ],
  }),
})

// Difficulty colors
const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-300 border-green-500/30',
  normal: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  hard: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  extreme: 'bg-red-500/20 text-red-300 border-red-500/30',
}

function LootItem({ item }: { item: Item }) {
  const itemIcon = item.icon || item.image
  
  return (
    <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg">
      <div className="w-8 h-8 rounded bg-zinc-700/50 flex items-center justify-center overflow-hidden">
        {itemIcon ? (
          <img
            src={itemIcon}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <Package className="h-4 w-4 text-zinc-500" />
        )}
      </div>
      <span className="text-sm text-zinc-300 truncate">{item.name}</span>
    </div>
  )
}

function ArcCard({ arc }: { arc: Arc }) {
  const [expanded, setExpanded] = useState(false)
  const difficulty = (arc.difficulty || 'normal').toLowerCase()
  const difficultyStyle = difficultyColors[difficulty] || difficultyColors.normal
  const loot = arc.loot || []

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-colors">
      {/* Arc header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Swords className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {arc.difficulty && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded border ${difficultyStyle}`}
                  >
                    {arc.difficulty}
                  </span>
                )}
              </div>
              <h3
                className="text-xl font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {arc.name}
              </h3>
              {arc.location && (
                <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{arc.location}</span>
                </div>
              )}
              {arc.description && (
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                  {arc.description}
                </p>
              )}
              {loot.length > 0 && (
                <p className="text-sm text-amber-400 mt-2">
                  {loot.length} possible loot items
                </p>
              )}
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-zinc-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Expanded content - Loot */}
      {expanded && (
        <div className="px-6 pb-6 pt-0 border-t border-zinc-800">
          {/* Full description */}
          {arc.description && (
            <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg mb-4">
              <p className="text-zinc-400 text-sm">{arc.description}</p>
            </div>
          )}

          {/* Loot section */}
          {loot.length > 0 ? (
            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
                <Target className="h-4 w-4" />
                Possible Loot
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {loot.map((item) => (
                  <LootItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 text-center py-8">
              <Package className="h-12 w-12 text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">No loot data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ArcsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')

  // Use TanStack Query hook
  const { data, isLoading, isError, error, refetch, isFetching } = useArcs()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Swords className="h-8 w-8 text-red-400" />
              <h1
                className="text-3xl font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                ARCs
              </h1>
            </div>
            <p className="text-zinc-400">
              Explore missions, activities, and their possible loot
            </p>
          </div>

          <ArcsListSkeleton count={4} />
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
            title="Failed to Load ARCs"
            message={error?.message || 'An unexpected error occurred'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  const arcs = data?.arcs || []

  // Get unique difficulties
  const difficulties = [...new Set(arcs.map((a) => a.difficulty).filter(Boolean))]

  // Filter arcs
  const filteredArcs = arcs.filter((arc) => {
    const matchesSearch =
      searchQuery === '' ||
      arc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arc.location?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDifficulty =
      selectedDifficulty === '' ||
      arc.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()

    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Swords className="h-8 w-8 text-red-400" />
            <h1
              className="text-3xl font-bold text-zinc-100"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              ARCs
            </h1>
            {isFetching && !isLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <p className="text-zinc-400">
            Explore missions, activities, and their possible loot
          </p>

          <div className="mt-2">
            <CacheIndicator fromCache={data?.fromCache || false} cachedAt={data?.cachedAt} />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search ARCs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="">All Difficulties</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-zinc-500">
          {filteredArcs.length} ARCs found
        </div>

        {/* ARCs list */}
        {filteredArcs.length > 0 ? (
          <div className="space-y-4">
            {filteredArcs.map((arc) => (
              <ArcCard key={arc.id} arc={arc} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="arcs"
            title="No ARCs Found"
            description={
              searchQuery || selectedDifficulty
                ? 'Try adjusting your filters'
                : 'No ARCs available'
            }
          />
        )}
      </div>
    </div>
  )
}
