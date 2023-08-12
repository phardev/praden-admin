export const useSelection = () => {
  const selected = ref([] as Array<any>)

  const get = (): Array<any> => {
    return selected.value
  }

  const clear = () => {
    selected.value = []
  }

  const toggleSelect = (item: any) => {
    const index = selected.value.findIndex((i) => i === item)
    if (index > -1) {
      selected.value.splice(index, 1)
    } else {
      selected.value.push(item)
    }
  }

  const toggleSelectAll = (items: Array<any>) => {
    if (selected.value.length) {
      selected.value = []
    } else {
      selected.value = items
    }
  }

  return { toggleSelect, toggleSelectAll, clear, get }
}
