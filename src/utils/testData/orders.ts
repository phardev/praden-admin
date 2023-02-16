import { DeliveryStatus, Order, PaymentStatus } from '@core/entities/order'
import { dolodent, ultraLevure } from '@utils/testData/products'

export const orderToPrepare1: Order = {
  uuid: 'XIKOKI',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Created
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1674273279000
}

export const orderToPrepare2: Order = {
  uuid: 'FHEIRF',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Created
    },
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      location: ultraLevure.location,
      deliveryStatus: DeliveryStatus.Created
    }
  ],
  deliveryAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1675565972527
}

export const orderPrepared1: Order = {
  uuid: 'JOURJL',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Shipped
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1675564420539
}

export const orderInPreparation1: Order = {
  uuid: 'UTRIEL',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Processing
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1674273579000
}

export const orderDelivered1: Order = {
  uuid: 'HGFRIW',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Delivered
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1674273599954
}

export const orderWithMissingProduct1: Order = {
  uuid: 'HGFRIW',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Shipped
    },
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 4,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      location: ultraLevure.location,
      deliveryStatus: DeliveryStatus.Processing
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1674573678456
}

export const orderNotPayed1: Order = {
  uuid: 'ADKEWR',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Created
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    status: PaymentStatus.WaitingForPayment
  },
  createdAt: 1674273789000
}
