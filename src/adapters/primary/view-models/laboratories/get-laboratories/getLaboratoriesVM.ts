import { Header } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { UUID } from '@core/types/types'

export interface GetLaboratoriesItemsVM {
  uuid: UUID
  miniature: string
  name: string
}

export interface GetLaboratoriesVM {
  headers: Array<Header>
  items: Array<GetLaboratoriesItemsVM>
}

export const getLaboratoriesVM = (): GetLaboratoriesVM => {
  const headers = [
    {
      name: 'Miniature',
      value: 'miniature'
    },
    {
      name: 'Nom',
      value: 'name'
    }
  ]

  const laboratoryStore = useLaboratoryStore()

  return {
    headers,
    items: laboratoryStore.items.map((l) => {
      return {
        uuid: l.uuid,
        miniature: l.miniature || '',
        name: l.name
      }
    })
  }
}
