import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryWelcomeCodeGateway } from '@adapters/secondary/welcome-code-gateways/InMemoryWelcomeCodeGateway'
import { WelcomeCodeStatus } from '@core/entities/welcomeCode'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import { fiveEuroWelcomeCode } from '@utils/testData/welcomeCodes'
import { createPinia, setActivePinia } from 'pinia'
import { disableWelcomeCode } from './disableWelcomeCode'

describe('Welcome code disabling', () => {
  it('should show the welcome code as disabled', async () => {
    setActivePinia(createPinia())
    const welcomeCodeGateway = new InMemoryWelcomeCodeGateway(
      new FakeUuidGenerator()
    )
    welcomeCodeGateway.feedWith(fiveEuroWelcomeCode)
    await disableWelcomeCode(fiveEuroWelcomeCode.uuid, welcomeCodeGateway)
    expect(useWelcomeCodeStore().items).toStrictEqual([
      {
        ...fiveEuroWelcomeCode,
        isActive: false,
        status: WelcomeCodeStatus.Disabled
      }
    ])
  })
})
