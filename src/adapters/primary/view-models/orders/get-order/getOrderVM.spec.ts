import { useOrderStore } from '@store/orderStore'
import {
  elodieDurandOrder1,
  lucasLefevreOrder2,
  orderPrepared1,
  orderToPrepare1,
  orderWithCustomerMessage,
  orderWithMissingProduct1,
  orderWithoutPayment
} from '@utils/testData/orders'
import {
  AnonymousOrder,
  DeliveryType,
  Order,
  OrderLineStatus,
  PaymentStatus
} from '@core/entities/order'
import {
  getOrderVM,
  GetOrderVM,
  OrderDeliveriesItemVM
} from '@adapters/primary/view-models/orders/get-order/getOrderVM'
import { createPinia, setActivePinia } from 'pinia'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { Customer } from '@core/entities/customer'
import { useCustomerStore } from '@store/customerStore'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'

describe('Get order VM', () => {
  let orderStore: any
  let customerStore: any
  const expectedDeliveryHeaders: Array<Header> = [
    {
      name: 'Méthode',
      value: 'method'
    },
    {
      name: 'Client',
      value: 'client'
    },
    {
      name: 'Numéro de suivi',
      value: 'trackingNumber'
    },
    {
      name: 'Poids (kg)',
      value: 'weight'
    },
    {
      name: 'Statut',
      value: 'status'
    },
    {
      name: 'Actions',
      value: 'actions'
    }
  ]

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

  describe('There is an order', () => {
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
          orderStatus: OrderLineStatus.Created,
          deliveryStatus: orderToPrepare1.deliveries[0].status,
          deliveries: orderToPrepare1.deliveries.map(buildDeliveriesVM),
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
          orderStatus: OrderLineStatus.Started,
          deliveryStatus: orderWithMissingProduct1.deliveries[0].status,
          deliveries:
            orderWithMissingProduct1.deliveries.map(buildDeliveriesVM),
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
            orderStatus: OrderLineStatus.Created,
            deliveryStatus: elodieDurandOrder1.deliveries[0].status,
            deliveries: elodieDurandOrder1.deliveries.map(buildDeliveriesVM),
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
            orderStatus: OrderLineStatus.Created,
            deliveryStatus: lucasLefevreOrder2.deliveries[0].status,
            deliveries: lucasLefevreOrder2.deliveries.map(buildDeliveriesVM),
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
            orderStatus: OrderLineStatus.Created,
            deliveryStatus: DeliveryStatus.Created,
            deliveries: lucasLefevreOrder2.deliveries.map(buildDeliveriesVM),
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
          orderStatus: OrderLineStatus.Prepared,
          deliveryStatus: orderPrepared1.deliveries[0].status,
          deliveries: orderPrepared1.deliveries.map(buildDeliveriesVM),
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
          orderStatus: OrderLineStatus.Started,
          deliveryStatus: orderWithMissingProduct1.deliveries[0].status,
          deliveries:
            orderWithMissingProduct1.deliveries.map(buildDeliveriesVM),
          paymentStatus: PaymentStatus.Payed
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Order with delivery prepared', () => {
      it('should return the order vm', () => {
        const order: AnonymousOrder = JSON.parse(JSON.stringify(orderPrepared1))
        order.deliveries[0].trackingNumber = 'tracking'
        givenCurrentOrderIs(order)
        const expectedVM: Partial<GetOrderVM> = {
          reference: order.uuid,
          invoiceNumber: order.invoiceNumber,
          customer: {
            firstname: order.deliveryAddress.firstname,
            lastname: order.deliveryAddress.lastname,
            email: order.contact.email,
            phone: order.contact.phone
          },
          deliveryAddress: {
            name: 'Jean Bon',
            address: '10 rue des peupliers',
            city: 'PlopLand',
            zip: '12345',
            country: 'Plop',
            phone: '0123456789'
          },
          orderStatus: OrderLineStatus.Prepared,
          deliveryStatus: order.deliveries[0].status,
          deliveries: order.deliveries.map(buildDeliveriesVM),
          trackingNumber: order.deliveries[0].trackingNumber,
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
          orderStatus: OrderLineStatus.Started,
          deliveryStatus: orderWithMissingProduct1.deliveries[0].status,
          deliveries:
            orderWithMissingProduct1.deliveries.map(buildDeliveriesVM),
          paymentStatus: PaymentStatus.Payed
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Order with special instruction', () => {
      it('should return the order vm', () => {
        givenCurrentOrderIs(orderWithCustomerMessage)
        const expectedVM: Partial<GetOrderVM> = {
          reference: orderWithCustomerMessage.uuid,
          customer: {
            firstname: orderWithCustomerMessage.deliveryAddress.firstname,
            lastname: orderWithCustomerMessage.deliveryAddress.lastname,
            email: orderWithCustomerMessage.contact.email,
            phone: orderWithCustomerMessage.contact.phone
          },
          deliveryAddress: {
            name: 'Jean Bon',
            address: '10 rue des peupliers',
            city: 'PlopLand',
            zip: '12345',
            country: 'Plop',
            phone: '0123456789'
          },
          customerMessage: orderWithCustomerMessage.customerMessage,
          orderStatus: OrderLineStatus.Created,
          deliveryStatus: orderWithCustomerMessage.deliveries[0].status,
          deliveries:
            orderWithCustomerMessage.deliveries.map(buildDeliveriesVM),
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
          orderStatus: OrderLineStatus.Started,
          deliveryStatus: orderWithMissingProduct1.deliveries[0].status,
          deliveries:
            orderWithMissingProduct1.deliveries.map(buildDeliveriesVM),
          paymentStatus: PaymentStatus.Payed
        }
        expectVMToMatch(expectedVM)
      })
    })
    describe('Order without payment', () => {
      it('should return the order vm with waiting for payment', () => {
        givenCurrentOrderIs(orderWithoutPayment)
        const expectedVM: Partial<GetOrderVM> = {
          reference: orderWithoutPayment.uuid,
          customer: {
            firstname: orderWithoutPayment.deliveryAddress.firstname,
            lastname: orderWithoutPayment.deliveryAddress.lastname,
            email: orderWithoutPayment.contact.email,
            phone: orderWithoutPayment.contact.phone
          },
          deliveryAddress: {
            name: 'Jean Bon',
            address: '10 rue des peupliers',
            city: 'PlopLand',
            zip: '12345',
            country: 'Plop',
            phone: '0123456789'
          },
          orderStatus: OrderLineStatus.Created,
          deliveryStatus: orderWithoutPayment.deliveries[0].status,
          deliveries: orderWithoutPayment.deliveries.map(buildDeliveriesVM),
          paymentStatus: PaymentStatus.WaitingForPayment
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
      orderStatus: OrderLineStatus.Created,
      deliveryStatus: DeliveryStatus.Created,
      deliveriesHeaders: expectedDeliveryHeaders,
      deliveries: [],
      paymentStatus: PaymentStatus.WaitingForPayment
    }
    expect(getOrderVM()).toMatchObject({ ...emptyVM, ...expectedVM })
  }

  const buildDeliveriesVM = (delivery: Delivery): OrderDeliveriesItemVM => {
    const res: OrderDeliveriesItemVM = {
      uuid: delivery.uuid,
      method: delivery.method.name,
      client: `${delivery.receiver.address.firstname} ${delivery.receiver.address.lastname}`,
      trackingNumber: delivery.trackingNumber ?? '',
      weight: delivery.weight / 1000,
      status: delivery.status,
      canMarkAsDelivered: delivery.method.type === DeliveryType.ClickAndCollect
    }
    if (delivery.trackingNumber) {
      res.followUrl = `https://laposte.fr/outils/suivre-vos-envois?code=${delivery.trackingNumber}`
    }
    return res
  }
})
