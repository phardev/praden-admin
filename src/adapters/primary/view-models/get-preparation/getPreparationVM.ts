import { usePreparationStore } from '@store/preparationStore'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'

export interface GetPreparationLineVM {
  reference: string
  name: string
  expectedQuantity: number
  currentQuantity: number
}

export interface GetPreparationVM {
  reference: string
  headers: Array<Header>
  lines: Array<GetPreparationLineVM>
}

export const getPreparationVM = () => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  if (!preparation) {
    return {
      reference: '',
      headers: [],
      lines: []
    }
  }
  const headers: Array<Header> = [
    {
      name: 'Référence',
      value: 'reference'
    },
    {
      name: 'Nom',
      value: 'name'
    },
    {
      name: 'Quantité attendue',
      value: 'expectedQuantity'
    },
    {
      name: 'Quantité préparée',
      value: 'currentQuantity'
    }
  ]
  return {
    reference: preparation.uuid,
    headers,
    lines: preparation.lines.map((line) => {
      return {
        reference: line.cip13,
        name: line.name,
        expectedQuantity: line.quantity,
        currentQuantity: 0
      }
    })
  }
}
