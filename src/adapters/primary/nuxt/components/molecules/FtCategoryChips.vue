<template lang="pug">
div.flex.flex-wrap.gap-2(
  ref="root"
  role="radiogroup"
  @keydown.left.prevent="moveSelection(-1)"
  @keydown.right.prevent="moveSelection(1)"
)
  button.rounded-full.px-3.py-2.text-sm.font-medium.transition-colors(
    v-for="option in options"
    :key="option.value"
    type="button"
    role="radio"
    :aria-checked="option.value === modelValue"
    :tabindex="isFocusable(option.value) ? 0 : -1"
    :class="chipClass(option.value)"
    @click="select(option.value)"
  ) {{ option.label }}
</template>

<script lang="ts" setup>
interface CategoryChipOption {
  value: string
  label: string
}

const props = defineProps<{
  options: Array<CategoryChipOption>
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const root = ref<HTMLElement>()

const selectedClass = 'bg-customPrimary-600 text-white'
const unselectedClass =
  'bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'

const chipClass = (value: string): string =>
  value === props.modelValue ? selectedClass : unselectedClass

const isFocusable = (value: string): boolean =>
  props.modelValue
    ? value === props.modelValue
    : value === props.options[0]?.value

const select = (value: string) => {
  emit('update:modelValue', value)
}

const focusChip = (index: number) => {
  const buttons = root.value?.querySelectorAll<HTMLButtonElement>('button')
  buttons?.[index]?.focus()
}

const selectedIndex = (): number =>
  props.options.findIndex(
    (option: CategoryChipOption) => option.value === props.modelValue
  )

const moveSelection = (offset: number) => {
  const count = props.options.length
  if (count === 0) return
  const nextIndex = (selectedIndex() + offset + count) % count
  select(props.options[nextIndex].value)
  focusChip(nextIndex)
}

const focus = () => {
  focusChip(Math.max(selectedIndex(), 0))
}

defineExpose({ focus })
</script>
