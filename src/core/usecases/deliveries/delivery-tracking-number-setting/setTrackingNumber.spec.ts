import { InMemoryDeliveryGateway } from '@adapters/secondary/delivery-gateways/inMemoryDeliveryGateway'
import { setTrackingNumber } from '@core/usecases/deliveries/delivery-tracking-number-setting/setTrackingNumber'
import { orderPrepared1 } from '@utils/testData/orders'

describe('Set tracking number', () => {
  let deliveryGateway: InMemoryDeliveryGateway

  beforeEach(() => {
    deliveryGateway = new InMemoryDeliveryGateway()
  })

  it('should set the tracking number for the given delivery', async () => {
    const trackingNumber = 'MANUAL-TRACKING-123'
    await setTrackingNumber(
      orderPrepared1.uuid,
      trackingNumber,
      deliveryGateway
    )
    expect(deliveryGateway.listSettedTrackingNumbers()).toStrictEqual([
      { uuid: orderPrepared1.uuid, trackingNumber }
    ])
  })
})
