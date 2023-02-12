import { usePreparationStore } from '@store/preparationStore'

export interface PreparationLineVM {
  reference: string
  name: string
  quantity: number
}

export interface PreparationLineDetailVM {
  href: string
  reference: string
  lines: Array<PreparationLineVM>
}

export interface StartPreparationsVM {
  global: Array<PreparationLineVM>
  detail: Array<PreparationLineDetailVM>
}

export const startPreparationsVM = (): StartPreparationsVM => {
  const preparationStore = usePreparationStore()
  const selected = preparationStore.selected
  const res = {
    global: [],
    detail: [] as Array<any>
  }
  selected.forEach((uuid) => {
    const order = preparationStore.getByUuid(uuid)
    res.detail.push({
      href: `/orders/${order.uuid}`,
      reference: order.uuid,
      lines: order.lines.map((line) => {
        return {
          reference: line.cip13,
          name: line.name,
          quantity: line.quantity
        }
      })
    })
  })
  res.global = res.detail.reduce((acc, detail) => {
    detail.lines.forEach((line: any) => {
      const lineInGlobal = acc.find((l: any) => l.reference === line.reference)
      if (lineInGlobal) {
        lineInGlobal.quantity += line.quantity
      } else {
        acc.push(JSON.parse(JSON.stringify(line)))
      }
    })
    return acc
  }, [])
  return res
}
