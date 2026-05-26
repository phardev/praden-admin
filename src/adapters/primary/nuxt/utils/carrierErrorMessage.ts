import type { CarrierErrorDetail } from '@core/errors/CarrierLabelError'

type Translate = (key: string, params?: Record<string, unknown>) => string

const FR_BY_ERROR_ID: Record<string, (raw: string) => string> = {
  ShopIsOnHoliday: (raw) => `Point relais en congés. ${raw}`,
  UnknownZipCodeCity: () => 'Adresse invalide : code postal / ville inconnus.'
}

export const carrierErrorToFrench = (
  detail: CarrierErrorDetail | null,
  t: Translate
): string => {
  if (!detail) return t('orders.deliveries.carrierGenericError')
  const mapper = detail.errorId ? FR_BY_ERROR_ID[detail.errorId] : null
  if (mapper) return mapper(detail.rawMessage)
  return t('orders.deliveries.carrierRawError', { reason: detail.rawMessage })
}
