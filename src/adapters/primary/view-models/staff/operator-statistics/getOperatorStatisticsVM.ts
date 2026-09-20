import type {
  OperatorCounts,
  OperatorDailyCounts,
  OperatorStatistics,
  OperatorStatisticsReport,
  OperatorTotals,
  TeamStatistics
} from '@core/entities/operatorStatistics'
import type { OperatorMetric } from '@store/statsStore'
import { useStatsStore } from '@store/statsStore'
import { formatAverage, formatCount } from '@utils/formatters'
import { getStaffDisplayName } from '@utils/staff'

export interface OperatorStatsKpiVM {
  metric: OperatorMetric
  labelKey: string
  average: string
  total: string
}

export interface OperatorStatsRowVM {
  uuid: string | undefined
  isTeam: boolean
  isSelected: boolean
  name: string
  activeDays: string
  orders: string
  ordersPerDay: string
  lines: string
  linesPerDay: string
  boxes: string
  boxesPerDay: string
}

export interface OperatorStatsChartPointVM {
  day: string
  label: string
  value: number
}

export interface OperatorStatsDailyRowVM {
  day: string
  orders: string
  lines: string
  boxes: string
}

export type OperatorStatsEmptyReason = 'no-data' | 'before-data-start'

export interface OperatorStatisticsVM {
  isLoading: boolean
  hasData: boolean
  emptyReason: OperatorStatsEmptyReason | undefined
  kpis: Array<OperatorStatsKpiVM>
  rows: Array<OperatorStatsRowVM>
  inactiveStaffCount: number
  selectedMetric: OperatorMetric
  selectedName: string
  isTeamSelected: boolean
  periodLabel: string
  chartPoints: Array<OperatorStatsChartPointVM>
  dailyRows: Array<OperatorStatsDailyRowVM>
}

const KPI_LABEL_KEYS: Record<OperatorMetric, string> = {
  orders: 'staff.statistics.kpi.ordersPerDay',
  lines: 'staff.statistics.kpi.linesPerDay',
  boxes: 'staff.statistics.kpi.boxesPerDay'
}

const METRICS: Array<OperatorMetric> = ['orders', 'lines', 'boxes']

const emptyVM = (isLoading: boolean): OperatorStatisticsVM => ({
  isLoading,
  hasData: false,
  emptyReason: undefined,
  kpis: [],
  rows: [],
  inactiveStaffCount: 0,
  selectedMetric: 'orders',
  selectedName: '',
  isTeamSelected: true,
  periodLabel: '',
  chartPoints: [],
  dailyRows: []
})

export const getOperatorStatisticsVM = (): OperatorStatisticsVM => {
  const statsStore = useStatsStore()
  const report = statsStore.operatorStatistics
  if (!report) return emptyVM(statsStore.isLoadingOperatorStatistics)

  const selected = findSelectedOperator(report, statsStore.selectedOperatorUuid)
  const selectedSeries = selected ? selected.daily : report.team.daily

  return {
    isLoading: statsStore.isLoadingOperatorStatistics,
    hasData: report.team.daily.length > 0,
    emptyReason: resolveEmptyReason(report),
    kpis: buildKpis(report.team),
    rows: buildRows(report, statsStore.selectedOperatorUuid),
    inactiveStaffCount: report.inactiveStaffCount,
    selectedMetric: statsStore.selectedMetric,
    selectedName: selected ? getStaffDisplayName(selected) : '',
    isTeamSelected: !selected,
    periodLabel: buildPeriodLabel(report),
    chartPoints: buildChartPoints(
      report.team.daily,
      selectedSeries,
      statsStore.selectedMetric
    ),
    dailyRows: selectedSeries.map(toDailyRow(report.period.timezone))
  }
}

const findSelectedOperator = (
  report: OperatorStatisticsReport,
  selectedOperatorUuid: string | undefined
): OperatorStatistics | undefined =>
  report.operators.find(
    (operator) => operator.operatorUuid === selectedOperatorUuid
  )

