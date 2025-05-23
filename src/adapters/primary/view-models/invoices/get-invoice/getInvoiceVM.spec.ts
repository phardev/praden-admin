import { createPinia, setActivePinia } from 'pinia'
import { useInvoiceStore } from '@store/invoiceStore'
import {
  GetInvoiceVM,
  getInvoiceVM
} from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'
import { Invoice } from '@core/entities/invoice'
import {
  orderCanceled,
  orderDelivered1,
  orderDelivered2,
  orderPartiallyShipped1,
  orderPrepared1
} from '@utils/testData/orders'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { anaca3Minceur, dolodent } from '@utils/testData/products'
import { orderWithPromotionCodeInvoice } from '@utils/testData/invoices'
import { PromotionCode } from '@core/entities/order'

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
    const invoice: Invoice = {
      id: orderPrepared1.invoiceNumber!,
      data: orderPrepared1,
      createdAt: 1675564421539
    }
    beforeEach(() => {
      invoiceStore.current = invoice
    })
    it('should get supplier logo', () => {
      const expected: Partial<GetInvoiceVM> = {
        logo: 'http://praden-logo.svg'
      }
      expectVMToMatch(expected)
    })
    it('should get invoice number', () => {
      const expected: Partial<GetInvoiceVM> = {
        invoiceNumber: orderPrepared1.invoiceNumber
      }
      expectVMToMatch(expected)
    })
    it('should get created date', () => {
      const expected: Partial<GetInvoiceVM> = {
        createdDate: '05/02/2023',
        createdDatetime: new Date(1675564421539)
      }
      expectVMToMatch(expected)
    })
    it('should get supplier address', () => {
      const expected: Partial<GetInvoiceVM> = {
        supplierAddress: {
          name: 'Pharmacie Agnes Praden',
          address:
            '198 Avenue des Frères lumières\nCentre commercial Intermarché, Les Allemandes',
          city: 'ALES',
          zip: '30100',
          country: 'France',
          phone: '0466303360'
        }
      }
      expectVMToMatch(expected)
    })
    it('should get delivery address', () => {
      const expected: Partial<GetInvoiceVM> = {
        deliveryAddress: {
          name: 'Jean Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop',
          phone: '0123456789'
        }
      }
      expectVMToMatch(expected)
    })
    it('should get billing address', () => {
      const expected: Partial<GetInvoiceVM> = {
        billingAddress: {
          name: 'Jean Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop',
          phone: '0123456789'
        }
      }
      expectVMToMatch(expected)
    })
    it('should get the customer email address', () => {
      const expected: Partial<GetInvoiceVM> = {
        customer: {
          email: 'jeanbon@anotheremail.com'
        }
      }
      expectVMToMatch(expected)
    })
    it('should get summary', () => {
      const expected: Partial<GetInvoiceVM> = {
        summaryTable: {
          headers: summaryHeader,
          items: [
            {
              invoiceNumber: orderPrepared1.invoiceNumber!,
              invoiceDate: '05/02/2023',
              orderReference: orderPrepared1.uuid,
              orderDate: '05/02/2023'
            }
          ]
        }
      }
      expectVMToMatch(expected)
    })
    it('should get lines details', () => {
      const expected: Partial<GetInvoiceVM> = {
        orderLinesTable: {
          headers: orderLinesHeaders,
          items: [
            {
              reference: dolodent.ean13,
              name: dolodent.name,
              taxRate: '10 %',
              unitAmountWithoutTax: '5,00\u00A0€',
              unitAmountWithTax: '5,50\u00A0€',
              quantity: 2,
              totalWithTax: '11,00\u00A0€'
            }
          ]
        }
      }
      expectVMToMatch(expected)
    })
    it('should group tax rates', () => {
      const expected: Partial<GetInvoiceVM> = {
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
        }
      }
      expectVMToMatch(expected)
    })
    it('should compute total', () => {
      const expected: Partial<GetInvoiceVM> = {
        totals: {
          linesTotal: '10,00\u00A0€',
          totalWithoutTax: '10,00\u00A0€',
          totalTax: '1,00\u00A0€',
          deliveryPrice: 'Gratuit',
          totalWithTax: '11,00\u00A0€'
        }
      }
      expectVMToMatch(expected)
    })
    it('should display payment type', () => {
      const expected: Partial<GetInvoiceVM> = {
        payment: {
          type: 'e-Transaction',
          amount: '33,70\u00A0€'
        }
      }
      expectVMToMatch(expected)
    })
    it('should display delivery method name', () => {
      const expected: Partial<GetInvoiceVM> = {
        deliveryMethod: {
          name: 'click & collect'
        }
      }
      expectVMToMatch(expected)
    })
  })
  describe('There is another current invoice', () => {
    const invoice: Invoice = {
      id: orderDelivered1.invoiceNumber!,
      data: orderDelivered1,
      createdAt: 1674275599954
    }
    beforeEach(() => {
      invoiceStore.current = invoice
    })
    it('should get supplier logo', () => {
      const expected: Partial<GetInvoiceVM> = {
        logo: 'http://praden-logo.svg'
      }
      expectVMToMatch(expected)
    })
    it('should get invoice number', () => {
      const expected: Partial<GetInvoiceVM> = {
        invoiceNumber: orderDelivered1.invoiceNumber
      }
      expectVMToMatch(expected)
    })
    it('should get created date', () => {
      const expected: Partial<GetInvoiceVM> = {
        createdDate: '21/01/2023',
        createdDatetime: new Date(1674275599954)
      }
      expectVMToMatch(expected)
    })
    it('should get supplier address', () => {
      const expected: Partial<GetInvoiceVM> = {
        supplierAddress: {
          name: 'Pharmacie Agnes Praden',
          address:
            '198 Avenue des Frères lumières\nCentre commercial Intermarché, Les Allemandes',
          city: 'ALES',
          zip: '30100',
          country: 'France',
          phone: '0466303360'
        }
      }
      expectVMToMatch(expected)
    })
    it('should get delivery address', () => {
      const expected: Partial<GetInvoiceVM> = {
        deliveryAddress: {
          name: "Jeanne D'arc",
          address: '12 avenue du bois',
          city: 'Boisville',
          zip: '54321',
          country: 'France',
          phone: '9876543210'
        }
      }
      expectVMToMatch(expected)
    })
    it('should get billing address', () => {
      const expected: Partial<GetInvoiceVM> = {
        billingAddress: {
          name: "Jeanne D'arc",
          address: '12 avenue du bois',
          city: 'Boisville',
          zip: '54321',
          country: 'France',
          phone: '9876543210'
        }
      }
      expectVMToMatch(expected)
    })
    it('should get the customer email address', () => {
      const expected: Partial<GetInvoiceVM> = {
        customer: {
          email: 'jeannedarc@email.com'
        }
      }
      expectVMToMatch(expected)
    })
    it('should get summary', () => {
      const expected: Partial<GetInvoiceVM> = {
        summaryTable: {
          headers: summaryHeader,
          items: [
            {
              invoiceNumber: orderDelivered1.invoiceNumber!,
              invoiceDate: '21/01/2023',
              orderReference: orderDelivered1.uuid,
              orderDate: '21/01/2023'
            }
          ]
        }
      }
      expectVMToMatch(expected)
    })
    it('should get lines details', () => {
      const expected: Partial<GetInvoiceVM> = {
        orderLinesTable: {
          headers: orderLinesHeaders,
          items: [
            {
              reference: anaca3Minceur.ean13,
              name: anaca3Minceur.name,
              taxRate: '5.5 %',
              unitAmountWithoutTax: '8,91\u00A0€',
              unitAmountWithTax: '9,40\u00A0€',
              quantity: 3,
              totalWithTax: '28,20\u00A0€'
            },
            {
              reference: dolodent.ean13,
              name: dolodent.name,
              taxRate: '10 %',
              unitAmountWithoutTax: '5,00\u00A0€',
              unitAmountWithTax: '5,50\u00A0€',
              quantity: 1,
              totalWithTax: '5,50\u00A0€'
            }
          ]
        }
      }
      expectVMToMatch(expected)
    })
    it('should group tax rates', () => {
      const expected: Partial<GetInvoiceVM> = {
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
        }
      }
      expectVMToMatch(expected)
    })
    it('should compute total', () => {
      const expected: Partial<GetInvoiceVM> = {
        totals: {
          linesTotal: '31,73\u00A0€',
          totalWithoutTax: '31,73\u00A0€',
          totalTax: '1,97\u00A0€',
          totalRefund: '0,00\u00A0€',
          deliveryPrice: 'Gratuit',
          totalWithTax: '33,70\u00A0€'
        }
      }
      expectVMToMatch(expected)
    })
  })

  describe('There is multiple products with the same tax rate', () => {
    const invoice: Invoice = {
      id: orderDelivered2.invoiceNumber!,
      data: orderDelivered2,
      createdAt: 1675564422539
    }
    beforeEach(() => {
      invoiceStore.current = invoice
    })
    it('should group them', () => {
      const expected: Partial<GetInvoiceVM> = {
        taxDetailsTable: {
          headers: taxDetailsHeaders,
          items: [
            {
              name: 'Produits',
              taxRate: '10 %',
              amountWithoutTax: '17,96\u00A0€',
              taxAmount: '1,79\u00A0€'
            }
          ]
        }
      }
      expectVMToMatch(expected)
    })
  })

  describe('There is all products canceled', () => {
    const invoice: Invoice = {
      id: orderCanceled.invoiceNumber!,
      data: orderCanceled,
      createdAt: 1675564422539
    }
    describe('Without promotion code', () => {
      beforeEach(() => {
        invoiceStore.current = invoice
      })
      it('should also cancel the delivery', () => {
        const expected: Partial<GetInvoiceVM> = {
          totals: {
            linesTotal: '0,00\u00A0€',
            totalWithoutTax: '0,00\u00A0€',
            totalTax: '0,00\u00A0€',
            totalRefund: '-18,19\u00A0€',
            deliveryPrice: '0,00\u00A0€',
            totalWithTax: '0,00\u00A0€'
          }
        }
        expectVMToMatch(expected)
      })
    })
    describe('With promotion code', () => {
      const promotionCode: PromotionCode = {
        uuid: 'promo-uuid-1',
        code: 'DISCOUNT10',
        discount: 500
      }
      beforeEach(() => {
        invoice.data.promotionCode = promotionCode
        invoiceStore.current = invoice
      })
      it('should also cancel the promotion code', () => {
        const expected: Partial<GetInvoiceVM> = {
          totals: {
            linesTotal: '0,00\u00A0€',
            totalWithoutTax: '0,00\u00A0€',
            totalTax: '0,00\u00A0€',
            totalRefund: '-13,19\u00A0€',
            deliveryPrice: '0,00\u00A0€',
            promotionCode: {
              code: 'DISCOUNT10',
              discount: '-5,00\u00A0€'
            },
            totalWithTax: '0,00\u00A0€'
          }
        }
        expectVMToMatch(expected)
      })
    })
  })

  describe('There is no current invoice', () => {
    it('should return an empty vm', () => {
      const expectedVM: GetInvoiceVM = {
        logo: '',
        invoiceNumber: '',
        createdDate: '',
        createdDatetime: new Date('01/01/1970'),
        customer: {
          email: ''
        },
        supplierAddress: {
          name: '',
          address: '',
          city: '',
          zip: '',
          country: '',
          phone: ''
        },
        deliveryAddress: {
          name: '',
          address: '',
          city: '',
          zip: '',
          country: '',
          phone: ''
        },
        billingAddress: {
          name: '',
          address: '',
          city: '',
          zip: '',
          country: '',
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
        refundOrderLinesTable: {
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
          totalRefund: '',
          deliveryPrice: '',
          totalWithTax: ''
        },
        payment: {
          type: '',
          amount: ''
        },
        deliveryMethod: {
          name: ''
        }
      }
      expect(getInvoiceVM()).toStrictEqual(expectedVM)
    })
  })

  describe('The order is partially prepared', () => {
    const invoice: Invoice = {
      id: orderPartiallyShipped1.invoiceNumber!,
      data: orderPartiallyShipped1,
      createdAt: 1675564421539
    }
    describe('Without promotion code', () => {
      beforeEach(() => {
        invoiceStore.current = invoice
      })
      it('should display only prepared quantity', () => {
        const expected: Partial<GetInvoiceVM> = {
          orderLinesTable: {
            headers: orderLinesHeaders,
            items: [
              {
                reference: dolodent.ean13,
                name: dolodent.name,
                taxRate: '10 %',
                unitAmountWithoutTax: '5,00\u00A0€',
                unitAmountWithTax: '5,50\u00A0€',
                quantity: 1,
                totalWithTax: '5,50\u00A0€'
              }
            ]
          }
        }
        expectVMToMatch(expected)
      })
      it('should display refund lines', () => {
        const expected: Partial<GetInvoiceVM> = {
          refundOrderLinesTable: {
            headers: orderLinesHeaders,
            items: [
              {
                reference: dolodent.ean13,
                name: dolodent.name,
                taxRate: '10 %',
                unitAmountWithoutTax: '-5,00\u00A0€',
                unitAmountWithTax: '-5,50\u00A0€',
                quantity: -1,
                totalWithTax: '-5,50\u00A0€'
              }
            ]
          }
        }
        expectVMToMatch(expected)
      })
      it('should compute total with refund', () => {
        const expected: Partial<GetInvoiceVM> = {
          totals: {
            linesTotal: '5,00\u00A0€',
            totalWithoutTax: '5,00\u00A0€',
            totalTax: '0,50\u00A0€',
            totalRefund: '-5,50\u00A0€',
            deliveryPrice: '6,00\u00A0€',
            totalWithTax: '11,50\u00A0€'
          }
        }
        expectVMToMatch(expected)
      })
      it('should display delivery method name', () => {
        const expected: Partial<GetInvoiceVM> = {
          deliveryMethod: {
            name: 'Livraison en point relai'
          }
        }
        expectVMToMatch(expected)
      })
    })
    describe('With promotion code', () => {
      const promotionCode: PromotionCode = {
        uuid: 'promo-uuid-1',
        code: 'DISCOUNT10',
        discount: 500
      }
      beforeEach(() => {
        invoice.data.promotionCode = promotionCode
        invoiceStore.current = invoice
      })
      it('should also cancel the promotion code', () => {
        const expected: Partial<GetInvoiceVM> = {
          totals: {
            linesTotal: '5,00\u00A0€',
            totalWithoutTax: '5,00\u00A0€',
            totalTax: '0,50\u00A0€',
            totalRefund: '-5,50\u00A0€',
            deliveryPrice: '6,00\u00A0€',
            promotionCode: {
              code: 'DISCOUNT10',
              discount: '-5,00\u00A0€'
            },
            totalWithTax: '6,50\u00A0€'
          }
        }
        expectVMToMatch(expected)
      })
    })
  })

  describe('There is a current invoice with promotion code', () => {
    const invoice: Invoice = JSON.parse(
      JSON.stringify(orderWithPromotionCodeInvoice)
    )
    beforeEach(() => {
      invoice.data.lines[0].preparedQuantity =
        invoice.data.lines[0].expectedQuantity
      invoiceStore.current = invoice
    })
    it('should compute total with promotion code', () => {
      const expected: Partial<GetInvoiceVM> = {
        totals: {
          linesTotal: '10,00\u00A0€',
          totalWithoutTax: '10,00\u00A0€',
          totalTax: '1,00\u00A0€',
          totalRefund: '0,00\u00A0€',
          deliveryPrice: 'Gratuit',
          promotionCode: {
            code: 'DISCOUNT10',
            discount: '-5,00\u00A0€'
          },
          totalWithTax: '6,00\u00A0€'
        }
      }
      expectVMToMatch(expected)
    })
  })

  const expectVMToMatch = (expected: Partial<GetInvoiceVM>) => {
    expect(getInvoiceVM()).toMatchObject(expected)
  }
})
