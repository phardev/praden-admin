<template lang="pug">
ft-text-field(
  v-model="formattedValue"
  v-bind="$attrs"
  @update:model-value="valueChanged"
  @focus="focus=true"
  @focusout="focus=false"
)
</template>

<script lang="ts" setup>
import { percentFormatter } from '@utils/formatters'

const focus = ref(false)
const rawValue = ref()

const props = defineProps({
  modelValue: {
    type: Number,
    default: () => {
      return null
    }
  }
})

watch(
  () => props.modelValue,
  (value) => {
    console.log('plop')
    rawValue.value = value
  }
)

const emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined): void
}>()

const valueChanged = (value: string) => {
  rawValue.value = value.replace(',', '.')
  emit('update:model-value', rawValue.value)
}

const formattedValue = computed(() => {
  const f = focus.value
  console.log('f: ', f)
  console.log('rawValue: ', rawValue.value)
  if (!rawValue.value) return ''
  if (f) return rawValue.value
  return percentFormatter(rawValue.value)
})
</script>
