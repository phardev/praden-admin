<template lang="pug">
ft-text-field(
  ref="inputRef"
  v-model="formattedValue"
  v-bind="$attrs"
  @update:model-value="update"
)
</template>

<script lang="ts" setup>
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps({
  modelValue: {
    type: Number,
    default: () => {
      return null
    }
  }
})

const options = {
  currency: 'EUR',
  locale: 'fr-FR',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueRange: { min: 0 }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { inputRef, formattedValue, numberValue, setValue } =
  useCurrencyInput(options)

watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  }
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// TODO: Why this is needed to make it works ?
defineEmits<{
  (e: 'update:model-value', value: string | undefined): void
}>()
</script>
