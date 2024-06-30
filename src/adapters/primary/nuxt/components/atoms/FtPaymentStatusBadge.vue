<template lang="pug">
UBadge.uppercase.py-2.px-4(:color="colors[status]" :ui="{ rounded: 'rounded-full' }") {{ texts[status] }}
</template>

<script setup>
defineProps({
  status: {
    type: Number,
    default: () => {
      return 0
    }
  }
})

const texts = {
  0: 'En attente de paiement',
  1: 'Payé'
}

const colors = {
  0: 'red',
  1: 'green'
}
</script>
