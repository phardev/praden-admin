import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryWelcomeCodeGateway } from '@adapters/secondary/welcome-code-gateways/InMemoryWelcomeCodeGateway'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import {
  fiveEuroWelcomeCode,
  tenPercentWelcomeCode
} from '@utils/testData/welcomeCodes'
import { createPinia, setActivePinia } from 'pinia'
import { listWelcomeCodes } from './listWelcomeCodes'

describe('Welcome codes listing', () => {
  let welcomeCodeStore: ReturnType<typeof useWelcomeCodeStore>
  let welcomeCodeGateway: InMemoryWelcomeCodeGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    welcomeCodeStore = useWelcomeCodeStore()
    welcomeCodeGateway = new InMemoryWelcomeCodeGateway(new FakeUuidGenerator())
  })

  it('should list nothing when there is no welcome code', async () => {
    await listWelcomeCodes(welcomeCodeGateway)
    expect(welcomeCodeStore.items).toStrictEqual([])
  })

  it('should list the welcome codes', async () => {
    welcomeCodeGateway.feedWith(fiveEuroWelcomeCode, tenPercentWelcomeCode)
    await listWelcomeCodes(welcomeCodeGateway)
    expect(welcomeCodeStore.items).toStrictEqual([
      fiveEuroWelcomeCode,
      tenPercentWelcomeCode
    ])
  })

  it('should be aware that loading is over', async () => {
    await listWelcomeCodes(welcomeCodeGateway)
    expect(welcomeCodeStore.isLoading).toBe(false)
  })
})
