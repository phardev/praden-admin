import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryWelcomeCodeGateway } from '@adapters/secondary/welcome-code-gateways/InMemoryWelcomeCodeGateway'
import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { WelcomeCodeDTO } from '@core/entities/welcomeCode'
import {
  WelcomeCodeError,
  WelcomeCodeErrorCode
} from '@core/errors/WelcomeCodeError'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import {
  fiveEuroWelcomeCode,
  tenPercentWelcomeCode
} from '@utils/testData/welcomeCodes'
import { createPinia, setActivePinia } from 'pinia'
import { editWelcomeCode } from './editWelcomeCode'

describe('Welcome code edition', () => {
  let welcomeCodeStore: ReturnType<typeof useWelcomeCodeStore>
  let welcomeCodeGateway: InMemoryWelcomeCodeGateway
  let dto: WelcomeCodeDTO

  beforeEach(() => {
    setActivePinia(createPinia())
    welcomeCodeStore = useWelcomeCodeStore()
    welcomeCodeGateway = new InMemoryWelcomeCodeGateway(new FakeUuidGenerator())
    welcomeCodeGateway.feedWith(fiveEuroWelcomeCode, tenPercentWelcomeCode)
    dto = {
      code: 'HELLO20',
      reductionType: ReductionType.Percentage,
      scope: PromotionScope.Products,
      amount: tenPercentWelcomeCode.amount * 2,
      conditions: {}
    }
  })

  it('should show the edited welcome code without the dates that were removed', async () => {
    await editWelcomeCode(tenPercentWelcomeCode.uuid, dto, welcomeCodeGateway)
    expect(welcomeCodeStore.items).toStrictEqual([
      fiveEuroWelcomeCode,
      {
        uuid: tenPercentWelcomeCode.uuid,
        ...dto,
        isActive: tenPercentWelcomeCode.isActive,
        sentCount: tenPercentWelcomeCode.sentCount,
        usedCount: tenPercentWelcomeCode.usedCount,
        status: tenPercentWelcomeCode.status
      }
    ])
  })

  it('should refuse a code taken by another welcome code', async () => {
    dto.code = fiveEuroWelcomeCode.code
    await expect(
      editWelcomeCode(tenPercentWelcomeCode.uuid, dto, welcomeCodeGateway)
    ).rejects.toThrow(
      new WelcomeCodeError(
        WelcomeCodeErrorCode.CodeTakenByWelcomeCode,
        fiveEuroWelcomeCode.code
      )
    )
  })

  it('should refuse a welcome code that does not exist', async () => {
    await expect(
      editWelcomeCode('unknown', dto, welcomeCodeGateway)
    ).rejects.toThrow(
      new WelcomeCodeError(WelcomeCodeErrorCode.NotFound, 'unknown')
    )
  })

  it('should be aware that saving is over when the edition fails', async () => {
    await editWelcomeCode('unknown', dto, welcomeCodeGateway).catch(
      () => undefined
    )
    expect(welcomeCodeStore.isSaving).toBe(false)
  })
})
