import { usePreparationStore } from '@store/preparationStore'
import { Header } from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'

export enum PreparationStatus {
  NotPrepared,
  Prepared,
  ErrorTooMuchQuantity
}

export interface GetPreparationLineVM {
  reference: string
  href: string
  name: string
  expectedQuantity: number
  preparedQuantity: number
  status: PreparationStatus
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

const getLineStatus = (line: GetPreparationLineVM): PreparationStatus => {
  if (line.expectedQuantity < line.preparedQuantity)
    return PreparationStatus.ErrorTooMuchQuantity
  return line.expectedQuantity === line.preparedQuantity
    ? PreparationStatus.Prepared
    : PreparationStatus.NotPrepared
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
    },
    {
      name: 'Status',
      value: 'status'
    }
  ]
  const lines: Array<GetPreparationLineVM> = preparation.lines.map((line) => {
    return {
      reference: line.cip13,
      name: line.name,
      expectedQuantity: line.expectedQuantity,
      preparedQuantity: line.preparedQuantity,
      status: getLineStatus(line)
    }
  })
  return {
    reference: preparation.uuid,
    headers,
    lines,
    canValidate: isValid(lines)
  }
}
