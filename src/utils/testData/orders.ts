import {
  AnonymousOrder,
  CustomerOrder,
  MessageContent,
  OrderLineStatus,
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
import { praden } from '@utils/testData/shop'
import {
  deliveryOrderDelivered1,
  deliveryOrderDelivered2,
  deliveryOrderPrepared1,
  deliveryOrderToPrepare1,
  deliveryOrderToPrepare2,
  deliveryOrderToPrepare3
} from '@utils/testData/deliveries'
import { DeliveryStatus } from '@core/entities/delivery'

export const orderToPrepare1: AnonymousOrder = {
  uuid: 'XIKOKI',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00006',
  createdAt: 1674273279000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [deliveryOrderToPrepare1],
  messages: []
}

export const orderToPrepare2: AnonymousOrder = {
  uuid: 'FHEIRF',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1675565972527
    },
    {
      productUuid: ultraLevure.uuid,
      name: ultraLevure.name,
      ean13: ultraLevure.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1675565972527
    }
  ],
  deliveryAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  billingAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00007',
  createdAt: 1675565972527,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  deliveries: [deliveryOrderToPrepare2],
  messages: []
}

export const orderToPrepare3: AnonymousOrder = {
  uuid: 'DIJFPE',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1675565972527
    }
  ],
  deliveryAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  billingAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00008',
  createdAt: 1675565972527,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  deliveries: [deliveryOrderToPrepare3],
  messages: []
}

export const orderPrepared1: AnonymousOrder = {
  uuid: 'JOURJL',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 2,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1675577400000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00005',
  createdAt: 1675564420539,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [deliveryOrderPrepared1],
  messages: []
}

export const orderInPreparation1: AnonymousOrder = {
  uuid: 'UTRIEL',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1675564520539
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00004',
  createdAt: 1675564420539,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-in-preparation-1',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
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
      productUuid: anaca3Minceur.uuid,
      name: anaca3Minceur.name,
      ean13: anaca3Minceur.ean13,
      expectedQuantity: 3,
      preparedQuantity: 3,
      unitAmount: anaca3Minceur.priceWithoutTax,
      percentTaxRate: anaca3Minceur.percentTaxRate,
      locations: anaca3Minceur.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1674295599432
    },
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 1,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1674295599432
    }
  ],
  deliveryAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  billingAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00001',
  createdAt: 1674273599954,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  deliveries: [deliveryOrderDelivered1],
  messages: []
}

export const orderDelivered2: AnonymousOrder = {
  uuid: 'GJIRLK',
  lines: [
    {
      productUuid: ultraLevure.uuid,
      name: ultraLevure.name,
      ean13: ultraLevure.ean13,
      expectedQuantity: 3,
      preparedQuantity: 3,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1674295599432
    },
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 1,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1674295599432
    }
  ],
  deliveryAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  billingAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00001',
  createdAt: 1674273599954,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  deliveries: [deliveryOrderDelivered2],
  messages: []
}

