<template lang="pug">
ft-input(
  :value="formattedValue"
  type='text'
  v-bind="$attrs"
  @input="valueChanged"
  @focus="focus=true"
  @focusout="focus=false"
)
  slot
</template>

<script lang="ts" setup>
import { percentFormatter } from '@utils/formatters'

defineProps({
  modelValue: {
    type: Number,
    default: () => {
      return undefined
    }
  }
})

const focus = ref(false)
const rawValue = ref()

const valueChanged = (e: any) => {
  rawValue.value = e.target.value.replace(',', '.')
}

const formattedValue = computed(() => {
  const f = focus.value
  if (!rawValue.value) return ''
  if (f) return rawValue.value
  return percentFormatter(rawValue.value)
})
</script>
