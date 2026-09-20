import { getOperatorStatisticsVM } from '@adapters/primary/view-models/staff/operator-statistics/getOperatorStatisticsVM'
import { useStatsStore } from '@store/statsStore'
import {
  operatorStatisticsReport,
  pharmacistStatistics,
  preparatorStatistics
} from '@utils/testData/operatorStatistics'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Get operator statistics VM', () => {
  let statsStore: ReturnType<typeof useStatsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    statsStore = useStatsStore()
    statsStore.operatorStatistics = operatorStatisticsReport
  })

  it('should expose the team averages and totals as KPIs', () => {
    expect(getOperatorStatisticsVM().kpis).toStrictEqual([
      {
        metric: 'orders',
        labelKey: 'staff.statistics.kpi.ordersPerDay',
        average: '5,0',
        total: '10'
      },
      {
        metric: 'lines',
        labelKey: 'staff.statistics.kpi.linesPerDay',
        average: '18,5',
        total: '37'
      },
      {
        metric: 'boxes',
        labelKey: 'staff.statistics.kpi.boxesPerDay',
        average: '38,0',
        total: '76'
      }
    ])
  })

  it('should put the team row first and select it by default', () => {
    expect(getOperatorStatisticsVM().rows[0]).toStrictEqual({
      uuid: undefined,
      isTeam: true,
      isSelected: true,
      name: '',
      activeDays: '2',
      orders: '10',
      ordersPerDay: '5,0',
      lines: '37',
      linesPerDay: '18,5',
      boxes: '76',
      boxesPerDay: '38,0'
    })
  })

  it('should list the operators after the team row with their daily rate', () => {
    expect(getOperatorStatisticsVM().rows[1]).toStrictEqual({
      uuid: preparatorStatistics.operatorUuid,
      isTeam: false,
      isSelected: false,
      name: 'John Doe',
      activeDays: '2',
      orders: '8',
      ordersPerDay: '4,0',
      lines: '30',
      linesPerDay: '15,0',
      boxes: '65',
      boxesPerDay: '32,5'
    })
  })

  it('should mark the selected operator', () => {
    statsStore.selectedOperatorUuid = pharmacistStatistics.operatorUuid
    expect(
      getOperatorStatisticsVM().rows.filter((row) => row.isSelected)
    ).toStrictEqual([
      {
        uuid: pharmacistStatistics.operatorUuid,
        isTeam: false,
        isSelected: true,
        name: 'Jane Doew',
        activeDays: '1',
        orders: '2',
        ordersPerDay: '2,0',
        lines: '7',
        linesPerDay: '7,0',
        boxes: '11',
        boxesPerDay: '11,0'
      }
    ])
  })

  it('should count the staff without activity', () => {
    expect(getOperatorStatisticsVM().inactiveStaffCount).toBe(
      operatorStatisticsReport.inactiveStaffCount
    )
  })

  it('should plot the team series of the selected metric', () => {
    statsStore.selectedMetric = 'boxes'
    expect(getOperatorStatisticsVM().chartPoints).toStrictEqual([
      { day: '2026-09-01', label: '01/09', value: 36 },
      { day: '2026-09-02', label: '02/09', value: 40 }
    ])
  })

  it('should zero fill a day without activity for the selected operator', () => {
    statsStore.selectedOperatorUuid = pharmacistStatistics.operatorUuid
    statsStore.selectedMetric = 'orders'
    expect(getOperatorStatisticsVM().chartPoints).toStrictEqual([
      { day: '2026-09-01', label: '01/09', value: 2 },
      { day: '2026-09-02', label: '02/09', value: 0 }
    ])
  })

  it('should detail the days of the selection', () => {
    statsStore.selectedOperatorUuid = preparatorStatistics.operatorUuid
    expect(getOperatorStatisticsVM().dailyRows).toStrictEqual([
      { day: '01/09/2026', orders: '3', lines: '12', boxes: '25' },
      { day: '02/09/2026', orders: '5', lines: '18', boxes: '40' }
    ])
  })

  it('should label the selected period in the report timezone', () => {
    expect(getOperatorStatisticsVM().periodLabel).toBe(
      '01/09/2026 – 02/09/2026'
    )
  })

  it('should name the selected operator', () => {
    statsStore.selectedOperatorUuid = preparatorStatistics.operatorUuid
    expect(getOperatorStatisticsVM().selectedName).toBe('John Doe')
  })

  it('should report that nothing was prepared over the period', () => {
    statsStore.operatorStatistics = {
      ...operatorStatisticsReport,
      team: {
        totals: { orders: 0, lines: 0, boxes: 0, activeDays: 0 },
        averagePerDay: { orders: 0, lines: 0, boxes: 0 },
        daily: []
      },
      operators: []
    }
    expect(getOperatorStatisticsVM().emptyReason).toBe('no-data')
  })

  it('should report a period starting before the available data', () => {
    statsStore.operatorStatistics = {
      ...operatorStatisticsReport,
      period: {
        ...operatorStatisticsReport.period,
        startDate: '2026-01-01T00:00:00.000Z'
      },
      team: {
        totals: { orders: 0, lines: 0, boxes: 0, activeDays: 0 },
        averagePerDay: { orders: 0, lines: 0, boxes: 0 },
        daily: []
      },
      operators: []
    }
    expect(getOperatorStatisticsVM().emptyReason).toBe('before-data-start')
  })

  it('should return an empty view model while nothing is loaded', () => {
    statsStore.operatorStatistics = undefined
    expect(getOperatorStatisticsVM()).toStrictEqual({
      isLoading: false,
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
  })
})
