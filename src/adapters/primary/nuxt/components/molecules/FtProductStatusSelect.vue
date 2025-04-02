<template lang="pug">
div.flex.items-center.justify-center
  USelectMenu.w-44(
    v-model="model"
    :options="options"
  )
    template(#label)
      ft-product-status-badge(v-if="model !== undefined" :status="model")
    template(#option="{ option }")
      ft-product-status-badge(:status="option")
  UButton(
    v-if="model !== undefined"
    color="gray"
    variant="link"
    icon="i-heroicons-x-mark-20-solid"
    :padded="false"
    @click.prevent="clear"
  )
</template>

<script lang="ts" setup>
import { ProductStatus } from '@core/entities/product'

const model = defineModel<ProductStatus | undefined>()

const emit = defineEmits<{
  (e: 'clear'): void
}>()

const options = computed(() => {
  return Object.values(ProductStatus)
})

const clear = () => {
  emit('clear')
}
</script>
