<template lang="pug">
UBadge.uppercase.py-2.px-4(:color="colors[status]" :ui="{ rounded: 'rounded-full' }") {{ texts[status] }}
</template>

<script setup>
import { ProductStatus } from '@core/entities/product'

defineProps({
  status: {
    type: Number,
    default: () => {
      return 0
    }
  }
})

const texts = {
  [ProductStatus.Active]: 'Actif',
  [ProductStatus.Inactive]: 'Inactif'
}

const colors = {
  [ProductStatus.Active]: 'green',
  [ProductStatus.Inactive]: 'gray'
}
</script>
