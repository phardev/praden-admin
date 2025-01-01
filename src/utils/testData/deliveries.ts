import {
  clickAndCollect,
  deliveryInRelayPoint
} from '@utils/testData/deliveryMethods'
import { praden } from '@utils/testData/shop'
import { Delivery } from '@core/entities/order'

export const deliveryOrderToPrepare1: Delivery = {
  uuid: 'delivery-order-to-prepare-1',
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
  }
}

export const deliveryOrderToPrepare2: Delivery = {
  uuid: 'delivery-order-to-prepare-2',
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
  }
}

export const deliveryOrderToPrepare3: Delivery = {
  uuid: 'delivery-order-to-prepare-3',
  price: 500,
  method: deliveryInRelayPoint,
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
  }
}
