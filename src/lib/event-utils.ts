/**
 * Utilities for processing event timers
 * Events have recurring time slots in UTC - we need to calculate
 * which are active, upcoming, and when the next occurrence is
 */

import type { EventTimerRaw, EventTimer, EventTimeSlot } from './metaforge-api'

/**
 * Parse a time string "HH:MM" into hours and minutes
 */
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return { hours, minutes }
}

/**
 * Get today's date at a specific UTC time
 */
function getDateAtUtcTime(hours: number, minutes: number, dayOffset = 0): Date {
  const now = new Date()
  const date = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + dayOffset,
    hours,
    minutes,
    0,
    0
  ))
  return date
}

/**
 * Check if current time is within a time slot (in UTC)
 */
function isWithinTimeSlot(slot: EventTimeSlot): boolean {
  const now = new Date()
  const { hours: startHours, minutes: startMinutes } = parseTime(slot.start)
  const { hours: endHours, minutes: endMinutes } = parseTime(slot.end)
  
  const startTime = getDateAtUtcTime(startHours, startMinutes)
  let endTime = getDateAtUtcTime(endHours, endMinutes)
  
  // Handle slots that cross midnight (e.g., "23:00" to "24:00" or "01:00")
  if (endHours < startHours || (endHours === startHours && endMinutes < startMinutes)) {
    endTime = getDateAtUtcTime(endHours, endMinutes, 1)
  }
  
  // Handle "24:00" as midnight of next day
  if (slot.end === "24:00") {
    endTime = getDateAtUtcTime(0, 0, 1)
  }
  
  return now >= startTime && now < endTime
}

/**
 * Get the next occurrence of a time slot
 * Returns the start time of the next occurrence
 */
function getNextOccurrence(slot: EventTimeSlot): { start: Date; end: Date } {
  const now = new Date()
  const { hours: startHours, minutes: startMinutes } = parseTime(slot.start)
  const { hours: endHours, minutes: endMinutes } = parseTime(slot.end)
  
  // Try today first
  let startTime = getDateAtUtcTime(startHours, startMinutes)
  let endTime = getDateAtUtcTime(endHours, endMinutes)
  
  // Handle "24:00" as midnight
  if (slot.end === "24:00") {
    endTime = getDateAtUtcTime(0, 0, 1)
  }
  
  // Handle slots that cross midnight
  if (endHours < startHours || (endHours === startHours && endMinutes < startMinutes) || slot.end === "24:00") {
    if (now >= startTime) {
      // We're past the start, end is tomorrow
      endTime = getDateAtUtcTime(endHours === 24 ? 0 : endHours, endMinutes, 1)
    }
  }
  
  // If end time has passed, get tomorrow's occurrence
  if (now >= endTime) {
    startTime = getDateAtUtcTime(startHours, startMinutes, 1)
    endTime = getDateAtUtcTime(endHours === 24 ? 0 : endHours, endMinutes, slot.end === "24:00" ? 2 : 1)
    
    if (endHours < startHours || slot.end === "24:00") {
      endTime = getDateAtUtcTime(endHours === 24 ? 0 : endHours, endMinutes, 2)
    }
  }
  
  return { start: startTime, end: endTime }
}

/**
 * Process raw event data and calculate status
 */
