import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  fallback?: React.ReactNode
  /** Set to true for above-the-fold images that should load immediately */
  priority?: boolean
}

/**
 * Optimized image component with:
 * - Lazy loading (unless priority is set)
 * - Async decoding
 * - Error handling with fallback
 * - Loading state with fade-in animation
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  fallback,
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (hasError && fallback) {
    return <>{fallback}</>
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      className={`${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}

/**
 * Image component with blur placeholder effect
 */
export function BlurImage({
  src,
  alt,
  className = '',
  fallback,
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (hasError && fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-zinc-800 animate-pulse ${className}`}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-all duration-500 ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
        }`}
      />
    </div>
  )
}

