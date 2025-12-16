import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Package } from 'lucide-react'
import { useItems } from '../lib/queries'
import {
  PageLoading,
  ErrorDisplay,
  CacheIndicator,
  Skeleton,
} from '../components/LoadingStates'

export const Route = createFileRoute('/items/$itemId')({
  component: ItemDetailPage,
})

// Rarity colors
const rarityColors: Record<string, string> = {
  common: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  uncommon: 'bg-green-500/20 text-green-300 border-green-500/30',
  rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  legendary: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

function ItemDetailSkeleton() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/items"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Link>

        {/* Item header skeleton */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Skeleton className="w-32 h-32 rounded-xl" />
            <div className="flex-1 w-full">
              <Skeleton className="h-9 w-2/3 mb-3" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-20" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ItemDetailPage() {
  const { itemId } = Route.useParams()
  
  // Use TanStack Query - reuse the items query and find the specific item
  const { data, isLoading, isError, error, refetch } = useItems()

  if (isLoading) {
    return <ItemDetailSkeleton />
  }

  if (isError) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/items"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Link>
          <ErrorDisplay
            title="Failed to Load Item"
            message={error?.message || 'An unexpected error occurred'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  const item = data?.items?.find((i) => i.id === itemId)

  if (!item) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/items"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Link>

          <div className="flex flex-col items-center justify-center py-20">
            <Package className="h-16 w-16 text-zinc-700 mb-4" />
            <h2
              className="text-2xl font-bold text-zinc-100 mb-2"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Item Not Found
            </h2>
            <p className="text-zinc-400">
              The item with ID "{itemId}" could not be found.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const rarity = (item.rarity || 'common').toLowerCase()
  const rarityStyle = rarityColors[rarity] || rarityColors.common
  const itemIcon = item.icon || item.image

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          to="/items"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Link>

        {/* Cache info */}
        <div className="mb-4">
          <CacheIndicator fromCache={data?.fromCache || false} cachedAt={data?.cachedAt} />
        </div>

        {/* Item header */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Item icon */}
            <div className="flex-shrink-0 w-32 h-32 rounded-xl bg-zinc-800/50 flex items-center justify-center overflow-hidden">
              {itemIcon ? (
                <img
                  src={itemIcon}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Package className="h-16 w-16 text-zinc-600" />
              )}
            </div>

            <div className="flex-1">
              <h1
                className="text-3xl font-bold text-zinc-100 mb-2"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {item.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                {/* Rarity badge */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${rarityStyle}`}
                >
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </span>

                {/* Type badge */}
                {item.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {item.type}
                  </span>
                )}

                {/* Category badge */}
                {item.category && item.category !== item.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {item.category}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Item stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {item.weight !== undefined && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-zinc-100">
                {item.weight}kg
              </div>
              <div className="text-sm text-zinc-500">Weight</div>
            </div>
          )}
          {item.value !== undefined && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">
                {item.value}₽
              </div>
              <div className="text-sm text-zinc-500">Value</div>
            </div>
          )}
          {item.tier && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-zinc-100">{item.tier}</div>
              <div className="text-sm text-zinc-500">Tier</div>
            </div>
          )}
        </div>

        {/* Components */}
        {item.components && item.components.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2
              className="text-xl font-bold text-zinc-100 mb-4"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Components
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.components.map((component) => (
                <Link
                  key={component.id}
                  to="/items/$itemId"
                  params={{ itemId: component.id }}
                  className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                    <Package className="h-5 w-5 text-zinc-500" />
                  </div>
                  <span className="text-zinc-300">{component.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Raw data (for debugging/info) */}
        <details className="mt-8">
          <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors">
            View raw data
          </summary>
          <pre className="mt-4 p-4 bg-zinc-900 rounded-xl text-xs text-zinc-400 overflow-x-auto">
            {JSON.stringify(item, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}
