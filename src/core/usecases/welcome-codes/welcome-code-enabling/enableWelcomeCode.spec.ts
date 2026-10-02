import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryWelcomeCodeGateway } from '@adapters/secondary/welcome-code-gateways/InMemoryWelcomeCodeGateway'
import { WelcomeCodeStatus } from '@core/entities/welcomeCode'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import { disabledWelcomeCode } from '@utils/testData/welcomeCodes'
import { createPinia, setActivePinia } from 'pinia'
import { enableWelcomeCode } from './enableWelcomeCode'

describe('Welcome code enabling', () => {
  it('should show the welcome code as usable again', async () => {
    setActivePinia(createPinia())
    const welcomeCodeGateway = new InMemoryWelcomeCodeGateway(
      new FakeUuidGenerator()
    )
    welcomeCodeGateway.feedWith(disabledWelcomeCode)
    await enableWelcomeCode(disabledWelcomeCode.uuid, welcomeCodeGateway)
    expect(useWelcomeCodeStore().items).toStrictEqual([
      {
        ...disabledWelcomeCode,
        isActive: true,
        status: WelcomeCodeStatus.Usable
      }
    ])
  })
})
