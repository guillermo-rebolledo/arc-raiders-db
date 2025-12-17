import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { Clock, MapPin, Zap, Timer, Calendar, Filter } from 'lucide-react'
import { useEventTimersRaw } from '../lib/queries'
import type { EventTimer } from '../lib/metaforge-api'
import {
  processEventTimers,
  formatTimeRemaining,
  formatTimeSlotLocal,
  getUniqueMaps,
  getUniqueEventNames,
} from '../lib/event-utils'
import {
  ErrorDisplay,
  EventsListSkeleton,
  EmptyState,
  CacheIndicator,
  Skeleton,
} from '../components/LoadingStates'

export const Route = createFileRoute('/events')({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: 'Event Timers - ARC Raiders Wiki' },
      {
        name: 'description',
        content:
          'Live event timers for ARC Raiders. Track active and upcoming events like Harvester, Matriarch, Night Raid, and more across all maps.',
      },
      { property: 'og:title', content: 'Event Timers - ARC Raiders Wiki' },
      {
        property: 'og:description',
        content:
          'Live event timers for ARC Raiders. Track active and upcoming events.',
      },
    ],
  }),
})

function EventCard({ event }: { event: EventTimer }) {
  const [timeRemaining, setTimeRemaining] = useState(
    event.status === 'active' ? event.timeUntilEnd : event.timeUntilStart,
  )

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (event.status === 'active' && event.nextEndTime) {
        setTimeRemaining(event.nextEndTime.getTime() - Date.now())
      } else if (event.nextStartTime) {
        setTimeRemaining(event.nextStartTime.getTime() - Date.now())
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [event])

  const isActive = event.status === 'active'

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all hover:scale-[1.01] ${
        isActive
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-zinc-900/50 border-zinc-800 hover:border-amber-500/30'
      }`}
    >
      {/* Active indicator pulse */}
      {isActive && (
        <div className="absolute top-4 right-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Event icon */}
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden ${
            isActive ? 'ring-2 ring-emerald-500/50' : ''
          }`}
        >
          {event.icon ? (
            <img
              src={event.icon}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <Zap className="h-7 w-7" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isActive ? 'ACTIVE NOW' : 'UPCOMING'}
            </span>
          </div>

          {/* Event name */}
          <h3
            className="text-xl font-bold text-zinc-100 mb-1"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {event.name}
          </h3>

          {/* Map location */}
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{event.map}</span>
          </div>

          {/* Time info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Countdown */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              <Timer className="h-4 w-4" />
              <span>
                {isActive ? 'Ends in ' : 'Starts in '}
                {timeRemaining !== undefined
                  ? formatTimeRemaining(timeRemaining)
                  : '--'}
              </span>
            </div>

            {/* Current/Next time slot in local time */}
            {(event.currentSlot || event.nextSlot) && (
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="h-4 w-4" />
                <span>
                  {formatTimeSlotLocal(event.currentSlot || event.nextSlot!)}
                </span>
                <span className="text-xs text-zinc-600">(your time)</span>
              </div>
            )}
          </div>

          {/* All scheduled times */}
          {event.times.length > 1 && (
            <details className="mt-3">
              <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400">
                View all {event.times.length} scheduled times
              </summary>
              <div className="mt-2 flex flex-wrap gap-2">
                {event.times.map((slot, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      slot === event.currentSlot
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : slot === event.nextSlot
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-zinc-800/50 text-zinc-400'
                    }`}
                  >
                    {formatTimeSlotLocal(slot)}
                  </span>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

function EventsPage() {
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'upcoming'
  >('all')
  const [mapFilter, setMapFilter] = useState<string>('')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('')
  const [, setTick] = useState(0)

  // Use TanStack Query hook
  const { data, isLoading, isError, error, refetch, isFetching } =
    useEventTimersRaw()

  // Process events and calculate status (recomputed when data changes or every minute)
  const processedEvents = useMemo(() => {
    if (!data?.events) return []
    return processEventTimers(data.events)
  }, [data?.events])

  // Re-process events every minute to update status
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Get filter options
  const maps = useMemo(() => getUniqueMaps(processedEvents), [processedEvents])
  const eventTypes = useMemo(
    () => getUniqueEventNames(processedEvents),
    [processedEvents],
  )

  // Filter events
  const filteredEvents = useMemo(() => {
    return processedEvents.filter((event) => {
      if (statusFilter === 'active' && event.status !== 'active') return false
      if (statusFilter === 'upcoming' && event.status !== 'upcoming')
        return false
      if (mapFilter && event.map !== mapFilter) return false
      if (eventTypeFilter && event.name !== eventTypeFilter) return false
      return true
    })
  }, [processedEvents, statusFilter, mapFilter, eventTypeFilter])

  // Count by status
  const activeCount = processedEvents.filter(
    (e) => e.status === 'active',
  ).length
  const upcomingCount = processedEvents.filter(
    (e) => e.status === 'upcoming',
  ).length

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-8 w-8 text-amber-400" />
              <h1
                className="text-3xl font-bold text-zinc-100"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                Event Timers
              </h1>
            </div>
            <p className="text-zinc-400">
              Track active and upcoming events in ARC Raiders
            </p>
          </div>

          {/* Quick stats skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 text-center"
              >
                <Skeleton className="h-9 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>

          <EventsListSkeleton count={4} />
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
            title="Failed to Load Events"
            message={error?.message || 'An unexpected error occurred'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-8 w-8 text-amber-400" />
            <h1
              className="text-3xl font-bold text-zinc-100"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Event Timers
            </h1>
            {isFetching && !isLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <p className="text-zinc-400">
            Track active and upcoming events across all maps
          </p>

          <div className="mt-2 flex items-center gap-4">
            <CacheIndicator
              fromCache={data?.fromCache || false}
              cachedAt={data?.cachedAt}
            />
            <span className="text-xs text-zinc-600">
              Times shown in your local timezone
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() =>
              setStatusFilter(statusFilter === 'active' ? 'all' : 'active')
            }
            className={`rounded-xl p-4 text-center transition-all ${
              statusFilter === 'active'
                ? 'bg-emerald-500/20 border-2 border-emerald-500/50 ring-2 ring-emerald-500/20'
                : 'bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-3xl font-bold text-emerald-400">
                {activeCount}
              </span>
            </div>
            <div className="text-sm text-zinc-400">Active Now</div>
          </button>

          <button
            onClick={() =>
              setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')
            }
            className={`rounded-xl p-4 text-center transition-all ${
              statusFilter === 'upcoming'
                ? 'bg-amber-500/20 border-2 border-amber-500/50 ring-2 ring-amber-500/20'
                : 'bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="h-5 w-5 text-amber-400" />
              <span className="text-3xl font-bold text-amber-400">
                {upcomingCount}
              </span>
            </div>
            <div className="text-sm text-zinc-400">Upcoming</div>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-zinc-500">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters:</span>
          </div>

          {/* Map filter */}
          <select
            value={mapFilter}
            onChange={(e) => setMapFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="">All Maps</option>
            {maps.map((map) => (
              <option key={map} value={map}>
                {map}
              </option>
            ))}
          </select>

          {/* Event type filter */}
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="">All Events</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {(statusFilter !== 'all' || mapFilter || eventTypeFilter) && (
            <button
              onClick={() => {
                setStatusFilter('all')
                setMapFilter('')
                setEventTypeFilter('')
              }}
              className="px-3 py-2 text-sm text-amber-400 hover:text-amber-300"
            >
              Clear all
            </button>
          )}

          <span className="ml-auto text-sm text-zinc-500">
            {filteredEvents.length} events
          </span>
        </div>

        {/* Events list */}
        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="events"
            title="No Events Found"
            description={
              statusFilter !== 'all' || mapFilter || eventTypeFilter
                ? 'Try adjusting your filters'
                : 'No events available'
            }
          />
        )}

        {/* Timezone info */}
        <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-500">
            <strong className="text-zinc-400">About event times:</strong> All
            event times from the API are in UTC and have been converted to your
            local timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone}).
            Events repeat daily at the scheduled times.
          </p>
        </div>
      </div>
    </div>
  )
}
