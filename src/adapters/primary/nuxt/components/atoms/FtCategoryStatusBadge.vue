<template lang="pug">
UBadge.uppercase.py-2.px-4(:color="colors[status]" :ui="{ rounded: 'rounded-full' }") {{ texts[status] }}
</template>

<script setup>
import { CategoryStatus } from '@core/entities/category'

defineProps({
  status: {
    type: String,
    default: () => {
      return CategoryStatus.Active
    }
  }
})

const texts = {
  [CategoryStatus.Active]: 'Actif',
  [CategoryStatus.Inactive]: 'Inactif'
}

const colors = {
  [CategoryStatus.Active]: 'green',
  [CategoryStatus.Inactive]: 'gray'
}
</script>
