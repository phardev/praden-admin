import { WelcomeCodeGateway } from '@core/gateways/welcomeCodeGateway'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'

export const listWelcomeCodes = async (
  welcomeCodeGateway: WelcomeCodeGateway
): Promise<void> => {
  const welcomeCodeStore = useWelcomeCodeStore()
  welcomeCodeStore.startLoading()
  try {
    welcomeCodeStore.list(await welcomeCodeGateway.list())
  } finally {
    welcomeCodeStore.stopLoading()
  }
}