const resolveEmptyReason = (
  report: OperatorStatisticsReport
): OperatorStatsEmptyReason | undefined => {
  if (report.team.daily.length > 0) return undefined
  if (
    new Date(report.period.startDate).getTime() <
    new Date(report.period.dataAvailableFrom).getTime()
  ) {
    return 'before-data-start'
  }
  return 'no-data'
}

const buildKpis = (team: TeamStatistics): Array<OperatorStatsKpiVM> =>
  METRICS.map((metric) => ({
    metric,
    labelKey: KPI_LABEL_KEYS[metric],
    average: formatAverage(team.averagePerDay[metric]),
    total: formatCount(team.totals[metric])
  }))

const buildRows = (
  report: OperatorStatisticsReport,
  selectedOperatorUuid: string | undefined
): Array<OperatorStatsRowVM> => [
  {
    uuid: undefined,
    isTeam: true,
    isSelected: !findSelectedOperator(report, selectedOperatorUuid),
    name: '',
    ...toFormattedRow(report.team.totals, report.team.averagePerDay)
  },
  ...report.operators.map((operator) => ({
    uuid: operator.operatorUuid,
    isTeam: false,
    isSelected: operator.operatorUuid === selectedOperatorUuid,
    name: getStaffDisplayName(operator),
    ...toFormattedRow(operator.totals, operator.averagePerDay)
  }))
]

const toFormattedRow = (
  totals: OperatorTotals,
  averagePerDay: OperatorCounts
) => ({
  activeDays: formatCount(totals.activeDays),
  orders: formatCount(totals.orders),
  ordersPerDay: formatAverage(averagePerDay.orders),
  lines: formatCount(totals.lines),
  linesPerDay: formatAverage(averagePerDay.lines),
  boxes: formatCount(totals.boxes),
  boxesPerDay: formatAverage(averagePerDay.boxes)
})

const toFormattedCounts = (counts: OperatorCounts) => ({
  orders: formatCount(counts.orders),
  lines: formatCount(counts.lines),
  boxes: formatCount(counts.boxes)
})

const buildChartPoints = (
  teamSeries: Array<OperatorDailyCounts>,
  selectedSeries: Array<OperatorDailyCounts>,
  metric: OperatorMetric
): Array<OperatorStatsChartPointVM> => {
  const valueByDay = new Map(
    selectedSeries.map((day) => [day.day, day[metric]])
  )
  return buildDaySpan(teamSeries).map((day) => ({
    day,
    label: toShortDayLabel(day),
    value: valueByDay.get(day) ?? 0
  }))
}

const buildDaySpan = (series: Array<OperatorDailyCounts>): Array<string> => {
  if (series.length === 0) return []
  const days: Array<string> = []
  const lastDay = series[series.length - 1].day
  let current = series[0].day
  while (current <= lastDay) {
    days.push(current)
    current = nextDay(current)
  }
  return days
}

const nextDay = (day: string): string => {
  const date = new Date(`${day}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

const toShortDayLabel = (day: string): string => {
  const [, month, dayOfMonth] = day.split('-')
  return `${dayOfMonth}/${month}`
}

const toDailyRow =
  (timezone: string) =>
  (day: OperatorDailyCounts): OperatorStatsDailyRowVM => ({
    day: formatDayInTimezone(`${day.day}T12:00:00.000Z`, timezone),
    ...toFormattedCounts(day)
  })

const buildPeriodLabel = (report: OperatorStatisticsReport): string => {
  const { startDate, endDate, timezone } = report.period
  return `${formatDayInTimezone(startDate, timezone)} – ${formatDayInTimezone(endDate, timezone)}`
}

const formatDayInTimezone = (isoDate: string, timezone: string): string =>
  new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: timezone
  }).format(new Date(isoDate))
