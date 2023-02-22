import { createPinia, setActivePinia } from 'pinia'
import { useInvoiceStore } from '@store/invoiceStore'
import {
  GetInvoiceVM,
  getInvoiceVM
} from '@adapters/primary/view-models/get-invoice/getInvoiceVM'
import { Invoice } from '@core/entities/invoice'
import { orderDelivered1, orderPrepared1 } from '@utils/testData/orders'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'
import { anaca3Minceur, dolodent } from '@utils/testData/products'

describe('Get invoice VM', () => {
  let invoiceStore: any
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
    },
    {
      name: 'Numéro de TVA',
      value: 'taxNumber'
    }
  ]
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

  const taxDetailsHeaders: Array<Header> = [
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
  beforeEach(() => {
    setActivePinia(createPinia())
    invoiceStore = useInvoiceStore()
  })
  describe('There is a current invoice', () => {
    it('should give the invoice number', () => {
      const invoice: Invoice = {
        id: orderPrepared1.payment.invoiceNumber,
        data: orderPrepared1,
        createdAt: 1675564421539
      }
      invoiceStore.current = invoice
      const expectedVM: GetInvoiceVM = {
        logo: 'http://praden-logo.svg',
        invoiceNumber: orderPrepared1.payment.invoiceNumber,
        createdDate: '05/02/2023',
        createdDatetime: new Date(1675564421539),
        supplierAddress: {
          name: 'Pharmacie Agnes Praden',
          address:
            '198 Avenue des Frères lumières\nCentre commercial Intermarché, Les Allemandes',
          city: 'ALES',
          zip: '30100',
          phone: '0466303360'
        },
        deliveryAddress: {
          name: 'Jean Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          phone: '0123456789'
        },
        billingAddress: {
          name: 'Jean Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          phone: '0123456789'
        },
        summaryTable: {
          headers: summaryHeader,
          items: [
            {
              invoiceNumber: orderPrepared1.payment.invoiceNumber,
              invoiceDate: '05/02/2023',
              orderReference: orderPrepared1.uuid,
              orderDate: '05/02/2023',
              taxNumber: 'France'
            }
          ]
        },
        orderLinesTable: {
          headers: orderLinesHeaders,
          items: [
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              taxRate: '10 %',
              unitAmountWithoutTax: '5,00\u00A0€',
              unitAmountWithTax: '5,50\u00A0€',
              quantity: 2,
              totalWithTax: '11,00\u00A0€'
            }
          ]
        },
        taxDetailsTable: {
          headers: taxDetailsHeaders,
          items: [
            {
              name: 'Produits',
              taxRate: '10 %',
              amountWithoutTax: '10,00\u00A0€',
              taxAmount: '1,00\u00A0€'
            }
          ]
        },
        totals: {
          linesTotal: '10,00\u00A0€',
          totalWithoutTax: '10,00\u00A0€',
          totalTax: '1,00\u00A0€',
          totalWithTax: '11,00\u00A0€'
        }
      }
      expect(getInvoiceVM()).toStrictEqual(expectedVM)
    })
  })
  describe('There is another current invoice', () => {
    it('should give the invoice number', () => {
      const invoice: Invoice = {
        id: orderDelivered1.payment.invoiceNumber,
        data: orderDelivered1,
        createdAt: 1674275599954
      }
      invoiceStore.current = invoice
      const expectedVM: GetInvoiceVM = {
        logo: 'http://praden-logo.svg',
        invoiceNumber: orderDelivered1.payment.invoiceNumber,
        createdDate: '21/01/2023',
        createdDatetime: new Date(1674275599954),
        supplierAddress: {
          name: 'Pharmacie Agnes Praden',
          address:
            '198 Avenue des Frères lumières\nCentre commercial Intermarché, Les Allemandes',
          city: 'ALES',
          zip: '30100',
          phone: '0466303360'
        },
        deliveryAddress: {
          name: "Jeanne D'arc",
          address: '12 avenue du bois',
          city: 'Boisville',
          zip: '54321',
          phone: '9876543210'
        },
        billingAddress: {
          name: "Jeanne D'arc",
          address: '12 avenue du bois',
          city: 'Boisville',
          zip: '54321',
          phone: '9876543210'
        },
        summaryTable: {
          headers: summaryHeader,
          items: [
            {
              invoiceNumber: orderDelivered1.payment.invoiceNumber,
              invoiceDate: '21/01/2023',
              orderReference: orderDelivered1.uuid,
              orderDate: '21/01/2023',
              taxNumber: 'France'
            }
          ]
        },
        orderLinesTable: {
          headers: orderLinesHeaders,
          items: [
            {
              reference: anaca3Minceur.cip13,
              name: anaca3Minceur.name,
              taxRate: '5.5 %',
              unitAmountWithoutTax: '8,91\u00A0€',
              unitAmountWithTax: '9,40\u00A0€',
              quantity: 3,
              totalWithTax: '28,20\u00A0€'
            },
            {
              reference: dolodent.cip13,
              name: dolodent.name,
              taxRate: '10 %',
              unitAmountWithoutTax: '5,00\u00A0€',
              unitAmountWithTax: '5,50\u00A0€',
              quantity: 1,
              totalWithTax: '5,50\u00A0€'
            }
          ]
        },
        taxDetailsTable: {
          headers: taxDetailsHeaders,
          items: [
            {
              name: 'Produits',
              taxRate: '5.5 %',
              amountWithoutTax: '26,73\u00A0€',
              taxAmount: '1,47\u00A0€'
            },
            {
              name: 'Produits',
              taxRate: '10 %',
              amountWithoutTax: '5,00\u00A0€',
              taxAmount: '0,50\u00A0€'
            }
          ]
        },
        totals: {
          linesTotal: '31,73\u00A0€',
          totalWithoutTax: '31,73\u00A0€',
          totalTax: '1,97\u00A0€',
          totalWithTax: '33,70\u00A0€'
        }
      }
      expect(getInvoiceVM()).toStrictEqual(expectedVM)
    })
  })

  describe('There is no current invoice', () => {
    it('should return an empty vm', () => {
      const expectedVM: GetInvoiceVM = {
        logo: '',
        invoiceNumber: '',
        createdDate: '',
        createdDatetime: new Date('01/01/1970'),
        supplierAddress: {
          name: '',
          address: '',
          city: '',
          zip: '',
          phone: ''
        },
        deliveryAddress: {
          name: '',
          address: '',
          city: '',
          zip: '',
          phone: ''
        },
        billingAddress: {
          name: '',
          address: '',
          city: '',
          zip: '',
          phone: ''
        },
        summaryTable: {
          headers: [],
          items: []
        },
        orderLinesTable: {
          headers: [],
          items: []
        },
        taxDetailsTable: {
          headers: [],
          items: []
        },
        totals: {
          linesTotal: '',
          totalWithoutTax: '',
          totalTax: '',
          totalWithTax: ''
        }
      }
      expect(getInvoiceVM()).toStrictEqual(expectedVM)
    })
  })
})
