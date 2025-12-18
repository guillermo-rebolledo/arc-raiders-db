import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Package, ExternalLink } from 'lucide-react'
import { useItems } from '../lib/queries'
import type { Item } from '../lib/wiki-api'
import {
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
  exotic: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
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
            <div
              key={i}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center"
            >
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
  const decodedName = decodeURIComponent(itemId)

  // Use TanStack Query - fetch all items and find the specific one by name
  const { data, isLoading, isError, error, refetch } = useItems({ limit: 1000 })

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

  // Find item by name (case-insensitive)
  const item = data?.items?.find(
    (i: Item) => i.name.toLowerCase() === decodedName.toLowerCase()
  )

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
              The item "{decodedName}" could not be found.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Extract rarity from infobox
  const rarity = (item.infobox?.rarity || 'common').toLowerCase()
  const rarityStyle = rarityColors[rarity] || rarityColors.common
  const itemIcon = item.image_urls?.original || item.image_urls?.thumb

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
          <CacheIndicator
            fromCache={data?.fromCache || false}
            cachedAt={data?.cachedAt}
          />
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
                  loading="lazy"
                  decoding="async"
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
                {item.infobox?.rarity && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${rarityStyle}`}
                  >
                    {item.infobox.rarity}
                  </span>
                )}

                {/* Type badge */}
                {item.infobox?.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {item.infobox.type}
                  </span>
                )}
              </div>

              {item.infobox?.quote && (
                <p className="text-zinc-400 leading-relaxed italic">
                  "{item.infobox.quote}"
                </p>
              )}

              {/* Wiki link */}
              {item.wiki_url && (
                <a
                  href={item.wiki_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm text-amber-400 hover:text-amber-300 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on Wiki
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Item properties from infobox */}
        {item.infobox && Object.keys(item.infobox).length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
            <h2
              className="text-xl font-bold text-zinc-100 mb-4"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Properties
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(item.infobox)
                .filter(([key, value]) => value != null && key !== 'image' && key !== 'special_types')
                .map(([key, value]) => (
                  <div key={key} className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="text-sm text-zinc-500 mb-1 capitalize">{key.replace(/_/g, ' ')}</div>
                    <div className="text-zinc-100 font-medium">
                      {typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Crafting info */}
        {item.crafting && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
            <h2
              className="text-xl font-bold text-zinc-100 mb-4"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Crafting
            </h2>
            {item.crafting.workbench && (
              <p className="text-zinc-400 mb-3">
                Workbench: <span className="text-zinc-100">{item.crafting.workbench}</span>
              </p>
            )}
            {item.crafting.materials && item.crafting.materials.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-zinc-500">Materials needed:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {item.crafting.materials.map((mat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-zinc-800/50 rounded-lg"
                    >
                      <span className="text-zinc-300 text-sm">{mat.name}</span>
                      <span className="text-amber-400 text-sm font-medium">
                        x{mat.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
