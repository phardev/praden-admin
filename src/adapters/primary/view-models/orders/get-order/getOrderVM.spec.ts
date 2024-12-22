import { useOrderStore } from '@store/orderStore'
import {
  elodieDurandOrder1,
  lucasLefevreOrder2,
  orderPrepared1,
  orderToPrepare1,
  orderWithMissingProduct1
} from '@utils/testData/orders'
import { DeliveryStatus, Order, PaymentStatus } from '@core/entities/order'
import {
  getOrderVM,
  GetOrderVM
} from '@adapters/primary/view-models/orders/get-order/getOrderVM'
import { createPinia, setActivePinia } from 'pinia'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { Customer } from '@core/entities/customer'
import { useCustomerStore } from '@store/customerStore'

describe('Get order VM', () => {
  let orderStore: any
  let customerStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    orderStore = useOrderStore()
    customerStore = useCustomerStore()
  })

  describe('There is no current preparation', () => {
    it('should return an empty vm', () => {
      expectVMToMatch({})
    })
  })

  describe('There is a preparation', () => {
    describe('Anonymous order', () => {
      it('should return the order vm', () => {
        givenCurrentOrderIs(orderToPrepare1)
        const expectedVM: Partial<GetOrderVM> = {
          reference: orderToPrepare1.uuid,
          customer: {
            firstname: orderToPrepare1.deliveryAddress.firstname,
            lastname: orderToPrepare1.deliveryAddress.lastname,
            email: orderToPrepare1.contact.email,
            phone: orderToPrepare1.contact.phone
          },
          deliveryAddress: {
            name: 'Jean Bon',
            address: '10 rue des peupliers',
            city: 'PlopLand',
            zip: '12345',
            country: 'Plop',
            phone: '0123456789'
          },
          deliveryStatus: DeliveryStatus.Created,
          paymentStatus: PaymentStatus.Payed
        }
        expectVMToMatch(expectedVM)
      })
      it('should return the order vm for another order', () => {
        givenCurrentOrderIs(orderWithMissingProduct1)
        const expectedVM: Partial<GetOrderVM> = {
          reference: orderWithMissingProduct1.uuid,
          customer: {
            firstname: orderWithMissingProduct1.deliveryAddress.firstname,
            lastname: orderWithMissingProduct1.deliveryAddress.lastname,
            email: orderWithMissingProduct1.contact.email,
            phone: orderWithMissingProduct1.contact.phone
          },
          deliveryAddress: {
            name: 'Jean Bon',
            address: '10 rue des peupliers',
            city: 'PlopLand',
            zip: '12345',
            country: 'Plop',
            phone: '0123456789'
          },
          deliveryStatus: DeliveryStatus.Processing,
          paymentStatus: PaymentStatus.Payed
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Customer order', () => {
      describe('The customer is loaded', () => {
        beforeEach(() => {
          givenExistingCustomers(elodieDurand, lucasLefevre)
        })
        it('should return the order vm', () => {
          givenCurrentOrderIs(elodieDurandOrder1)
          const expectedVM: Partial<GetOrderVM> = {
            reference: elodieDurandOrder1.uuid,
            customer: {
              firstname: elodieDurand.firstname,
              lastname: elodieDurand.lastname,
              email: elodieDurand.email,
              phone: elodieDurand.phone
            },
            deliveryAddress: {
              name: 'Élodie Durand',
              address: '10 rue des peupliers',
              city: 'PlopLand',
              zip: '12345',
              country: 'Plop',
              phone: elodieDurand.phone
            },
            deliveryStatus: DeliveryStatus.Created,
            paymentStatus: PaymentStatus.Payed
          }
          expectVMToMatch(expectedVM)
        })
        it('should return the order vm for another order', () => {
          givenCurrentOrderIs(lucasLefevreOrder2)
          const expectedVM: Partial<GetOrderVM> = {
            reference: lucasLefevreOrder2.uuid,
            customer: {
              firstname: lucasLefevre.firstname,
              lastname: lucasLefevre.lastname,
              email: lucasLefevre.email,
              phone: lucasLefevre.phone
            },
            deliveryAddress: {
              name: 'Lucas Lefèvre',
              address: '12 rue des peupliers',
              city: 'PlopLand',
              zip: '12345',
              country: 'Plop',
              phone: lucasLefevre.phone
            },
            deliveryStatus: DeliveryStatus.Created,
            paymentStatus: PaymentStatus.Payed
          }
          expectVMToMatch(expectedVM)
        })
      })
      describe('The customer is not loaded yet', () => {
        it('should return the order vm with empty client informations', () => {
          givenCurrentOrderIs(lucasLefevreOrder2)
          const expectedVM: Partial<GetOrderVM> = {
            reference: lucasLefevreOrder2.uuid,
            customer: {
              firstname: '',
              lastname: '',
              email: '',
              phone: ''
            },
            deliveryAddress: {
              name: '',
              address: '12 rue des peupliers',
              city: 'PlopLand',
              zip: '12345',
              country: 'Plop',
              phone: ''
            },
            deliveryStatus: DeliveryStatus.Created,
            paymentStatus: PaymentStatus.Payed
          }
          expectVMToMatch(expectedVM)
        })
      })
    })
    describe('Order with invoice', () => {
      it('should return the order vm', () => {
        givenCurrentOrderIs(orderPrepared1)
        const expectedVM: Partial<GetOrderVM> = {
          reference: orderPrepared1.uuid,
          invoiceNumber: orderPrepared1.invoiceNumber,
          customer: {
            firstname: orderPrepared1.deliveryAddress.firstname,
            lastname: orderPrepared1.deliveryAddress.lastname,
            email: orderPrepared1.contact.email,
            phone: orderPrepared1.contact.phone
          },
          deliveryAddress: {
            name: 'Jean Bon',
            address: '10 rue des peupliers',
            city: 'PlopLand',
            zip: '12345',
            country: 'Plop',
            phone: '0123456789'
          },
          deliveryStatus: DeliveryStatus.Shipped,
          paymentStatus: PaymentStatus.Payed
        }
        expectVMToMatch(expectedVM)
      })
      it('should return the order vm for another order', () => {
        givenCurrentOrderIs(orderWithMissingProduct1)
        const expectedVM: Partial<GetOrderVM> = {
          reference: orderWithMissingProduct1.uuid,
          customer: {
            firstname: orderWithMissingProduct1.deliveryAddress.firstname,
            lastname: orderWithMissingProduct1.deliveryAddress.lastname,
            email: orderWithMissingProduct1.contact.email,
            phone: orderWithMissingProduct1.contact.phone
          },
          deliveryAddress: {
            name: 'Jean Bon',
            address: '10 rue des peupliers',
            city: 'PlopLand',
            zip: '12345',
            country: 'Plop',
            phone: '0123456789'
          },
          deliveryStatus: DeliveryStatus.Processing,
          paymentStatus: PaymentStatus.Payed
        }
        expectVMToMatch(expectedVM)
      })
    })
  })

  const givenCurrentOrderIs = (order: Order) => {
    orderStore.current = order
  }

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerStore.items = customers
  }

  const expectVMToMatch = (expectedVM: Partial<GetOrderVM>) => {
    const emptyVM: GetOrderVM = {
      customer: {
        firstname: '',
        lastname: '',
        email: '',
        phone: ''
      },
      deliveryAddress: {
        name: '',
        address: '',
        zip: '',
        city: '',
        country: '',
        phone: ''
      },
      reference: '',
      deliveryStatus: DeliveryStatus.Created,
      paymentStatus: PaymentStatus.WaitingForPayment
    }
    expect(getOrderVM()).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})
