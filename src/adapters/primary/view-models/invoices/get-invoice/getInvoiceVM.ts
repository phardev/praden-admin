import { useInvoiceStore } from '@store/invoiceStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Order, OrderLine } from '@core/entities/order'
import { Invoice } from '@core/entities/invoice'
import { HashTable } from '@core/types/types'
import { Delivery } from '@core/entities/delivery'
import { addTaxToPrice } from '@utils/price'

export interface TableVM<T> {
  headers: Array<Header>
  items: Array<T>
}

export interface AddressVM {
  name: string
  address: string
  zip: string
  city: string
  phone: string
  country: string
  appartement?: string
}

interface SummaryValueVM {
  invoiceNumber: string
  invoiceDate: string
  orderReference: string
  orderDate: string
}

interface OrderLineVM {
  reference: string
  name: string
  taxRate: string
  unitAmountWithoutTax: string
  unitAmountWithTax: string
  quantity: number
  totalWithTax: string
}

interface TaxDetailLineVM {
  name: string
  taxRate: string
  amountWithoutTax: string
  taxAmount: string
}

interface TotalsVM {
  linesTotal: string
  totalWithoutTax: string
  totalTax: string
  totalRefund?: string
  deliveryPrice: string
  totalWithTax: string
}

export interface GetInvoiceVM {
  logo: string
  invoiceNumber: string
  createdDate: string
  createdDatetime: Date
  supplierAddress: AddressVM
  deliveryAddress: AddressVM
  billingAddress: AddressVM
  summaryTable: TableVM<SummaryValueVM>
  orderLinesTable: TableVM<OrderLineVM>
  refundOrderLinesTable: TableVM<OrderLineVM>
  taxDetailsTable: TableVM<TaxDetailLineVM>
  totals: TotalsVM
}

const emptyVM = (): GetInvoiceVM => {
  return {
    logo: '',
    invoiceNumber: '',
    createdDate: '',
    createdDatetime: new Date('01/01/1970'),
    supplierAddress: emptyAddressVM(),
    deliveryAddress: emptyAddressVM(),
    billingAddress: emptyAddressVM(),
    summaryTable: emptyTableVM(),
    orderLinesTable: emptyTableVM(),
    refundOrderLinesTable: emptyTableVM(),
    taxDetailsTable: emptyTableVM(),
    totals: {
      linesTotal: '',
      totalWithoutTax: '',
      totalTax: '',
      totalRefund: '',
      deliveryPrice: '',
      totalWithTax: ''
    }
  }
}

const emptyAddressVM = (): AddressVM => {
  return {
    name: '',
    address: '',
    zip: '',
    city: '',
    phone: '',
    country: ''
  }
}

const emptyTableVM = (): TableVM<any> => {
  return {
    headers: [],
    items: []
  }
}

const getSupplierAddress = (): AddressVM => {
  return {
    name: 'Pharmacie Agnes Praden',
    address:
      '198 Avenue des Frères lumières\nCentre commercial Intermarché, Les Allemandes',
    city: 'ALES',
    zip: '30100',
    country: 'France',
    phone: '0466303360'
  }
}

export const getDeliveryAddressVM = (order: Order): AddressVM => {
  return {
    name: `${order.deliveryAddress.firstname} ${order.deliveryAddress.lastname}`,
    address: order.deliveryAddress.address,
    city: order.deliveryAddress.city,
    zip: order.deliveryAddress.zip,
    country: order.deliveryAddress.country,
    phone: order.contact?.phone ?? ''
  }
}

const getSummaryTable = (invoice: Invoice): TableVM<SummaryValueVM> => {
  const summaryHeader: Array<Header> = [
    {
      name: 'Numéro de facture',
      value: 'invoiceNumber'
    },
    {
      name: 'Date de facturation',
      value: 'invoiceDate'
    },
    {
      name: 'Réf. de commande',
      value: 'orderReference'
    },
    {
      name: 'Date de commande',
      value: 'orderDate'
    }
  ]
  const dateFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }
  return {
    headers: summaryHeader,
    items: [
      {
        invoiceNumber: invoice.id,
        invoiceDate: timestampToLocaleString(
          invoice.createdAt,
          'fr-FR',
          dateFormatOptions
        ),
        orderReference: invoice.data.uuid,
        orderDate: timestampToLocaleString(
          invoice.data.createdAt,
          'fr-FR',
          dateFormatOptions
        )
      }
    ]
  }
}

