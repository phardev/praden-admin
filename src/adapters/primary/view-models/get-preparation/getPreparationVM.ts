import { usePreparationStore } from '@store/preparationStore'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'

export interface GetPreparationLineVM {
  reference: string
  name: string
  expectedQuantity: number
  preparedQuantity: number
}

export interface GetPreparationVM {
  reference: string
  headers: Array<Header>
  lines: Array<GetPreparationLineVM>
  canValidate: boolean
}

const isValid = (lines: Array<GetPreparationLineVM>) => {
  return lines.every((line) => line.expectedQuantity === line.preparedQuantity)
}

export const getPreparationVM = () => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  if (!preparation) {
    return {
      reference: '',
      headers: [],
      lines: [],
      canValidate: false
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
      value: 'preparedQuantity'
    }
  ]
  const lines: Array<GetPreparationLineVM> = preparation.lines.map((line) => {
    return {
      reference: line.cip13,
      name: line.name,
      expectedQuantity: line.expectedQuantity,
      preparedQuantity: line.preparedQuantity
    }
  })
  return {
    reference: preparation.uuid,
    headers,
    lines,
    canValidate: isValid(lines)
  }
}
