import {
  MessageContent,
  DeliveryStatus,
  Order,
  PaymentStatus
} from '@core/entities/order'
import { anaca3Minceur, dolodent, ultraLevure } from '@utils/testData/products'
import {
  clickAndCollect,
  deliveryInRelayPoint
} from '@utils/testData/deliveryMethods'

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
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1674273279000
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
    invoiceNumber: '2023-00006',
    status: PaymentStatus.Payed
  },
  createdAt: 1674273279000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  delivery: {
    method: clickAndCollect
  },
  messages: []
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
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1675565972527
    },
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      location: ultraLevure.location,
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1675565972527
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
    invoiceNumber: '2023-00007',
    status: PaymentStatus.Payed
  },
  createdAt: 1675565972527,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  delivery: {
    method: clickAndCollect
  },
  messages: []
}

export const orderToPrepare3: Order = {
  uuid: 'DIJFPE',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1675565972527
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
    invoiceNumber: '2023-00008',
    status: PaymentStatus.Payed
  },
  createdAt: 1675565972527,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  delivery: {
    method: deliveryInRelayPoint
  },
  messages: []
}

export const orderPrepared1: Order = {
  uuid: 'JOURJL',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 2,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Shipped,
      updatedAt: 1675577400000
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
    invoiceNumber: '2023-00005',
    status: PaymentStatus.Payed
  },
  createdAt: 1675564420539,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  delivery: {
    method: clickAndCollect
  },
  messages: []
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
      deliveryStatus: DeliveryStatus.Processing,
      updatedAt: 1675564520539
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
    invoiceNumber: '2023-00004',
    status: PaymentStatus.Payed
  },
  createdAt: 1675564420539,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  delivery: {
    method: clickAndCollect
  },
  messages: [
    {
      content: MessageContent.AskToClient,
      sentAt: 1675564430539
    },
    {
      content: MessageContent.WaitForRestock,
      sentAt: 1675564440539
    }
  ]
}

export const orderDelivered1: Order = {
  uuid: 'HGFRIW',
  lines: [
    {
      name: anaca3Minceur.name,
      cip13: anaca3Minceur.cip13,
      expectedQuantity: 3,
      preparedQuantity: 3,
      unitAmount: anaca3Minceur.priceWithoutTax,
      percentTaxRate: anaca3Minceur.percentTaxRate,
      location: anaca3Minceur.location,
      deliveryStatus: DeliveryStatus.Delivered,
      updatedAt: 1674295599432
    },
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 1,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Delivered,
      updatedAt: 1674295599432
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
    invoiceNumber: '2023-00001',
    status: PaymentStatus.Payed
  },
  createdAt: 1674273599954,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  delivery: {
    method: clickAndCollect
  },
  messages: []
}

export const orderDelivered2: Order = {
  uuid: 'GJIRLK',
  lines: [
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 3,
      preparedQuantity: 3,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      location: ultraLevure.location,
      deliveryStatus: DeliveryStatus.Delivered,
      updatedAt: 1674295599432
    },
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 1,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Delivered,
      updatedAt: 1674295599432
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
    invoiceNumber: '2023-00001',
    status: PaymentStatus.Payed
  },
  createdAt: 1674273599954,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  delivery: {
    method: clickAndCollect
  },
  messages: []
}

export const orderWithMissingProduct1: Order = {
  uuid: 'DKOWDW',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 2,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Shipped,
      updatedAt: 1674573778456
    },
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 4,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      location: ultraLevure.location,
      deliveryStatus: DeliveryStatus.Processing,
      updatedAt: 1674573698456
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
    invoiceNumber: '2023-00002',
    status: PaymentStatus.Payed
  },
  createdAt: 1674573678456,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  delivery: {
    method: deliveryInRelayPoint
  },
  messages: [
    {
      content: MessageContent.AskToClient,
      sentAt: 1674573878456
    },
    {
      content: MessageContent.PartialShip,
      sentAt: 1674684178456
    }
  ]
}

export const orderWithMissingProduct2: Order = {
  uuid: 'DJEIWLQ',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Shipped,
      updatedAt: 1674573778456
    },
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 4,
      preparedQuantity: 2,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      location: ultraLevure.location,
      deliveryStatus: DeliveryStatus.Processing,
      updatedAt: 1674573698456
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
    invoiceNumber: '2023-00002',
    status: PaymentStatus.Payed
  },
  createdAt: 1674573678456,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  delivery: {
    method: deliveryInRelayPoint
  },
  messages: [
    {
      content: MessageContent.AskToClient,
      sentAt: 1674573878456
    },
    {
      content: MessageContent.PartialShip,
      sentAt: 1674684178456
    }
  ]
}

export const orderToCancel: Order = {
  uuid: 'JFIJLJ',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      location: dolodent.location,
      deliveryStatus: DeliveryStatus.Processing,
      updatedAt: 1674573778456
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
    invoiceNumber: '2023-00002',
    status: PaymentStatus.Payed
  },
  createdAt: 1674573678456,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  delivery: {
    method: deliveryInRelayPoint
  },
  messages: [
    {
      content: MessageContent.AskToClient,
      sentAt: 1674573878456
    },
    {
      content: MessageContent.CancelOrder,
      sentAt: 1674574178456
    }
  ]
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
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1674273789000
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
  createdAt: 1674273789000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  delivery: {
    method: clickAndCollect
  },
  messages: []
}