export function processEventTimer(raw: EventTimerRaw, index: number): EventTimer {
  const now = new Date()
  
  // Check if any time slot is currently active
  let status: 'active' | 'upcoming' | 'ended' = 'upcoming'
  let currentSlot: EventTimeSlot | undefined
  let nextSlot: EventTimeSlot | undefined
  let nextStartTime: Date | undefined
  let nextEndTime: Date | undefined
  
  // Find active slot
  for (const slot of raw.times) {
    if (isWithinTimeSlot(slot)) {
      status = 'active'
      currentSlot = slot
      
      // Calculate end time for active slot
      const { hours: endHours, minutes: endMinutes } = parseTime(slot.end)
      nextEndTime = getDateAtUtcTime(endHours === 24 ? 0 : endHours, endMinutes)
      
      // Handle "24:00" and cross-midnight
      if (slot.end === "24:00" || endHours < parseTime(slot.start).hours) {
        const { hours: startHours } = parseTime(slot.start)
        if (now.getUTCHours() >= startHours) {
          nextEndTime = getDateAtUtcTime(endHours === 24 ? 0 : endHours, endMinutes, 1)
        }
      }
      break
    }
  }
  
  // Find next upcoming slot
  let earliestNext: { slot: EventTimeSlot; start: Date; end: Date } | null = null
  
  for (const slot of raw.times) {
    if (slot === currentSlot) continue
    
    const occurrence = getNextOccurrence(slot)
    
    if (!earliestNext || occurrence.start < earliestNext.start) {
      earliestNext = { slot, ...occurrence }
    }
  }
  
  if (earliestNext) {
    nextSlot = earliestNext.slot
    nextStartTime = earliestNext.start
    if (status !== 'active') {
      nextEndTime = earliestNext.end
    }
  }
  
  // Calculate time differences
  let timeUntilStart: number | undefined
  let timeUntilEnd: number | undefined
  
  if (status === 'active' && nextEndTime) {
    timeUntilEnd = nextEndTime.getTime() - now.getTime()
  }
  
  if (nextStartTime && status !== 'active') {
    timeUntilStart = nextStartTime.getTime() - now.getTime()
  }
  
  return {
    id: `${raw.name}-${raw.map}-${index}`,
    name: raw.name,
    map: raw.map,
    icon: raw.icon,
    description: raw.description,
    times: raw.times,
    status,
    currentSlot,
    nextSlot: status === 'active' ? nextSlot : (nextSlot || raw.times[0]),
    nextStartTime,
    nextEndTime,
    timeUntilStart,
    timeUntilEnd,
  }
}

/**
 * Process all raw events and sort by status/time
 */
export function processEventTimers(rawEvents: EventTimerRaw[]): EventTimer[] {
  const processed = rawEvents.map((raw, index) => processEventTimer(raw, index))
  
  // Sort: active first, then by next start time
  return processed.sort((a, b) => {
    // Active events first
    if (a.status === 'active' && b.status !== 'active') return -1
    if (b.status === 'active' && a.status !== 'active') return 1
    
    // Then by time until next occurrence
    const aTime = a.status === 'active' ? a.timeUntilEnd : a.timeUntilStart
    const bTime = b.status === 'active' ? b.timeUntilEnd : b.timeUntilStart
    
    if (aTime === undefined) return 1
    if (bTime === undefined) return -1
    
    return aTime - bTime
  })
}

/**
 * Format time remaining in a human-readable way
 */
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Now'
  
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
  
  if (minutes > 0) {
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }
  
  return `${seconds}s`
}

/**
 * Format a UTC time slot to local time
 */
export function formatTimeSlotLocal(slot: EventTimeSlot): string {
  const { hours: startHours, minutes: startMinutes } = parseTime(slot.start)
  const { hours: endHours, minutes: endMinutes } = parseTime(slot.end)
  
  const startDate = getDateAtUtcTime(startHours, startMinutes)
  let endDate = getDateAtUtcTime(endHours === 24 ? 0 : endHours, endMinutes)
  
  if (slot.end === "24:00") {
    endDate = getDateAtUtcTime(0, 0, 1)
  }
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }
  
  const startStr = startDate.toLocaleTimeString(undefined, formatOptions)
  const endStr = endDate.toLocaleTimeString(undefined, formatOptions)
  
  return `${startStr} - ${endStr}`
}

/**
 * Get all unique maps from events
 */
export function getUniqueMaps(events: EventTimer[]): string[] {
  return [...new Set(events.map(e => e.map))].sort()
}

/**
 * Get all unique event names
 */
export function getUniqueEventNames(events: EventTimer[]): string[] {
  return [...new Set(events.map(e => e.name))].sort()
}

