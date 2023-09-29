<template lang="pug">
ft-input(
  ref="inputRef"
  type='text'
  v-bind="$attrs"
)
  slot
</template>

<script lang="ts" setup>
import { useCurrencyInput } from 'vue-currency-input'

defineProps({
  modelValue: {
    type: Number,
    default: () => {
      return undefined
    }
  }
})

const options = {
  currency: 'EUR',
  locale: 'fr-FR'
}

const { inputRef } = useCurrencyInput(options)
</script>
