import { Loader2, AlertCircle, RefreshCw, Package, ScrollText, Store, Clock, Swords } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} text-amber-500 animate-spin`} />
      {text && <p className="text-zinc-400 text-sm">{text}</p>}
    </div>
  )
}

interface PageLoadingProps {
  title?: string
  description?: string
}

export function PageLoading({ title = 'Loading...', description }: PageLoadingProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
        <Loader2 className="relative h-16 w-16 text-amber-500 animate-spin" />
      </div>
      <h2 
        className="text-2xl font-bold text-zinc-100 mt-6 mb-2"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-zinc-400">{description}</p>
      )}
    </div>
  )
}

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorDisplay({ title = 'Something went wrong', message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
        <AlertCircle className="relative h-16 w-16 text-red-500" />
      </div>
      <h2 
        className="text-2xl font-bold text-zinc-100 mt-6 mb-2"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        {title}
      </h2>
      <p className="text-zinc-400 mb-6 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold rounded-lg transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`bg-zinc-800/50 rounded animate-pulse ${className}`}
    />
  )
}

// Skeleton cards for different page types
export function ItemCardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/4 mb-3" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function ItemsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function QuestCardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/4 mb-3" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  )
}

export function QuestsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <QuestCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TraderCardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-7 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function TradersListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TraderCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-6 w-1/2 mb-3" />
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function EventsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ArcCardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-800/30 border border-zinc-700/50 p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-16 mb-2" />
          <Skeleton className="h-7 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-3" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function ArcsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ArcCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Empty states
interface EmptyStateProps {
  icon: 'items' | 'quests' | 'traders' | 'events' | 'arcs'
  title: string
  description: string
}

const iconMap = {
  items: Package,
  quests: ScrollText,
  traders: Store,
  events: Clock,
  arcs: Swords,
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const Icon = iconMap[icon]
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Icon className="h-16 w-16 text-zinc-700 mb-4" />
      <h3 
        className="text-xl font-bold text-zinc-400 mb-2"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-zinc-500">{description}</p>
    </div>
  )
}

// Cache indicator component
interface CacheIndicatorProps {
  fromCache: boolean
  cachedAt?: number
}

export function CacheIndicator({ fromCache, cachedAt }: CacheIndicatorProps) {
  if (!fromCache) return null
  
  return (
    <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
      <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
      <span>
        Cached
        {cachedAt && (
          <> • {new Date(cachedAt).toLocaleTimeString()}</>
        )}
      </span>
    </div>
  )
}

