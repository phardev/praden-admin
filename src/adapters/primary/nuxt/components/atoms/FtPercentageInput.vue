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

onMounted(() => {
  rawValue.value = props.modelValue
})

watch(
  () => props.modelValue,
  (value) => {
    rawValue.value = value
  }
)

const emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined): void
}>()

const valueChanged = (value: string) => {
  if (value.length) {
    rawValue.value = value.replace(',', '.')
    emit('update:model-value', parseFloat(rawValue.value).toString())
  } else {
    emit('update:model-value', '')
  }
}

const formattedValue = computed(() => {
  const f = focus.value
  if (!rawValue.value) {
    return ''
  }
  if (f) return rawValue.value
  return percentFormatter(rawValue.value)
})
</script>
