import {
  AnnouncementBar,
  AnnouncementBarSchedule,
  AnnouncementBarScheduleSegment
} from '@core/entities/announcementBar'
import { Timestamp } from '@core/types/types'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import { timestampToLocaleString } from '@utils/formatters'

export type AnnouncementBarTimelineState = 'DISPLAYED' | 'MASKED' | 'PAUSED'

interface Placement {
  leftPercent: number
  widthPercent: number
  startLabel: string
  endLabel: string
}

export interface AnnouncementBarTimelineSiteSegmentVM extends Placement {
  uuid?: string
  text: string
  isGap: boolean
  colorIndex?: number
}

export interface AnnouncementBarTimelineChangeVM {
  dateLabel: string
  text: string
  isGap: boolean
  colorIndex?: number
}

export interface AnnouncementBarTimelineRowSegmentVM extends Placement {
  state: AnnouncementBarTimelineState
}

export interface AnnouncementBarTimelineRowVM {
  uuid: string
  text: string
  colorIndex: number
  segments: Array<AnnouncementBarTimelineRowSegmentVM>
}

export interface AnnouncementBarTimelineTickVM {
  label: string
  leftPercent: number
}

export interface GetAnnouncementBarsTimelineVM {
  ticks: Array<AnnouncementBarTimelineTickVM>
  weekLines: Array<number>
  site: Array<AnnouncementBarTimelineSiteSegmentVM>
  rows: Array<AnnouncementBarTimelineRowVM>
  changes: Array<AnnouncementBarTimelineChangeVM>
}

interface Period {
  from: Timestamp
  to: Timestamp
}

const EMPTY_TIMELINE: GetAnnouncementBarsTimelineVM = {
  ticks: [],
  weekLines: [],
  site: [],
  rows: [],
  changes: []
}

const MONDAY = 1
const DAYS_IN_WEEK = 7

const roundToHundredth = (value: number): number =>
  Math.round(value * 100) / 100

const dayLabel = (timestamp: Timestamp): string =>
  timestampToLocaleString(timestamp, 'fr-FR', {
    day: 'numeric',
    month: 'short'
  })

const placementIn =
  (schedule: AnnouncementBarSchedule) =>
  (period: Period): Placement => {
    const span = schedule.to - schedule.from
    return {
      leftPercent: roundToHundredth(
        ((period.from - schedule.from) / span) * 100
      ),
      widthPercent: roundToHundredth(((period.to - period.from) / span) * 100),
      startLabel: dayLabel(period.from),
      endLabel: dayLabel(period.to - 1)
    }
  }

const monthStartsWithin = (schedule: AnnouncementBarSchedule): Array<Date> => {
  const first = new Date(schedule.from)
  const monthStarts: Array<Date> = []
  const cursor = new Date(first.getFullYear(), first.getMonth() + 1, 1)
  while (cursor.getTime() < schedule.to) {
    monthStarts.push(new Date(cursor))
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return monthStarts
}

const firstMondayAfter = (timestamp: Timestamp): Date => {
  const start = new Date(timestamp)
  const daysUntilMonday =
    (MONDAY - start.getDay() + DAYS_IN_WEEK) % DAYS_IN_WEEK || DAYS_IN_WEEK
  return new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate() + daysUntilMonday
  )
}

const toWeekLines = (schedule: AnnouncementBarSchedule): Array<number> => {
  const mondays: Array<number> = []
  const cursor = firstMondayAfter(schedule.from)
  while (cursor.getTime() < schedule.to) {
    mondays.push(
      placementIn(schedule)({ from: cursor.getTime(), to: cursor.getTime() })
        .leftPercent
    )
    cursor.setDate(cursor.getDate() + DAYS_IN_WEEK)
  }
  return mondays
}

const toTicks = (
  schedule: AnnouncementBarSchedule
): Array<AnnouncementBarTimelineTickVM> =>
  monthStartsWithin(schedule).map((monthStart) => ({
    label: timestampToLocaleString(monthStart.getTime(), 'fr-FR', {
      month: 'short'
    }),
    leftPercent: placementIn(schedule)({
      from: monthStart.getTime(),
      to: monthStart.getTime()
    }).leftPercent
  }))

