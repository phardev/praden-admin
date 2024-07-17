import {
  AnonymousOrder,
  CustomerOrder,
  DeliveryStatus,
  MessageContent,
  PaymentStatus
} from '@core/entities/order'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent,
  hemoclar,
  productWithoutLocation,
  ultraLevure
} from '@utils/testData/products'
import {
  clickAndCollect,
  deliveryInRelayPoint
} from '@utils/testData/deliveryMethods'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'

export const orderToPrepare1: AnonymousOrder = {
  uuid: 'XIKOKI',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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

export const orderToPrepare2: AnonymousOrder = {
  uuid: 'FHEIRF',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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
      locations: ultraLevure.locations,
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

export const orderToPrepare3: AnonymousOrder = {
  uuid: 'DIJFPE',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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

export const orderPrepared1: AnonymousOrder = {
  uuid: 'JOURJL',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 2,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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

export const orderInPreparation1: AnonymousOrder = {
  uuid: 'UTRIEL',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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

export const orderDelivered1: AnonymousOrder = {
  uuid: 'HGFRIW',
  lines: [
    {
      name: anaca3Minceur.name,
      cip13: anaca3Minceur.cip13,
      expectedQuantity: 3,
      preparedQuantity: 3,
      unitAmount: anaca3Minceur.priceWithoutTax,
      percentTaxRate: anaca3Minceur.percentTaxRate,
      locations: anaca3Minceur.locations,
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
      locations: dolodent.locations,
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

export const orderDelivered2: AnonymousOrder = {
  uuid: 'GJIRLK',
  lines: [
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 3,
      preparedQuantity: 3,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
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
      locations: dolodent.locations,
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

export const orderWithMissingProduct1: AnonymousOrder = {
  uuid: 'DKOWDW',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 2,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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
      locations: ultraLevure.locations,
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

export const orderWithMissingProduct2: AnonymousOrder = {
  uuid: 'DJEIWLQ',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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
      locations: ultraLevure.locations,
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

export const orderToCancel: AnonymousOrder = {
  uuid: 'JFIJLJ',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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

export const orderNotPayed1: AnonymousOrder = {
  uuid: 'ADKEWR',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
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

export const orderSaved1: AnonymousOrder = {
  uuid: 'FKEROFE',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      deliveryStatus: DeliveryStatus.Processing,
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
    status: PaymentStatus.Payed
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

export const orderWaitingForClientAnswer1: AnonymousOrder = {
  uuid: 'ZJOFRW',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      deliveryStatus: DeliveryStatus.Processing,
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
    status: PaymentStatus.Payed
  },
  createdAt: 1674273789000,
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
      sentAt: 1674293789000
    }
  ]
}

export const orderWaitingForClientAnswer2: AnonymousOrder = {
  uuid: 'LOPFRE',
  lines: [
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 3,
      preparedQuantity: 2,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      deliveryStatus: DeliveryStatus.Processing,
      updatedAt: 1674295599432
    },
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 1,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      deliveryStatus: DeliveryStatus.Processing,
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
  messages: [
    {
      content: MessageContent.AskToClient,
      sentAt: 1674293509954
    }
  ]
}

export const orderWaitingForRestock: AnonymousOrder = {
  uuid: 'EUIWQK',
  lines: [
    {
      name: chamomilla.name,
      cip13: chamomilla.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: chamomilla.priceWithoutTax,
      percentTaxRate: chamomilla.percentTaxRate,
      locations: chamomilla.locations,
      deliveryStatus: DeliveryStatus.Processing,
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
    status: PaymentStatus.Payed
  },
  createdAt: 1674273789000,
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

export const orderPartiallyShipped1: AnonymousOrder = {
  uuid: 'PIDWJK',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      deliveryStatus: DeliveryStatus.Shipped,
      updatedAt: 1674573778456
    },
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: -1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      deliveryStatus: DeliveryStatus.Shipped,
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
    invoiceNumber: '2023-00009',
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

export const orderVFASF: AnonymousOrder = {
  uuid: 'VFASF',
  lines: [
    {
      name: calmosine.name,
      cip13: calmosine.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1674273279000
    },
    {
      name: hemoclar.name,
      cip13: hemoclar.cip13,
      expectedQuantity: 3,
      preparedQuantity: 0,
      unitAmount: hemoclar.priceWithoutTax,
      percentTaxRate: hemoclar.percentTaxRate,
      locations: hemoclar.locations,
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

export const orderXUKIJ: AnonymousOrder = {
  uuid: 'XUKIJ',
  lines: [
    {
      name: calmosine.name,
      cip13: calmosine.cip13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
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

export const orderWithProductWithoutLocation: AnonymousOrder = {
  uuid: 'WITHOUTLOCATION',
  lines: [
    {
      name: productWithoutLocation.name,
      cip13: productWithoutLocation.cip13,
      expectedQuantity: 3,
      preparedQuantity: 0,
      unitAmount: productWithoutLocation.priceWithoutTax,
      percentTaxRate: productWithoutLocation.percentTaxRate,
      locations: productWithoutLocation.locations,
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1674273279000
    },
    {
      name: calmosine.name,
      cip13: calmosine.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
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

export const elodieDurandOrder1: CustomerOrder = {
  uuid: 'ELODIEABC',
  customerUuid: elodieDurand.uuid,
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      expectedQuantity: 3,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1674273279000
    },
    {
      name: calmosine.name,
      cip13: calmosine.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    invoiceNumber: '2023-00012',
    status: PaymentStatus.Payed
  },
  createdAt: 1674273279000,
  delivery: {
    method: clickAndCollect
  },
  messages: []
}

export const elodieDurandOrder2: CustomerOrder = {
  uuid: 'ELODIEDEF',
  customerUuid: elodieDurand.uuid,
  lines: [
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      deliveryStatus: DeliveryStatus.Processing,
      updatedAt: 1674273279000
    },
    {
      name: calmosine.name,
      cip13: calmosine.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      deliveryStatus: DeliveryStatus.Shipped,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    invoiceNumber: '2023-00012',
    status: PaymentStatus.Payed
  },
  createdAt: 1674273279000,
  delivery: {
    method: clickAndCollect
  },
  messages: []
}

export const lucasLefevreOrder1: CustomerOrder = {
  uuid: 'LUCASABC',
  customerUuid: lucasLefevre.uuid,
  lines: [
    {
      name: calmosine.name,
      cip13: calmosine.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1674373279000
    }
  ],
  deliveryAddress: {
    firstname: lucasLefevre.firstname,
    lastname: lucasLefevre.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    invoiceNumber: '2023-00013',
    status: PaymentStatus.Payed
  },
  createdAt: 1674373279000,
  delivery: {
    method: clickAndCollect
  },
  messages: []
}

export const lucasLefevreOrder2: CustomerOrder = {
  uuid: 'LUCASDEF',
  customerUuid: lucasLefevre.uuid,
  lines: [
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      deliveryStatus: DeliveryStatus.Created,
      updatedAt: 1674473279000
    }
  ],
  deliveryAddress: {
    firstname: lucasLefevre.firstname,
    lastname: lucasLefevre.lastname,
    address: '12 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  },
  payment: {
    invoiceNumber: '2023-00014',
    status: PaymentStatus.Payed
  },
  createdAt: 1674473279000,
  delivery: {
    method: deliveryInRelayPoint
  },
  messages: []
}
