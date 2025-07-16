const modalStack = ref<string[]>([])

export function useModalStack(id: string) {
  function open() {
    modalStack.value.push(id)
  }
  function close() {
    const idx = modalStack.value.lastIndexOf(id)
    if (idx !== -1) modalStack.value.splice(idx, 1)
  }
  function isTop() {
    return modalStack.value[modalStack.value.length - 1] === id
  }
  return { open, close, isTop }
}
