/**
 * Rarity constants for ARC Raiders
 * Used across the app for consistent rarity styling
 */

export const RARITY_COLORS: Record<string, string> = {
  common: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  uncommon: 'bg-green-500/20 text-green-300 border-green-500/30',
  rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  legendary: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  exotic: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
}

/**
 * RGB color values for rarity (for use in CSS variables and dynamic styling)
 * Values match Tailwind color palette
 */
export const RARITY_RGB: Record<string, string> = {
  common: '113, 113, 122', // zinc-500
  uncommon: '34, 197, 94', // green-500
  rare: '59, 130, 246', // blue-500
  epic: '168, 85, 247', // purple-500
  legendary: '245, 158, 11', // amber-500
  exotic: '6, 182, 212', // cyan-500
}

/**
 * Get rarity color classes for a given rarity
 */
export function getRarityColor(rarity: string): string {
  const normalizedRarity = rarity.toLowerCase()
  return RARITY_COLORS[normalizedRarity] || RARITY_COLORS.common
}

/**
 * Get rarity RGB value for a given rarity
 */
export function getRarityRgb(rarity: string): string {
  const normalizedRarity = rarity.toLowerCase()
  return RARITY_RGB[normalizedRarity] || RARITY_RGB.common
}