const getOrderLinesTable = (
  orderLines: Array<OrderLine>
): TableVM<OrderLineVM> => {
  const orderLinesHeaders: Array<Header> = [
    {
      name: 'Référence',
      value: 'reference'
    },
    {
      name: 'Produit',
      value: 'name'
    },
    {
      name: 'Taux de taxe',
      value: 'taxRate'
    },
    {
      name: 'Prix unitaire (HT)',
      value: 'unitAmountWithoutTax'
    },
    {
      name: 'Prix unitaire (TTC)',
      value: 'unitAmountWithTax'
    },
    {
      name: 'Quantité',
      value: 'quantity'
    },
    {
      name: 'Total (TTC)',
      value: 'totalWithTax'
    }
  ]
  const formatter = priceFormatter('fr-FR', 'EUR')
  return {
    headers: orderLinesHeaders,
    items: orderLines.filter(preparedLinesFilter).map((line) => {
      const unitAmountWithTax = Math.round(
        line.unitAmount + (line.unitAmount * line.percentTaxRate) / 100
      )
      return {
        reference: line.ean13,
        name: line.name,
        taxRate: `${line.percentTaxRate} %`,
        unitAmountWithoutTax: formatter.format(line.unitAmount / 100),
        unitAmountWithTax: formatter.format(unitAmountWithTax / 100),
        quantity: line.preparedQuantity,
        totalWithTax: formatter.format(
          (unitAmountWithTax * line.preparedQuantity) / 100
        )
      }
    })
  }
}
const getRefundOrderLinesTable = (
  orderLines: Array<OrderLine>
): TableVM<OrderLineVM> => {
  const orderLinesHeaders: Array<Header> = [
    {
      name: 'Référence',
      value: 'reference'
    },
    {
      name: 'Produit',
      value: 'name'
    },
    {
      name: 'Taux de taxe',
      value: 'taxRate'
    },
    {
      name: 'Prix unitaire (HT)',
      value: 'unitAmountWithoutTax'
    },
    {
      name: 'Prix unitaire (TTC)',
      value: 'unitAmountWithTax'
    },
    {
      name: 'Quantité',
      value: 'quantity'
    },
    {
      name: 'Total (TTC)',
      value: 'totalWithTax'
    }
  ]
  const formatter = priceFormatter('fr-FR', 'EUR')
  return {
    headers: orderLinesHeaders,
    items: orderLines.filter(refundLinesFilter).map((line) => {
      const unitAmountWithTax = Math.round(
        addTaxToPrice(line.unitAmount, line.percentTaxRate)
      )
      return {
        reference: line.ean13,
        name: line.name,
        taxRate: `${line.percentTaxRate} %`,
        unitAmountWithoutTax: formatter.format(-line.unitAmount / 100),
        unitAmountWithTax: formatter.format(-unitAmountWithTax / 100),
        quantity: line.expectedQuantity,
        totalWithTax: formatter.format(
          (unitAmountWithTax * line.expectedQuantity) / 100
        )
      }
    })
  }
}

const getTotalGroupedByTax = (orderLines: Array<OrderLine>) => {
  return orderLines.reduce((acc: HashTable<any>, line: OrderLine) => {
    const taxRate = line.percentTaxRate
    const amountWithoutTax = line.unitAmount * line.expectedQuantity
    const taxAmount =
      (line.unitAmount / 100) * line.percentTaxRate * line.expectedQuantity
    if (acc[taxRate]) {
      acc[taxRate].amountWithoutTax += amountWithoutTax
      acc[taxRate].taxAmount += taxAmount
    } else {
      acc[taxRate] = {
        name: 'Produits',
        taxRate,
        amountWithoutTax,
        taxAmount
      }
    }
    return acc
  }, {})
}

