import { DeliveryStatus, Order } from '@core/entities/order'
import { dolodent, ultraLevure } from '@utils/testData/products'

export const orderToPrepare1: Order = {
  uuid: 'XIKOKI',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      quantity: 2,
      deliveryStatus: DeliveryStatus.Created
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  }
}

export const orderPrepared1: Order = {
  uuid: 'JOURJL',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      quantity: 2,
      deliveryStatus: DeliveryStatus.Shipped
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  }
}

export const orderInPreparation1: Order = {
  uuid: 'UTRIEL',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      quantity: 2,
      deliveryStatus: DeliveryStatus.Processing
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  }
}

export const orderDelivered1: Order = {
  uuid: 'HGFRIW',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      quantity: 2,
      deliveryStatus: DeliveryStatus.Delivered
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  }
}

export const orderWithMissingProduct1: Order = {
  uuid: 'HGFRIW',
  lines: [
    {
      name: dolodent.name,
      cip13: dolodent.cip13,
      quantity: 2,
      deliveryStatus: DeliveryStatus.Shipped
    },
    {
      name: ultraLevure.name,
      cip13: ultraLevure.cip13,
      quantity: 4,
      deliveryStatus: DeliveryStatus.Processing
    }
  ],
  deliveryAddress: {
    firstname: 'Jean',
    lastname: 'Bon',
    address: '10 rue des peupliers',
    city: 'PlopLand',
    zip: '12345'
  }
}
