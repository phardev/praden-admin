<template lang="pug">
UBadge.text-xs.font-medium(:color="badgeColor" size="sm" variant="subtle" :ui="{ rounded: 'rounded-full', padding: 'px-2 py-0.5' }") {{ badgeText }}
</template>

<script setup lang="ts">
const props = defineProps({
  allowed: {
    type: Boolean,
    required: true
  }
})

const badgeText = computed(() => (props.allowed ? 'Autorisé' : 'Interdit'))
const badgeColor = computed(() => (props.allowed ? 'green' : 'pink'))
</script>
