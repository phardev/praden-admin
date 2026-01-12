import { InMemoryLoyaltyConfigGateway } from '@adapters/secondary/loyalty-config-gateways/inMemoryLoyaltyConfigGateway'
import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import type { UpdateLoyaltyConfigDTO } from '@core/gateways/loyaltyConfigGateway'
import { updateLoyaltyConfig } from '@core/usecases/loyalty-config/update-loyalty-config/updateLoyaltyConfig'
import { useLoyaltyConfigStore } from '@store/loyaltyConfigStore'
import { defaultLoyaltyConfig } from '@utils/testData/loyaltyConfig'
import { createPinia, setActivePinia } from 'pinia'

describe('Update loyalty config', () => {
  let loyaltyConfigStore: ReturnType<typeof useLoyaltyConfigStore>
  let loyaltyConfigGateway: InMemoryLoyaltyConfigGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyConfigStore = useLoyaltyConfigStore()
    loyaltyConfigGateway = new InMemoryLoyaltyConfigGateway()
  })

  describe('Update loyalty config', () => {
    it('should update the loyalty config in the store', async () => {
      givenExistingLoyaltyConfig(defaultLoyaltyConfig)
      const updateDto: UpdateLoyaltyConfigDTO = {
        pointsPerEuro: 5,
        isEnabled: true
      }
      await whenUpdateLoyaltyConfig(updateDto)
      expectCurrentLoyaltyConfigToBe({
        pointsPerEuro: 5,
        isEnabled: true
      })
    })
  })

  const givenExistingLoyaltyConfig = (config: LoyaltyConfig) => {
    loyaltyConfigGateway.feedWith(config)
  }

  const whenUpdateLoyaltyConfig = async (dto: UpdateLoyaltyConfigDTO) => {
    await updateLoyaltyConfig(dto, loyaltyConfigGateway)
  }

  const expectCurrentLoyaltyConfigToBe = (config: LoyaltyConfig) => {
    expect(loyaltyConfigStore.config).toStrictEqual(config)
  }
})
