export type CarrierName = 'colissimo' | 'dpd'

export interface CarrierErrorDetail {
  carrier: CarrierName
  errorId: string | null
  rawMessage: string
}

export class CarrierLabelError extends Error {
  constructor(public readonly detail: CarrierErrorDetail | null) {
    super(
      detail
        ? `Carrier ${detail.carrier} error${detail.errorId ? ` (${detail.errorId})` : ''}: ${detail.rawMessage}`
        : 'Carrier error (unparseable)'
    )
  }
}
