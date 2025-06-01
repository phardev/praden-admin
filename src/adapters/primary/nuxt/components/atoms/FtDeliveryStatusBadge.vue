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
  0: 'Crée',
  1: 'Préparé',
  2: 'Expédié',
  3: 'Livré'
}

const colors = {
  0: 'gray',
  1: 'blue',
  2: 'orange',
  3: 'green'
}
</script>
