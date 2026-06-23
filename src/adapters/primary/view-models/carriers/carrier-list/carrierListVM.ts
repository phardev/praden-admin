import type { CarrierType } from '@core/entities/carrier'
import type {
  DeliveryMethod,
  PriceRangesByCountry,
  PriceWeightRange
} from '@core/entities/order'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { formatCurrency } from '@utils/formatters'

export interface CarrierTariffRowVM {
  weightRange: string
  prices: Record<string, string>
}

export interface CarrierDeliveryMethodVM {
  uuid: string
  name: string
  delay: string | null
  hasPriceRanges: boolean
  countries: Array<string>
  rows: Array<CarrierTariffRowVM>
}

export interface CarrierListItemVM {
  uuid: string
  name: string
  type: CarrierType
  deliveryMethods: Array<CarrierDeliveryMethodVM>
}

const PRIORITY_COUNTRY = 'FRANCE'
const MISSING_PRICE = '—'

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

const formatWeight = (weightInGrams: number): string =>
  new Intl.NumberFormat('fr-FR').format(weightInGrams / 1000)

const formatWeightRange = (range: PriceWeightRange): string =>
  `${formatWeight(range.minWeight)} - ${formatWeight(range.maxWeight)} kg`

const orderCountries = (countries: Array<string>): Array<string> =>
  [...countries].sort((a, b) => {
    if (a === PRIORITY_COUNTRY) return -1
    if (b === PRIORITY_COUNTRY) return 1
    return a.localeCompare(b)
  })

const rangeKey = (range: PriceWeightRange): string =>
  `${range.minWeight}-${range.maxWeight}`

const collectBands = (
  countryKeys: Array<string>,
  priceRanges: PriceRangesByCountry
): Array<PriceWeightRange> => {
  const bands = new Map<string, PriceWeightRange>()
  for (const country of countryKeys) {
    for (const range of priceRanges[country]) {
      bands.set(rangeKey(range), range)
    }
  }
  return [...bands.values()].sort(
    (a, b) => a.minWeight - b.minWeight || a.maxWeight - b.maxWeight
  )
}

const buildRows = (
  bands: Array<PriceWeightRange>,
  countryKeys: Array<string>,
  priceRanges: PriceRangesByCountry
): Array<CarrierTariffRowVM> =>
  bands.map((band) => {
    const prices: Record<string, string> = {}
    for (const country of countryKeys) {
      const match = priceRanges[country].find(
        (range) => rangeKey(range) === rangeKey(band)
      )
      prices[capitalize(country)] = match
        ? formatCurrency(match.price / 100)
        : MISSING_PRICE
    }
    return { weightRange: formatWeightRange(band), prices }
  })

const mapDeliveryMethod = (
  deliveryMethod: DeliveryMethod
): CarrierDeliveryMethodVM => {
  const priceRanges = deliveryMethod.priceRanges
  const countryKeys = Array.isArray(priceRanges)
    ? []
    : orderCountries(Object.keys(priceRanges))

  return {
    uuid: deliveryMethod.uuid,
    name: deliveryMethod.name,
    delay: deliveryMethod.delay ?? null,
    hasPriceRanges: countryKeys.length > 0,
    countries: countryKeys.map(capitalize),
    rows: buildRows(
      collectBands(countryKeys, priceRanges),
      countryKeys,
      priceRanges
    )
  }
}

const byName = (a: { name: string }, b: { name: string }): number =>
  a.name.localeCompare(b.name)

export const getCarrierListVM = (): Array<CarrierListItemVM> => {
  const deliveryMethodStore = useDeliveryMethodStore()

  const carriers = new Map<string, CarrierListItemVM>()

  for (const deliveryMethod of deliveryMethodStore.items) {
    const { carrier } = deliveryMethod
    const existing = carriers.get(carrier.uuid)
    if (existing) {
      existing.deliveryMethods.push(mapDeliveryMethod(deliveryMethod))
    } else {
      carriers.set(carrier.uuid, {
        uuid: carrier.uuid,
        name: carrier.name,
        type: carrier.type,
        deliveryMethods: [mapDeliveryMethod(deliveryMethod)]
      })
    }
  }

  return [...carriers.values()]
    .map((carrier) => ({
      ...carrier,
      deliveryMethods: [...carrier.deliveryMethods].sort(byName)
    }))
    .sort(byName)
}