const toSiteSegment =
  (
    schedule: AnnouncementBarSchedule,
    rows: Array<AnnouncementBarTimelineRowVM>
  ) =>
  (
    segment: AnnouncementBarScheduleSegment
  ): AnnouncementBarTimelineSiteSegmentVM => {
    const row = rows.find(({ uuid }) => uuid === segment.displayedUuid)
    return {
      uuid: segment.displayedUuid,
      text: row?.text ?? '',
      isGap: !segment.displayedUuid,
      colorIndex: row?.colorIndex,
      ...placementIn(schedule)(segment)
    }
  }

const changeDateLabel = (timestamp: Timestamp): string =>
  timestampToLocaleString(timestamp, 'fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })

const toChanges = (
  schedule: AnnouncementBarSchedule,
  site: Array<AnnouncementBarTimelineSiteSegmentVM>
): Array<AnnouncementBarTimelineChangeVM> =>
  schedule.segments.slice(1).map((segment, index) => {
    const { text, isGap, colorIndex } = site[index + 1]
    return {
      dateLabel: changeDateLabel(segment.from),
      text,
      isGap,
      colorIndex
    }
  })

const clipToSchedule = (
  bar: AnnouncementBar,
  schedule: AnnouncementBarSchedule
): Period => ({
  from: Math.max(bar.startDate ?? schedule.from, schedule.from),
  to: Math.min(
    bar.endDate !== undefined ? bar.endDate + 1 : schedule.to,
    schedule.to
  )
})

const intersect = (a: Period, b: Period): Period | undefined => {
  const from = Math.max(a.from, b.from)
  const to = Math.min(a.to, b.to)
  return from < to ? { from, to } : undefined
}

const statePeriods = (
  bar: AnnouncementBar,
  period: Period,
  schedule: AnnouncementBarSchedule
): Array<Period & { state: AnnouncementBarTimelineState }> => {
  if (!bar.isActive) {
    return [{ ...period, state: 'PAUSED' }]
  }
  return schedule.segments.flatMap((segment) => {
    const overlap = intersect(period, segment)
    if (!overlap) return []
    const state: AnnouncementBarTimelineState =
      segment.displayedUuid === bar.uuid ? 'DISPLAYED' : 'MASKED'
    return [{ ...overlap, state }]
  })
}

const mergeSameState = (
  periods: Array<Period & { state: AnnouncementBarTimelineState }>
) =>
  periods.reduce<Array<Period & { state: AnnouncementBarTimelineState }>>(
    (merged, period) => {
      const previous = merged[merged.length - 1]
      if (
        previous &&
        previous.to === period.from &&
        previous.state === period.state
      ) {
        return [...merged.slice(0, -1), { ...previous, to: period.to }]
      }
      return [...merged, period]
    },
    []
  )

const byPausedLastThenChronological = (
  a: { bar: AnnouncementBar; period: Period },
  b: { bar: AnnouncementBar; period: Period }
): number =>
  Number(!a.bar.isActive) - Number(!b.bar.isActive) ||
  a.period.from - b.period.from ||
  a.period.to - b.period.to

const toRows = (
  schedule: AnnouncementBarSchedule,
  items: Array<AnnouncementBar>
): Array<AnnouncementBarTimelineRowVM> =>
  items
    .map((bar) => ({ bar, period: clipToSchedule(bar, schedule) }))
    .filter(({ period }) => period.from < period.to)
    .sort(byPausedLastThenChronological)
    .map(({ bar, period }, colorIndex) => ({
      uuid: bar.uuid,
      text: bar.text,
      colorIndex,
      segments: mergeSameState(statePeriods(bar, period, schedule)).map(
        ({ state, ...statePeriod }) => ({
          state,
          ...placementIn(schedule)(statePeriod)
        })
      )
    }))

export const getAnnouncementBarsTimelineVM =
  (): GetAnnouncementBarsTimelineVM => {
    const { items, schedule } = useAnnouncementBarStore()
    if (schedule.to <= schedule.from) {
      return EMPTY_TIMELINE
    }
    const rows = toRows(schedule, items)
    const site = schedule.segments.map(toSiteSegment(schedule, rows))
    return {
      ticks: toTicks(schedule),
      weekLines: toWeekLines(schedule),
      site,
      rows,
      changes: toChanges(schedule, site)
    }
  }
