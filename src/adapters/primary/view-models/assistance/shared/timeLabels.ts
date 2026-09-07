import type { Timestamp } from '@core/types/types'
import { differenceInCalendarDays, format, isSameYear } from 'date-fns'
import { fr } from 'date-fns/locale'

export interface TimeLabelVM {
  key: string
  params: Record<string, string | number>
}

const ONE_MINUTE = 60 * 1000
const ONE_HOUR = 60 * ONE_MINUTE

const label = (
  suffix: string,
  params: Record<string, string | number> = {}
): TimeLabelVM => ({ key: `assistance.time.${suffix}`, params })

const formatTime = (timestamp: Timestamp): string =>
  format(timestamp, 'HH:mm', { locale: fr })

const formatDate = (timestamp: Timestamp, now: Timestamp): string =>
  format(timestamp, isSameYear(timestamp, now) ? 'd MMM' : 'd MMM yyyy', {
    locale: fr
  })

const daysBefore = (timestamp: Timestamp, now: Timestamp): number =>
  differenceInCalendarDays(now, timestamp)

export const formatLastActivity = (
  timestamp: Timestamp,
  now: Timestamp
): TimeLabelVM => {
  const elapsed = now - timestamp
  if (elapsed < ONE_MINUTE) return label('justNow')
  if (elapsed < ONE_HOUR)
    return label('minutesAgo', { n: Math.floor(elapsed / ONE_MINUTE) })
  const days = daysBefore(timestamp, now)
  if (days === 0)
    return label('hoursAgo', { n: Math.floor(elapsed / ONE_HOUR) })
  if (days === 1) return label('yesterday', { time: formatTime(timestamp) })
  return label('date', { date: formatDate(timestamp, now) })
}

export const formatMessageTime = (
  timestamp: Timestamp,
  now: Timestamp
): TimeLabelVM => {
  const days = daysBefore(timestamp, now)
  if (days === 0) return label('today', { time: formatTime(timestamp) })
  if (days === 1) return label('yesterday', { time: formatTime(timestamp) })
  return label('dateTime', {
    date: formatDate(timestamp, now),
    time: formatTime(timestamp)
  })
}

export const formatFullDateTime = (timestamp: Timestamp): string =>
  format(timestamp, 'd MMM yyyy, HH:mm', { locale: fr })
