import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Swords, MapPin, Search } from 'lucide-react'
import { useArcs } from '../lib/queries'
import type { Arc } from '../lib/metaforge-api'
import {
  ErrorDisplay,
  ArcsListSkeleton,
  EmptyState,
  CacheIndicator,
} from '../components/LoadingStates'
import { OptimizedImage } from '../components/OptimizedImage'

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

function ArcCard({ arc }: { arc: Arc }) {
  const arcIcon = arc.icon || arc.image

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-colors p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center overflow-hidden">
          {arcIcon ? (
            <OptimizedImage
              src={arcIcon}
              alt={arc.name}
              className="w-full h-full object-cover"
              fallback={<Swords className="h-7 w-7 text-red-400" />}
            />
          ) : (
            <Swords className="h-7 w-7 text-red-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
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
            <p className="text-sm text-zinc-400 mt-3">{arc.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ArcsPage() {
  const [searchQuery, setSearchQuery] = useState('')

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

  // Filter arcs by search
  const filteredArcs = arcs.filter((arc) => {
    return (
      searchQuery === '' ||
      arc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arc.location?.toLowerCase().includes(searchQuery.toLowerCase())
    )
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
            <CacheIndicator
              fromCache={data?.fromCache || false}
              cachedAt={data?.cachedAt}
            />
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search ARCs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>
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
              searchQuery ? 'Try adjusting your search' : 'No ARCs available'
            }
          />
        )}
      </div>
    </div>
  )
}
