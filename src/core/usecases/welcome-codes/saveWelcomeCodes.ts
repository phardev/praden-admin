import { WelcomeCodeGateway } from '@core/gateways/welcomeCodeGateway'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'

export const saveWelcomeCodes = async (
  welcomeCodeGateway: WelcomeCodeGateway,
  save: () => Promise<void>
): Promise<void> => {
  const welcomeCodeStore = useWelcomeCodeStore()
  welcomeCodeStore.startSaving()
  try {
    await save()
    welcomeCodeStore.list(await welcomeCodeGateway.list())
  } finally {
    welcomeCodeStore.stopSaving()
  }
}
