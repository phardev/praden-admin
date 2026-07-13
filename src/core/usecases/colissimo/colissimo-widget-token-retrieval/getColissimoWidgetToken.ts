import { ColissimoWidgetGateway } from '@core/gateways/colissimoWidgetGateway'
import { useColissimoWidgetStore } from '@store/colissimoWidgetStore'

export const getColissimoWidgetToken = async (
  colissimoWidgetGateway: ColissimoWidgetGateway
) => {
  const colissimoWidgetStore = useColissimoWidgetStore()
  try {
    colissimoWidgetStore.startLoading()
    const token = await colissimoWidgetGateway.getToken()
    colissimoWidgetStore.setToken(token)
  } finally {
    colissimoWidgetStore.stopLoading()
  }
}
