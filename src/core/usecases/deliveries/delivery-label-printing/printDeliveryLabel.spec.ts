import { printDeliveryLabel } from '@core/usecases/deliveries/delivery-label-printing/printDeliveryLabel'
import { InMemoryDeliveryGateway } from '@adapters/secondary/delivery-gateways/inMemoryDeliveryGateway'
import { deliveryOrderToPrepare3 } from '@utils/testData/deliveries'
import { UUID } from '@core/types/types'

describe('Order delivery label printing', () => {
  let deliveryGateway: InMemoryDeliveryGateway

  beforeEach(() => {
    deliveryGateway = new InMemoryDeliveryGateway()
  })

  it('should print the order label', async () => {
    const delivery = deliveryOrderToPrepare3
    await whenPrintDeliveryLabel(delivery.uuid)
    expect(deliveryGateway.listPrinted()).toStrictEqual([delivery.uuid])
  })

  const whenPrintDeliveryLabel = async (uuid: UUID) => {
    await printDeliveryLabel(uuid, deliveryGateway)
  }
})
