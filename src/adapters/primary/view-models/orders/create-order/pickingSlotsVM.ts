import type { Timestamp } from '@core/types/types'

export const PICKING_HOURS = [
  '9:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30'
]

const SAME_DAY_MINIMUM_DELAY_MINUTES = 180

export const availablePickingHours = (
  pickingDay: Timestamp,
  now: Timestamp
): Array<string> => {
  if (!isSameDay(pickingDay, now)) {
    return [...PICKING_HOURS]
  }
  const nowDate = new Date(now)
  const minimumMinutes =
    nowDate.getHours() * 60 +
    nowDate.getMinutes() +
    SAME_DAY_MINIMUM_DELAY_MINUTES
  return PICKING_HOURS.filter((hour) => hourToMinutes(hour) >= minimumMinutes)
}

export const combinePickingDateAndHour = (
  pickingDay: Timestamp,
  hour: string
): Timestamp => {
  const [hours, minutes] = hour.split(':').map(Number)
  const slot = new Date(pickingDay)
  slot.setHours(hours, minutes, 0, 0)
  return slot.getTime()
}

const isSameDay = (a: Timestamp, b: Timestamp): boolean => {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

const hourToMinutes = (hour: string): number => {
  const [hours, minutes] = hour.split(':').map(Number)
  return hours * 60 + minutes
}
