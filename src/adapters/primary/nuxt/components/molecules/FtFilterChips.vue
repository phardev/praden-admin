<template lang="pug">
div.flex.flex-wrap.items-center.gap-2(v-if="filters.length")
  UButton(
    v-for="(filter, index) in filters"
    :key="index"
    color="gray"
    variant="soft"
    size="xs"
    trailing-icon="i-heroicons-x-mark-20-solid"
    :aria-label="`Retirer le filtre ${filter.label}`"
    @click="remove(filter)"
  ) {{ filter.label }}
  UButton(
    color="gray"
    variant="link"
    size="xs"
    @click="clearAll"
  ) Tout effacer
</template>

<script lang="ts" setup>
import type { ActiveFilterVM } from '@adapters/primary/view-models/shared/filters'

defineProps<{
  filters: Array<ActiveFilterVM>
}>()

const emit = defineEmits<{
  (e: 'remove', filter: ActiveFilterVM): void
  (e: 'clearAll'): void
}>()

const remove = (filter: ActiveFilterVM) => {
  emit('remove', filter)
}

const clearAll = () => {
  emit('clearAll')
}
</script>
