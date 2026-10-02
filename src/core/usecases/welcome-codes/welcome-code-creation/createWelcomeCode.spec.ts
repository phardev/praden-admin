import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryWelcomeCodeGateway } from '@adapters/secondary/welcome-code-gateways/InMemoryWelcomeCodeGateway'
import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { WelcomeCodeDTO, WelcomeCodeStatus } from '@core/entities/welcomeCode'
import {
  WelcomeCodeError,
  WelcomeCodeErrorCode
} from '@core/errors/WelcomeCodeError'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import { fiveEuroWelcomeCode } from '@utils/testData/welcomeCodes'
import { createPinia, setActivePinia } from 'pinia'
import { createWelcomeCode } from './createWelcomeCode'

describe('Welcome code creation', () => {
  let welcomeCodeStore: ReturnType<typeof useWelcomeCodeStore>
  let welcomeCodeGateway: InMemoryWelcomeCodeGateway
  let dto: WelcomeCodeDTO

  beforeEach(() => {
    setActivePinia(createPinia())
    welcomeCodeStore = useWelcomeCodeStore()
    const uuidGenerator = new FakeUuidGenerator()
    uuidGenerator.setNext('new-welcome-code')
    welcomeCodeGateway = new InMemoryWelcomeCodeGateway(uuidGenerator)
    welcomeCodeGateway.feedWith(fiveEuroWelcomeCode)
    dto = {
      code: 'HELLO10',
      reductionType: ReductionType.Percentage,
      scope: PromotionScope.Products,
      amount: 10,
      conditions: { minimumAmount: 3000 }
    }
  })

  it('should show the created welcome code among the existing ones', async () => {
    await createWelcomeCode(dto, welcomeCodeGateway)
    expect(welcomeCodeStore.items).toStrictEqual([
      fiveEuroWelcomeCode,
      {
        uuid: 'new-welcome-code',
        ...dto,
        isActive: true,
        sentCount: 0,
        usedCount: 0,
        status: WelcomeCodeStatus.Usable
      }
    ])
  })

  it('should refuse a code already taken by a welcome code', async () => {
    dto.code = fiveEuroWelcomeCode.code
    await expect(createWelcomeCode(dto, welcomeCodeGateway)).rejects.toThrow(
      new WelcomeCodeError(
        WelcomeCodeErrorCode.CodeTakenByWelcomeCode,
        fiveEuroWelcomeCode.code
      )
    )
  })

  it('should refuse a code already taken by a promotion code', async () => {
    welcomeCodeGateway.feedPromotionCodesWith(dto.code)
    await expect(createWelcomeCode(dto, welcomeCodeGateway)).rejects.toThrow(
      new WelcomeCodeError(
        WelcomeCodeErrorCode.CodeTakenByPromotionCode,
        dto.code
      )
    )
  })

  it('should be aware that saving is over', async () => {
    await createWelcomeCode(dto, welcomeCodeGateway)
    expect(welcomeCodeStore.isSaving).toBe(false)
  })

  it('should be aware that saving is over when the creation fails', async () => {
    dto.code = fiveEuroWelcomeCode.code
    await createWelcomeCode(dto, welcomeCodeGateway).catch(() => undefined)
    expect(welcomeCodeStore.isSaving).toBe(false)
  })
})
