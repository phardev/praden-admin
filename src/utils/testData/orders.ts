import {
  DeliveryStatus,
  Order
} from '@core/usecases/order/orders-to-prepare-listing/order'
import { dolodent } from '@utils/testData/products'

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
