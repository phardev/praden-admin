import { usePreparationStore } from '@store/preparationStore'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'

export interface GlobalPreparationLineVM {
  reference: string
  name: string
  location: string
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
  clientName: string
  createdDate: string
  lines: Array<DetailPreparationLineVM>
}

export interface StartPreparationsVM {
  globalHeaders: Array<Header>
  detailHeaders: Array<Header>
  global: Array<GlobalPreparationLineVM>
  detail: Array<PreparationLineDetailVM>
}

const sortByLocation = (a: any, b: any): number => {
  if (a.location === '') return 1
  if (b.location === '') return -1
  return a.location < b.location ? -1 : 1
}

export const startPreparationsVM = (origin: string): StartPreparationsVM => {
  const preparationStore = usePreparationStore()
  const selected = preparationStore.selected
  const globalHeaders: Array<Header> = [
    { name: 'Référence', value: 'reference' },
    { name: 'Nom', value: 'name' },
    { name: 'Zone géo', value: 'location' },
    { name: 'Quantité', value: 'quantity' }
  ]
  const detailHeaders: Array<Header> = [
    { name: 'Référence', value: 'reference' },
    { name: 'Nom', value: 'name' },
    { name: 'Zone géo', value: 'location' },
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
  const formatter = priceFormatter('fr-FR', 'EUR')
  selected.forEach((uuid) => {
    const order = preparationStore.getByUuid(uuid)
    res.detail.push({
      href: `${origin}/preparations/${order.uuid}`,
      reference: order.uuid,
      deliveryMethodName: order.delivery.method.name,
      clientName: order.deliveryAddress.lastname,
      createdDate: timestampToLocaleString(order.createdAt, 'fr-FR'),
      lines: order.lines
        .map((line): DetailPreparationLineVM => {
          const unitPrice =
            (line.unitAmount + (line.unitAmount * line.percentTaxRate) / 100) /
            100
          const quantity = line.expectedQuantity
          return {
            reference: line.cip13,
            name: line.name,
            location: line.location,
            quantity,
            unitPrice: formatter.format(unitPrice),
            taxRate: `${line.percentTaxRate} %`,
            totalPrice: formatter.format(unitPrice * quantity)
          }
        })
        .sort(sortByLocation)
    })
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
  res.global.sort(sortByLocation)
  return res
}
