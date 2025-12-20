import {
  Package,
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
} from 'lucide-react'
import type { Item } from '../lib/wiki-api'
import { HoverCardContent } from '@/components/ui/hover-card'

// Rarity colors
const rarityColors: Record<string, string> = {
  common: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  uncommon: 'bg-green-500/20 text-green-300 border-green-500/30',
  rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  legendary: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  exotic: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
}

interface ItemHoverCardContentProps {
  item: Item
}

export function ItemHoverCardContent({ item }: ItemHoverCardContentProps) {
  const infobox = item.infobox
  const itemIcon = item.image_urls?.thumb || item.image_urls?.original
  const rarity = infobox?.rarity?.toLowerCase() || 'common'
  const rarityStyle = rarityColors[rarity] || rarityColors.common

  return (
    <HoverCardContent className="w-96 max-h-[600px] overflow-y-auto bg-zinc-800 border-zinc-700">
      <div className="space-y-4">
        {/* Header with icon and name */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
            {itemIcon ? (
              <img
                src={itemIcon}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Package className="h-7 w-7 text-zinc-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className="font-bold text-zinc-100 text-base mb-1.5"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {item.name}
            </h4>
            {infobox?.rarity && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${rarityStyle}`}
              >
                {infobox.rarity}
              </span>
            )}
          </div>
        </div>

        {/* Quote/Description */}
        {(infobox?.quote || infobox?.weaponquote || infobox?.attachquote) && (
          <p className="text-sm text-zinc-300 italic leading-relaxed">
            "{infobox.quote || infobox.weaponquote || infobox.attachquote}"
          </p>
        )}

        {/* Stats Grid */}
        {infobox && (
          <div className="pt-2 border-t border-zinc-800">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {infobox.type && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Tag className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Type:</span>{' '}
                    <span className="text-zinc-300">{infobox.type}</span>
                  </span>
                </div>
              )}

              {infobox.location && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Location:</span>{' '}
                    <span className="text-zinc-300">{infobox.location}</span>
                  </span>
                </div>
              )}

              {infobox.weight !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Weight className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Weight:</span>{' '}
                    <span className="text-zinc-300">{infobox.weight} kg</span>
                  </span>
                </div>
              )}

              {infobox.sellprice !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Coins className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Price:</span>{' '}
                    <span className="text-zinc-300">
                      {infobox.sellprice.toLocaleString()}
                    </span>
                  </span>
                </div>
              )}

              {infobox.stacksize !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Layers className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Stack:</span>{' '}
                    <span className="text-zinc-300">{infobox.stacksize}</span>
                  </span>
                </div>
              )}

              {infobox.shield !== null && infobox.shield !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Shield className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Shield:</span>{' '}
                    <span className="text-zinc-300">{infobox.shield}</span>
                  </span>
                </div>
              )}

              {infobox.usetime && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Use Time:</span>{' '}
                    <span className="text-zinc-300">{infobox.usetime}</span>
                  </span>
                </div>
              )}

              {infobox.healing && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Heart className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Healing:</span>{' '}
                    <span className="text-zinc-300">{infobox.healing}</span>
                  </span>
                </div>
              )}

              {infobox.duration && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    <span className="text-zinc-500">Duration:</span>{' '}
                    <span className="text-zinc-300">{infobox.duration}</span>
                  </span>
                </div>
              )}

              {infobox.radius && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <div className="h-3 w-3 shrink-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full border border-zinc-400" />
                  </div>
                  <span className="truncate">
                    <span className="text-zinc-500">Radius:</span>{' '}
                    <span className="text-zinc-300">{infobox.radius}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Special Types */}
        {infobox?.special_types && infobox.special_types.length > 0 && (
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-medium">
                Special Types
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {infobox.special_types.slice(0, 3).map((type, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-xs"
                >
                  {type
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              ))}
              {infobox.special_types.length > 3 && (
                <span className="px-2 py-0.5 text-zinc-500 text-xs">
                  +{infobox.special_types.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Compatible Weapons */}
        {infobox?.compatible_weapons &&
          infobox.compatible_weapons.length > 0 && (
            <div className="pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Swords className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-500 font-medium">
                  Compatible Weapons
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {infobox.compatible_weapons.slice(0, 3).map((weapon, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-zinc-500/10 border border-zinc-500/20 rounded text-zinc-300 text-xs"
                  >
                    {weapon}
                  </span>
                ))}
                {infobox.compatible_weapons.length > 3 && (
                  <span className="px-2 py-0.5 text-zinc-500 text-xs">
                    +{infobox.compatible_weapons.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

        {/* Functions */}
        {infobox?.functions && infobox.functions.length > 0 && (
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-medium">
                Functions
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {infobox.functions.slice(0, 3).map((func, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-purple-400 text-xs"
                >
                  {func
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              ))}
              {infobox.functions.length > 3 && (
                <span className="px-2 py-0.5 text-zinc-500 text-xs">
                  +{infobox.functions.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sources */}
        {item.sources && item.sources.length > 0 && (
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <List className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-medium">Sources</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.sources.slice(0, 3).map((source, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs"
                >
                  {source}
                </span>
              ))}
              {item.sources.length > 3 && (
                <span className="px-2 py-0.5 text-zinc-500 text-xs">
                  +{item.sources.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Crafting Preview */}
        {item.crafting && item.crafting.length > 0 && (
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-medium">
                Crafting Available
              </span>
            </div>
            <div className="text-xs text-zinc-400">
              {item.crafting.length} recipe{item.crafting.length > 1 ? 's' : ''}{' '}
              available
            </div>
          </div>
        )}

        {/* Recycling Preview */}
        {item.recycling &&
          ((item.recycling.recycling && item.recycling.recycling.length > 0) ||
            (item.recycling.salvaging &&
              item.recycling.salvaging.length > 0)) && (
            <div className="pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-500 font-medium">
                  Recycling Available
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Can be recycled or salvaged
              </div>
            </div>
          )}
      </div>
    </HoverCardContent>
  )
}