const getTaxDetailsTable = (
  orderLines: Array<OrderLine>
): TableVM<TaxDetailLineVM> => {
  const headers: Array<Header> = [
    {
      name: 'Détail des taxes',
      value: 'name'
    },
    {
      name: 'Taux de taxe',
      value: 'taxRate'
    },
    {
      name: 'Prix de base',
      value: 'amountWithoutTax'
    },
    {
      name: 'Total taxes',
      value: 'taxAmount'
    }
  ]
  const formatter = priceFormatter('fr-FR', 'EUR')
  const groupedByTaxRate = getTotalGroupedByTax(orderLines)
  const orderedTaxRate = Object.keys(groupedByTaxRate).sort((a, b) => {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  })
  return {
    headers,
    items: orderedTaxRate.map((taxRate) => {
      const current = groupedByTaxRate[taxRate]
      return {
        name: current.name,
        taxRate: `${taxRate} %`,
        amountWithoutTax: formatter.format(current.amountWithoutTax / 100),
        taxAmount: formatter.format(current.taxAmount / 100)
      }
    })
  }
}

const preparedLinesFilter = (line: OrderLine) => {
  return line.preparedQuantity > 0
}

const refundLinesFilter = (line: OrderLine) => {
  return line.expectedQuantity < 0
}

const getTotals = (orderLines: Array<OrderLine>, delivery: Delivery) => {
  const formatter = priceFormatter('fr-FR', 'EUR')
  const linesPrepared = orderLines.filter(preparedLinesFilter)
  const linesTotal = linesPrepared.reduce((acc: number, line: OrderLine) => {
    return acc + line.preparedQuantity * line.unitAmount
  }, 0)
  const linesTotalWithTax = linesPrepared.reduce(
    (acc: number, line: OrderLine) => {
      return (
        acc +
        Math.round(addTaxToPrice(line.unitAmount, line.percentTaxRate)) *
          line.preparedQuantity
      )
    },
    0
  )
  const refundLines = orderLines.filter(refundLinesFilter)
  const totalRefund = refundLines.reduce((acc: number, line: OrderLine) => {
    return (
      acc +
      line.expectedQuantity * line.unitAmount +
      (line.percentTaxRate * line.unitAmount * line.expectedQuantity) / 100
    )
  }, 0)
  const groupedByTax = getTotalGroupedByTax(orderLines)
  const totalTax = Object.keys(groupedByTax).reduce(
    (acc: number, taxLine: any) => {
      return acc + groupedByTax[taxLine].taxAmount
    },
    0
  )
  const totalWithoutTax = linesTotal
  return {
    linesTotal: formatter.format(linesTotal / 100),
    totalWithoutTax: formatter.format(totalWithoutTax / 100),
    totalTax: formatter.format(totalTax / 100),
    totalRefund: formatter.format(totalRefund / 100),
    deliveryPrice:
      delivery.price === 0 ? 'Gratuit' : formatter.format(delivery.price / 100),
    totalWithTax: formatter.format((linesTotalWithTax + delivery.price) / 100)
  }
}

export const getInvoiceVM = (): GetInvoiceVM => {
  const invoiceStore = useInvoiceStore()
  const invoice = invoiceStore.current
  if (!invoice) {
    return emptyVM()
  }
  const dateFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }

  return {
    logo: 'http://praden-logo.svg',
    invoiceNumber: invoice.id,
    createdDate: timestampToLocaleString(
      invoice.createdAt,
      'fr-FR',
      dateFormatOptions
    ),
    createdDatetime: new Date(invoice.createdAt),
    supplierAddress: getSupplierAddress(),
    deliveryAddress: getDeliveryAddressVM(invoice.data),
    billingAddress: {
      name: `${invoice.data.billingAddress.firstname} ${invoice.data.billingAddress.lastname}`,
      address: invoice.data.billingAddress.address,
      city: invoice.data.billingAddress.city,
      zip: invoice.data.billingAddress.zip,
      country: invoice.data.billingAddress.country,
      phone: invoice.data.contact.phone
    },
    summaryTable: getSummaryTable(invoice),
    orderLinesTable: getOrderLinesTable(invoice.data.lines),
    refundOrderLinesTable: getRefundOrderLinesTable(invoice.data.lines),
    taxDetailsTable: getTaxDetailsTable(invoice.data.lines),
    totals: getTotals(invoice.data.lines, invoice.data.deliveries[0])
  }
}
