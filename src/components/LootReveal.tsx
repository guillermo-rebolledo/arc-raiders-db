import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import { getRarityColor, getRarityRgb } from '../lib/rarity-constants'
import type { Item } from '../lib/wiki-api'

interface LootRevealProps {
  item?: Item
  onComplete?: () => void
}

export function LootReveal({ item, onComplete }: LootRevealProps) {
  const [isRevealing, setIsRevealing] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!item) {
    return null
  }

  const rarityStyle = {
    borderColor: getRarityRgb(item.infobox?.rarity || 'common'),
    badgeClasses: getRarityColor(item.infobox?.rarity || 'common'),
  }

  const itemImage = item.image_urls?.thumb || item.image_urls?.original

  // Preload the image when component mounts or item changes
  useEffect(() => {
    if (!itemImage) {
      setImageLoaded(true) // No image to load, consider it "loaded"
      return
    }

    const img = new Image()
    img.onload = () => {
      setImageLoaded(true)
    }
    img.onerror = () => {
      setImageLoaded(true) // Even on error, consider it "loaded" to avoid blocking
    }
    img.src = itemImage
  }, [itemImage])

  // Start animation automatically on mount
  useEffect(() => {
    setIsRevealing(true)
    setTimeout(() => {
      setIsRevealed(true)
      setIsRevealing(false)
      onComplete?.()
    }, 800)
  }, [])

  const handleReveal = () => {
    if (!isRevealed) {
      setIsRevealing(true)
      setTimeout(() => {
        setIsRevealed(true)
        setIsRevealing(false)
        onComplete?.()
      }, 800)
    } else {
      // Restart animation if already revealed
      setIsRevealed(false)
      setIsRevealing(false)
      // Use setTimeout to ensure state reset happens before starting animation
      setTimeout(() => {
        setIsRevealing(true)
        setTimeout(() => {
          setIsRevealed(true)
          setIsRevealing(false)
          onComplete?.()
        }, 800)
      }, 0)
    }
  }

  return (
    <div
      className="relative w-32 h-32 cursor-pointer"
      onClick={handleReveal}
      style={
        {
          '--rarity-rgb': rarityStyle.borderColor,
        } as React.CSSProperties & { '--rarity-rgb': string }
      }
    >
      <div
        className={`loot-border absolute inset-0 ${isRevealing ? 'animating' : ''}`}
      >
        <div className="loot-border-inner w-full h-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
          <div
            className={`loot-reveal-mask absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out ${
              isRevealing ? 'revealing' : ''
            }`}
            style={{ opacity: isRevealing ? 1 : 0 }}
          />
          {isRevealed && (
            <div
              className={`loot-content relative z-5 flex items-center justify-center ${isRevealed ? 'revealed' : ''}`}
            >
              {itemImage ? (
                <img
                  src={itemImage}
                  alt={item.name}
                  className="w-full h-full object-contain p-4"
                  loading="eager"
                  decoding="async"
                  style={{ display: imageLoaded ? 'block' : 'none' }}
                />
              ) : (
                <Package className="h-8 w-8 text-zinc-600" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
