<template lang="pug">
div.flex.items-center.justify-center
  USelectMenu.w-44(
    v-model="model"
    :options="options"
  )
    template(#label)
      ft-order-status-badge(v-if="model !== undefined" :status="model")
    template(#option="{ option }")
      ft-order-status-badge(:status="option")
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
import { OrderLineStatus } from '@core/entities/order'

const model = defineModel({ type: String })

const emit = defineEmits<{
  (e: 'clear'): void
}>()

const options = computed(() => {
  return Object.keys(OrderLineStatus).filter((key) => !isNaN(Number(key)))
})

const clear = () => {
  emit('clear')
}
</script>
