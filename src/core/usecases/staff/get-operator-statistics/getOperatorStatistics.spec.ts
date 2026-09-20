import type { OperatorStatisticsParams } from '@core/gateways/operatorStatisticsGateway'
import { getOperatorStatistics } from '@core/usecases/staff/get-operator-statistics/getOperatorStatistics'
import { InMemoryOperatorStatisticsGateway } from '@core/usecases/staff/get-operator-statistics/inMemoryOperatorStatisticsGateway'
import { useStatsStore } from '@store/statsStore'
import { operatorStatisticsReport } from '@utils/testData/operatorStatistics'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Get operator statistics', () => {
  let operatorStatisticsGateway: InMemoryOperatorStatisticsGateway

  const params: OperatorStatisticsParams = {
    startDate: new Date('2026-09-01T00:00:00.000Z'),
    endDate: new Date('2026-09-02T23:59:59.999Z'),
    timezone: 'Europe/Paris'
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    operatorStatisticsGateway = new InMemoryOperatorStatisticsGateway()
    operatorStatisticsGateway.feedWith(operatorStatisticsReport)
  })

  it('should store the report', async () => {
    await getOperatorStatistics(params, operatorStatisticsGateway)
    expect(useStatsStore().operatorStatistics).toStrictEqual(
      operatorStatisticsReport
    )
  })

  it('should query the gateway with the requested params', async () => {
    await getOperatorStatistics(params, operatorStatisticsGateway)
    expect(operatorStatisticsGateway.lastCalledWith).toStrictEqual(params)
  })

  it('should stop loading once the report is stored', async () => {
    await getOperatorStatistics(params, operatorStatisticsGateway)
    expect(useStatsStore().isLoadingOperatorStatistics).toBe(false)
  })

  it('should stop loading when the gateway fails', async () => {
    const failingGateway = new InMemoryOperatorStatisticsGateway()
    await expect(
      getOperatorStatistics(params, failingGateway)
    ).rejects.toThrow()
    expect(useStatsStore().isLoadingOperatorStatistics).toBe(false)
  })
})
