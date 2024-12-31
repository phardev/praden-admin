import { usePreparationStore } from '@store/preparationStore'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import {
  AddressVM,
  getDeliveryAddressVM
} from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'
import { useSettingStore } from '@store/settingStore'
import { addTaxToPrice } from '@utils/price'
import { getTotalWithTax, Order } from '@core/entities/order'
import { useLocationStore } from '@store/locationStore'
import { zoneGeo } from '@utils/testData/locations'
import { sortLocationByOrder } from '@core/entities/location'

export interface GlobalPreparationLineVM {
  reference: string
  name: string
  locations: object
  quantity: number
}

export interface DetailPreparationLineVM extends GlobalPreparationLineVM {
  unitPrice: string
  taxRate: string
  totalPrice: string
}

export interface PreparationLineDetailVM {
  href: string
  reference: string
  deliveryMethodName: string
  clientLastname: string
  clientMessage?: string
  createdDate: string
  deliveryPrice: string
  deliveryAddress: AddressVM
  lines: Array<DetailPreparationLineVM>
  totalWithTax: string
}

export interface StartPreparationsVM {
  globalHeaders: Array<Header>
  detailHeaders: Array<Header>
  global: Array<GlobalPreparationLineVM>
  detail: Array<PreparationLineDetailVM>
}

const sortByLocation = (a: any, b: any): number => {
  if (!a.locations[zoneGeo.uuid]) return 1
  if (!b.locations[zoneGeo.uuid]) return -1
  return a.locations[zoneGeo.uuid] < b.locations[zoneGeo.uuid] ? -1 : 1
}

const sortByProductName = (a: any, b: any): number => {
  if (a.name === '') return 1
  if (b.name === '') return -1
  return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
}

export enum PickingSortType {
  Location,
  Name
}

const computeLocationHeaders = () => {
  const locationStore = useLocationStore()
  const locations = locationStore.items
  return locations.sort(sortLocationByOrder).map((l) => {
    return {
      name: l.name,
      value: `locations.${l.uuid}`
    }
  })
}

export const startPreparationsVM = (origin: string): StartPreparationsVM => {
  const preparationStore = usePreparationStore()
  const settingStore = useSettingStore()
  const selected = preparationStore.selected
  const globalHeaders: Array<Header> = [
    { name: 'Référence', value: 'reference' },
    { name: 'Nom', value: 'name' },
    ...computeLocationHeaders(),
    { name: 'Quantité', value: 'quantity' }
  ]
  const detailHeaders: Array<Header> = [
    { name: 'Référence', value: 'reference' },
    { name: 'Nom', value: 'name' },
    ...computeLocationHeaders(),
    { name: 'Prix unitaire', value: 'unitPrice' },
    { name: 'Quantité', value: 'quantity' },
    { name: 'TVA', value: 'taxRate' },
    { name: 'Total', value: 'totalPrice' }
  ]
  const res: StartPreparationsVM = {
    globalHeaders,
    detailHeaders,
    global: [],
    detail: []
  }
  const pickingSortType = settingStore.get('picking-sort')
  const pickingSort =
    pickingSortType === PickingSortType.Location
      ? sortByLocation
      : sortByProductName
  selected.forEach((uuid) => {
    const order = preparationStore.getByUuid(uuid)
    const detail: PreparationLineDetailVM = getDetailPreparationLineVM(
      origin,
      order,
      pickingSort
    )
    res.detail.push(detail)
  })
  res.global = res.detail.reduce(
    (acc: Array<DetailPreparationLineVM>, detail) => {
      detail.lines.forEach((line: any) => {
        const lineInGlobal = acc.find(
          (l: any) => l.reference === line.reference
        )
        if (lineInGlobal) {
          lineInGlobal.quantity += line.quantity
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { unitPrice, taxRate, totalPrice, ...restOfLine } = line
          acc.push(JSON.parse(JSON.stringify(restOfLine)))
        }
      })
      return acc
    },
    []
  )
  res.global.sort(pickingSort)
  return res
}

const getDetailPreparationLineVM = (
  origin: string,
  order: Order,
  pickingSort: any
): PreparationLineDetailVM => {
  const delivery = order.deliveries[0]
  const formatter = priceFormatter('fr-FR', 'EUR')

  const detail: PreparationLineDetailVM = {
    href: `${origin}/preparations/${order.uuid}`,
    reference: order.uuid,
    deliveryMethodName: delivery.method.name,
    clientLastname: order.deliveryAddress.lastname
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''),
    createdDate: timestampToLocaleString(order.createdAt, 'fr-FR'),
    deliveryPrice:
      delivery.price > 0 ? formatter.format(delivery.price / 100) : 'Gratuit',
    deliveryAddress: getDeliveryAddressVM(order),
    lines: order.lines
      .map((line): DetailPreparationLineVM => {
        const unitPrice =
          addTaxToPrice(line.unitAmount, line.percentTaxRate) / 100
        const quantity = line.expectedQuantity
        return {
          reference: line.ean13,
          name: line.name,
          locations: line.locations,
          quantity,
          unitPrice: formatter.format(unitPrice),
          taxRate: `${line.percentTaxRate} %`,
          totalPrice: formatter.format(unitPrice * quantity)
        }
      })
      .sort(pickingSort),
    totalWithTax: formatter.format(getTotalWithTax(order))
  }
  if (order.customerMessage) {
    detail.clientMessage = order.customerMessage
  }
  return detail
}
