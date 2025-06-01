<template lang="pug">
UBadge.uppercase.py-2.px-4(
  :color="colors[status]"
  :ui="{ rounded: 'rounded-full' }"
) {{ texts[status] }}
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
  0: 'Crée',
  1: 'En préparation',
  2: 'Préparé',
  3: 'Annulé'
}

const colors = {
  0: 'gray',
  1: 'blue',
  2: 'green',
  3: 'red'
}
</script>
