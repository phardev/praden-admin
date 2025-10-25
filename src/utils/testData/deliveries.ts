import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import {
  clickAndCollect,
  deliveryInRelayPoint,
  deliveryInRelayPointDPD
} from '@utils/testData/deliveryMethods'
import { praden } from '@utils/testData/shop'

export const deliveryOrderToPrepare1: Delivery = {
  uuid: 'delivery-order-to-prepare-1',
  price: 0,
  method: clickAndCollect,
  pickingDate: 1737376937000,
  weight: 1234,
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

export const deliveryOrderToPrepare2: Delivery = {
  uuid: 'delivery-order-to-prepare-2',
  price: 0,
  method: clickAndCollect,
  pickingDate: 1739463340000,
  weight: 1200,
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

export const deliveryOrderToPrepare3: Delivery = {
  uuid: 'delivery-order-to-prepare-3',
  price: 500,
  method: deliveryInRelayPoint,
  weight: 1500,
  pickupId: '85698',
  trackingNumber: 'ToPrepare3-789451',
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

export const deliveryOrderPrepared1: Delivery = {
  uuid: 'delivery-order-prepared-1',
  price: 0,
  method: clickAndCollect,
  pickingDate: 1737330137000,
  weight: 1500,
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

export const deliveryOrderDelivered1: Delivery = {
  uuid: 'delivery-order-delivered-1',
  price: 0,
  method: clickAndCollect,
  pickingDate: 1737330137000,
  weight: 1500,
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
  status: DeliveryStatus.Delivered
}

export const deliveryOrderDelivered2: Delivery = {
  uuid: 'delivery-order-delivered-2',
  price: 0,
  method: deliveryInRelayPointDPD,
  pickingDate: 1737376937000,
  weight: 2200,
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
  status: DeliveryStatus.Delivered
}

export const deliveryOrderWithMissingProduct: Delivery = {
  uuid: 'delivery-order-with-missing-product',
  price: 599,
  method: deliveryInRelayPoint,
  weight: 987,
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