export const orderWithMissingProduct1: AnonymousOrder = {
  uuid: 'DKOWDW',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 2,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1674573778456
    },
    {
      productUuid: ultraLevure.uuid,
      name: ultraLevure.name,
      ean13: ultraLevure.ean13,
      expectedQuantity: 4,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674573698456
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00002',
  createdAt: 1674573678456,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-with-missing-product',
      price: 599,
      method: deliveryInRelayPoint,
      pickupId: '9638521',
      trackingNumber: 'MissingProduct-78945632',
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
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
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1674573778456
    },
    {
      productUuid: ultraLevure.uuid,
      name: ultraLevure.name,
      ean13: ultraLevure.ean13,
      expectedQuantity: 4,
      preparedQuantity: 2,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674573698456
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00002',
  createdAt: 1674573678456,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-with-missing-product-2',
      price: 599,
      method: deliveryInRelayPoint,
      pickupId: '123456',
      trackingNumber: 'Missing2-123456',
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
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
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674573778456
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00002',
  createdAt: 1674573678456,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-to-cancel',
      price: 750,
      method: deliveryInRelayPoint,
      pickupId: '7894561',
      trackingNumber: 'ToCancel-5478551',
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
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
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273789000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.WaitingForPayment
  },
  createdAt: 1674273789000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-not-payed-1',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const orderSaved1: AnonymousOrder = {
  uuid: 'FKEROFE',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674273789000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1674273789000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-saved-1',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const orderWaitingForClientAnswer1: AnonymousOrder = {
  uuid: 'ZJOFRW',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674273789000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1674273789000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-waiting-for-client-answer-1',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
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
      productUuid: ultraLevure.uuid,
      name: ultraLevure.name,
      ean13: ultraLevure.ean13,
      expectedQuantity: 3,
      preparedQuantity: 2,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674295599432
    },
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 1,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674295599432
    }
  ],
  deliveryAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  billingAddress: {
    firstname: 'Jeanne',
    lastname: "D'arc",
    address: '12 avenue du bois',
    city: 'Boisville',
    zip: '54321',
    country: 'France'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00001',
  createdAt: 1674273599954,
  contact: {
    email: 'jeannedarc@email.com',
    phone: '9876543210'
  },
  deliveries: [
    {
      uuid: 'delivery-order-waiting-for-client-answer-2',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeannedarc@email.com',
          phone: '9876543210'
        },
        address: {
          firstname: 'Jeanne',
          lastname: "D'arc",
          address: '12 avenue du bois',
          city: 'Boisville',
          zip: '54321',
          country: 'France'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
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
      productUuid: chamomilla.uuid,
      name: chamomilla.name,
      ean13: chamomilla.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: chamomilla.priceWithoutTax,
      percentTaxRate: chamomilla.percentTaxRate,
      locations: chamomilla.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674273789000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  createdAt: 1674273789000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-waiting-for-restock',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
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
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 1,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1674573778456
    },
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: -1,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Canceled,
      updatedAt: 1674573778456
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00009',
  createdAt: 1674573678456,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-partially-shipped-1',
      price: 500,
      method: deliveryInRelayPoint,
      pickupId: '741852',
      trackingNumber: 'PartiallyShipped-584214',
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Shipped
    }
  ],
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
      productUuid: calmosine.uuid,
      name: calmosine.name,
      ean13: calmosine.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    },
    {
      productUuid: hemoclar.uuid,
      name: hemoclar.name,
      ean13: hemoclar.ean13,
      expectedQuantity: 3,
      preparedQuantity: 0,
      unitAmount: hemoclar.priceWithoutTax,
      percentTaxRate: hemoclar.percentTaxRate,
      locations: hemoclar.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00006',
  createdAt: 1674273279000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-vfasf',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const orderXUKIJ: AnonymousOrder = {
  uuid: 'XUKIJ',
  lines: [
    {
      productUuid: calmosine.uuid,
      name: calmosine.name,
      ean13: calmosine.ean13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00006',
  createdAt: 1674273279000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-xukij',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const orderWithProductWithoutLocation: AnonymousOrder = {
  uuid: 'WITHOUTLOCATION',
  lines: [
    {
      productUuid: productWithoutLocation.uuid,
      name: productWithoutLocation.name,
      ean13: productWithoutLocation.ean13,
      expectedQuantity: 3,
      preparedQuantity: 0,
      unitAmount: productWithoutLocation.priceWithoutTax,
      percentTaxRate: productWithoutLocation.percentTaxRate,
      locations: productWithoutLocation.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    },
    {
      productUuid: calmosine.uuid,
      name: calmosine.name,
      ean13: calmosine.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00006',
  createdAt: 1674273279000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-with-product-without-location',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const elodieDurandOrder1: CustomerOrder = {
  uuid: 'ELODIEABC',
  customerUuid: elodieDurand.uuid,
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 3,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    },
    {
      productUuid: calmosine.uuid,
      name: calmosine.name,
      ean13: calmosine.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00012',
  createdAt: 1674273279000,
  deliveries: [
    {
      uuid: 'delivery-order-elodie-durand-1',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: elodieDurand.email,
          phone: elodieDurand.phone
        },
        address: {
          firstname: elodieDurand.firstname,
          lastname: elodieDurand.lastname,
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const elodieDurandOrder2: CustomerOrder = {
  uuid: 'ELODIEDEF',
  customerUuid: elodieDurand.uuid,
  lines: [
    {
      productUuid: ultraLevure.uuid,
      name: ultraLevure.name,
      ean13: ultraLevure.ean13,
      expectedQuantity: 1,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      status: OrderLineStatus.Started,
      updatedAt: 1674273279000
    },
    {
      productUuid: calmosine.uuid,
      name: calmosine.name,
      ean13: calmosine.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      status: OrderLineStatus.Prepared,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00012',
  createdAt: 1674273279000,
  deliveries: [
    {
      uuid: 'delivery-order-elodie-durand-2',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: elodieDurand.email,
          phone: elodieDurand.phone
        },
        address: {
          firstname: elodieDurand.firstname,
          lastname: elodieDurand.lastname,
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const lucasLefevreOrder1: CustomerOrder = {
  uuid: 'LUCASABC',
  customerUuid: lucasLefevre.uuid,
  lines: [
    {
      productUuid: calmosine.uuid,
      name: calmosine.name,
      ean13: calmosine.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: calmosine.priceWithoutTax,
      percentTaxRate: calmosine.percentTaxRate,
      locations: calmosine.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674373279000
    }
  ],
  deliveryAddress: {
    firstname: lucasLefevre.firstname,
    lastname: lucasLefevre.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: lucasLefevre.firstname,
    lastname: lucasLefevre.lastname,
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00013',
  createdAt: 1674373279000,
  deliveries: [
    {
      uuid: 'delivery-order-lucas-lefevre-1',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: lucasLefevre.email,
          phone: lucasLefevre.phone
        },
        address: {
          firstname: lucasLefevre.firstname,
          lastname: lucasLefevre.lastname,
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const lucasLefevreOrder2: CustomerOrder = {
  uuid: 'LUCASDEF',
  customerUuid: lucasLefevre.uuid,
  lines: [
    {
      productUuid: ultraLevure.uuid,
      name: ultraLevure.name,
      ean13: ultraLevure.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: ultraLevure.priceWithoutTax,
      percentTaxRate: ultraLevure.percentTaxRate,
      locations: ultraLevure.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674473279000
    }
  ],
  deliveryAddress: {
    firstname: lucasLefevre.firstname,
    lastname: lucasLefevre.lastname,
    address: '12 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: lucasLefevre.firstname,
    lastname: lucasLefevre.lastname,
    address: '12 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00014',
  createdAt: 1674473279000,
  deliveries: [
    {
      uuid: 'delivery-order-lucas-lefevre-2',
      price: 500,
      method: deliveryInRelayPoint,
      pickupId: '7894561',
      trackingNumber: 'Lucas2-021451',
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: lucasLefevre.email,
          phone: lucasLefevre.phone
        },
        address: {
          firstname: lucasLefevre.firstname,
          lastname: lucasLefevre.lastname,
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: []
}

export const orderWithCustomerMessage: AnonymousOrder = {
  uuid: 'order-with-customer-message',
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      expectedQuantity: 2,
      preparedQuantity: 0,
      unitAmount: dolodent.priceWithoutTax,
      percentTaxRate: dolodent.percentTaxRate,
      locations: dolodent.locations,
      status: OrderLineStatus.Created,
      updatedAt: 1674273279000
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  billingAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345',
    country: 'Plop'
  },
  payment: {
    status: PaymentStatus.Payed
  },
  invoiceNumber: '2023-00006',
  createdAt: 1674273279000,
  contact: {
    email: 'jeanbon@anotheremail.com',
    phone: '0123456789'
  },
  deliveries: [
    {
      uuid: 'delivery-order-with-customer-message',
      price: 0,
      method: clickAndCollect,
      sender: {
        contact: {
          email: praden.contact.email,
          phone: praden.contact.phone
        },
        address: praden.address
      },
      receiver: {
        contact: {
          email: 'jeanbon@anotheremail.com',
          phone: '0123456789'
        },
        address: {
          firstname: 'Jean',
          lastname: 'Bon',
          address: '10 rue des peupliers',
          city: 'PlopLand',
          zip: '12345',
          country: 'Plop'
        }
      },
      status: DeliveryStatus.Created
    }
  ],
  messages: [],
  customerMessage: 'Special message'
}
