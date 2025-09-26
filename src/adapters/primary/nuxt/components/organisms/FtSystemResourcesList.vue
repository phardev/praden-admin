<template lang="pug">
.space-y-4
  .flex.items-center.justify-center.py-8(v-if="isLoading")
    .text-center
      .text-gray-400.mb-2
        icon.h-8.w-8.animate-spin(name="i-heroicons-arrow-path-20-solid")
      p.text-gray-600 {{ $t('common.loading') }}
  .space-y-3(v-else-if="items.length > 0")
    .flex.items-center.justify-between.py-4.border-b.border-gray-200(
      v-for="resource in items"
      :key="resource"
    )
      .flex.items-center.space-x-3
        span.text-lg.font-medium.text-gray-900 {{ resource }}
  .flex.items-center.justify-center.py-12(v-else)
    .text-center
      .text-gray-400.mb-2
        icon.h-12.w-12(name="i-heroicons-cog-6-tooth-20-solid")
      p.text-gray-600 {{ $t('systemResources.noResources') }}
</template>

<script setup lang="ts">
defineProps<{
  items: Array<string>
  isLoading: boolean
}>()
</script>
