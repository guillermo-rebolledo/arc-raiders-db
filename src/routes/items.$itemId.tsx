import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Package,
  ExternalLink,
  Coins,
  Weight,
  Layers,
  Shield,
  Clock,
  Heart,
  MapPin,
  Tag,
  Swords,
  Settings,
  List,
  Hammer,
  Lock,
  RotateCcw,
} from 'lucide-react'
import { useItemByName } from '../lib/queries'
import { ErrorDisplay, Skeleton } from '../components/LoadingStates'

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

function ItemDetailPage() {
  const { itemId } = Route.useParams()
  const decodedName = decodeURIComponent(itemId)

  // Fetch the item by name using TanStack Query
  const { data, isLoading, isError, error } = useItemByName(itemId)

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Skeleton />
        </div>
      </div>
    )
  }

  if (isError || !data?.success || !data.item) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/items"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Link>

          <ErrorDisplay
            title="Item Not Found"
            message={
              error?.message || data?.error || `Item "${decodedName}" not found`
            }
          />
        </div>
      </div>
    )
  }

  const item = data.item
  const itemIcon = item.image_urls?.thumb || item.image_urls?.original
  const infobox = item.infobox
  const rarity = infobox?.rarity?.toLowerCase() || 'common'
  const rarityStyle = rarityColors[rarity] || rarityColors.common

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/items"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Link>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-6">
          {/* Header with icon and name */}
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-20 h-20 rounded-lg bg-zinc-900/50 flex items-center justify-center overflow-hidden border border-zinc-800">
              {itemIcon ? (
                <img
                  src={itemIcon}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Package className="h-10 w-10 text-zinc-600" />
              )}
            </div>
            <div className="flex-1">
              <h1
                className="text-3xl font-bold text-zinc-100 mb-2"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {item.name}
              </h1>
              {infobox?.rarity && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${rarityStyle} mb-3`}
                >
                  {infobox.rarity}
                </span>
              )}
              {(infobox?.quote ||
                infobox?.weaponquote ||
                infobox?.attachquote) && (
                <p className="text-zinc-300 italic text-base leading-relaxed mt-2">
                  "{infobox.quote || infobox.weaponquote || infobox.attachquote}
                  "
                </p>
              )}
            </div>
            {item.wiki_url && (
              <a
                href={item.wiki_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700"
              >
                <ExternalLink className="h-4 w-4" />
                Wiki
              </a>
            )}
          </div>

          {/* Stats Grid */}
          {infobox && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
              {infobox.type && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Tag className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Type</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.type}
                    </div>
                  </div>
                </div>
              )}

              {infobox.location && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Location</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.location}
                    </div>
                  </div>
                </div>
              )}

              {infobox.weight !== undefined && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Weight className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Weight</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.weight} kg
                    </div>
                  </div>
                </div>
              )}

              {infobox.sellprice !== undefined && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Coins className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Sell Price</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.sellprice.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {infobox.stacksize !== undefined && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Layers className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Stack Size</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.stacksize}
                    </div>
                  </div>
                </div>
              )}

              {infobox.shield !== null && infobox.shield !== undefined && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Shield className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Shield</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.shield}
                    </div>
                  </div>
                </div>
              )}

              {infobox.usetime && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Clock className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Use Time</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.usetime}
                    </div>
                  </div>
                </div>
              )}

              {infobox.healing && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Heart className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Healing</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.healing}
                    </div>
                  </div>
                </div>
              )}

              {infobox.duration && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Clock className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs text-zinc-500">Duration</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.duration}
                    </div>
                  </div>
                </div>
              )}

              {infobox.radius && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <div className="h-5 w-5 text-zinc-400 shrink-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full border border-zinc-400" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500">Radius</div>
                    <div className="text-zinc-200 font-medium">
                      {infobox.radius}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Special Types */}
          {infobox?.special_types && infobox.special_types.length > 0 && (
            <div className="border-t border-zinc-800 pt-6">
              <div className="text-sm text-zinc-500 mb-2">Special Types</div>
              <div className="flex flex-wrap gap-2">
                {infobox.special_types.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-sm"
                  >
                    {type
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Compatible Weapons */}
          {infobox?.compatible_weapons &&
            infobox.compatible_weapons.length > 0 && (
              <div className="border-t border-zinc-800 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Swords className="h-4 w-4 text-zinc-400" />
                  <div className="text-sm text-zinc-500">
                    Compatible Weapons
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {infobox.compatible_weapons.map((weapon, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-zinc-500/10 border border-zinc-500/20 rounded-md text-zinc-300 text-sm"
                    >
                      {weapon}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Functions */}
          {infobox?.functions && infobox.functions.length > 0 && (
            <div className="border-t border-zinc-800 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-4 w-4 text-zinc-400" />
                <div className="text-sm text-zinc-500">Functions</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {infobox.functions.map((func, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-purple-400 text-sm"
                  >
                    {func
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {item.sources && item.sources.length > 0 && (
            <div className="border-t border-zinc-800 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <List className="h-4 w-4 text-zinc-400" />
                <div className="text-sm text-zinc-500">Sources</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.sources.map((source, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-green-400 text-sm"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Crafting */}
          {item.crafting && item.crafting.length > 0 && (
            <div className="border-t border-zinc-800 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Hammer className="h-4 w-4 text-zinc-400" />
                <div className="text-sm text-zinc-500">Crafting Recipes</div>
              </div>
              <div className="space-y-4">
                {item.crafting.map((recipe, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4"
                  >
                    {/* Workshop and Result */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {recipe.workshop && (
                          <div className="text-sm text-zinc-400 mb-1">
                            Workshop:{' '}
                            <span className="text-zinc-300 font-medium">
                              {recipe.workshop}
                            </span>
                          </div>
                        )}
                        {recipe.result_level && (
                          <div className="text-sm text-zinc-400">
                            Result:{' '}
                            <span className="text-zinc-100 font-medium">
                              {recipe.result_level}
                            </span>
                          </div>
                        )}
                        {recipe.output_quantity && (
                          <div className="text-sm text-zinc-400">
                            Output:{' '}
                            <span className="text-zinc-300 font-medium">
                              {recipe.output_quantity}x
                            </span>
                          </div>
                        )}
                      </div>
                      {recipe.blueprint_locked && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-xs">
                          <Lock className="h-3 w-3" />
                          Blueprint Locked
                        </div>
                      )}
                    </div>

                    {/* Recipe Items */}
                    {recipe.recipe && recipe.recipe.length > 0 && (
                      <div className="border-t border-zinc-700 pt-3">
                        <div className="text-xs text-zinc-500 mb-2">
                          Required Materials:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recipe.recipe.map((ingredient, ingIdx) => (
                            <div
                              key={ingIdx}
                              className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md"
                            >
                              {ingredient.quantity && (
                                <span className="text-zinc-300 font-medium">
                                  {ingredient.quantity}x
                                </span>
                              )}
                              <span className="text-zinc-200 text-sm">
                                {ingredient.item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recycling */}
          {item.recycling &&
            ((item.recycling.recycling &&
              item.recycling.recycling.length > 0) ||
              (item.recycling.salvaging &&
                item.recycling.salvaging.length > 0)) && (
              <div className="border-t border-zinc-800 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <RotateCcw className="h-4 w-4 text-zinc-400" />
                  <div className="text-sm text-zinc-500">Recycling</div>
                </div>
                <div className="space-y-4">
                  {/* Recycling Materials */}
                  {item.recycling.recycling &&
                    item.recycling.recycling.length > 0 && (
                      <div>
                        <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">
                          Recycling Materials
                        </div>
                        <div className="space-y-3">
                          {item.recycling.recycling.map((recycle, idx) => (
                            <div
                              key={idx}
                              className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4"
                            >
                              {recycle.materials &&
                                recycle.materials.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {recycle.materials.map(
                                      (material, matIdx) => (
                                        <div
                                          key={matIdx}
                                          className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md"
                                        >
                                          {material.quantity && (
                                            <span className="text-zinc-300 font-medium">
                                              {material.quantity}x
                                            </span>
                                          )}
                                          <span className="text-zinc-200 text-sm">
                                            {material.item}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Salvaging Materials */}
                  {item.recycling.salvaging &&
                    item.recycling.salvaging.length > 0 && (
                      <div>
                        <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">
                          Salvaging Materials
                        </div>
                        <div className="space-y-3">
                          {item.recycling.salvaging.map((salvage, idx) => (
                            <div
                              key={idx}
                              className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4"
                            >
                              {salvage.materials &&
                                salvage.materials.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {salvage.materials.map(
                                      (material, matIdx) => (
                                        <div
                                          key={matIdx}
                                          className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md"
                                        >
                                          {material.quantity && (
                                            <span className="text-zinc-300 font-medium">
                                              {material.quantity}x
                                            </span>
                                          )}
                                          <span className="text-zinc-200 text-sm">
                                            {material.item}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
