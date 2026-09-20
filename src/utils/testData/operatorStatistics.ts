import type {
  OperatorStatistics,
  OperatorStatisticsReport
} from '@core/entities/operatorStatistics'

export const preparatorStatistics: OperatorStatistics = {
  operatorUuid: 'staff-john-doe-uuid',
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  role: { uuid: 'preparator-role-uuid', name: 'Préparateur' },
  totals: { orders: 8, lines: 30, boxes: 65, activeDays: 2 },
  averagePerDay: { orders: 4, lines: 15, boxes: 32.5 },
  daily: [
    { day: '2026-09-01', orders: 3, lines: 12, boxes: 25 },
    { day: '2026-09-02', orders: 5, lines: 18, boxes: 40 }
  ]
}

export const pharmacistStatistics: OperatorStatistics = {
  operatorUuid: 'staff-jane-doe-uuid',
  firstname: 'Jane',
  lastname: 'Doew',
  email: 'jane.doew@example.com',
  role: { uuid: 'pharmacist-role-uuid', name: 'Pharmacien' },
  totals: { orders: 2, lines: 7, boxes: 11, activeDays: 1 },
  averagePerDay: { orders: 2, lines: 7, boxes: 11 },
  daily: [{ day: '2026-09-01', orders: 2, lines: 7, boxes: 11 }]
}

export const operatorStatisticsReport: OperatorStatisticsReport = {
  period: {
    startDate: '2026-08-31T22:00:00.000Z',
    endDate: '2026-09-02T21:59:59.999Z',
    timezone: 'Europe/Paris',
    dataAvailableFrom: '2026-04-27T00:00:00.000Z'
  },
  team: {
    totals: { orders: 10, lines: 37, boxes: 76, activeDays: 2 },
    averagePerDay: { orders: 5, lines: 18.5, boxes: 38 },
    daily: [
      { day: '2026-09-01', orders: 5, lines: 19, boxes: 36 },
      { day: '2026-09-02', orders: 5, lines: 18, boxes: 40 }
    ]
  },
  operators: [preparatorStatistics, pharmacistStatistics],
  inactiveStaffCount: 1
}
