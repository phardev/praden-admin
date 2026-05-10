import { InMemoryDeliveryGateway } from '@adapters/secondary/delivery-gateways/inMemoryDeliveryGateway'
import { generatePickup } from '@core/usecases/deliveries/delivery-pickup-generation/generatePickup'
import { orderPrepared1 } from '@utils/testData/orders'

describe('Generate pickup', () => {
  let deliveryGateway: InMemoryDeliveryGateway

  beforeEach(() => {
    deliveryGateway = new InMemoryDeliveryGateway()
  })

  it('should generate the pickup for the given order', async () => {
    await generatePickup(orderPrepared1.uuid, deliveryGateway)
    expect(deliveryGateway.listGeneratedPickups()).toStrictEqual([
      orderPrepared1.uuid
    ])
  })
})
