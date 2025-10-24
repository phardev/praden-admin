<template lang="pug">
.pharmacy-card.p-4.border.rounded.flex.items-start.justify-between.transition-all(
  :class="[isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200', 'hover:shadow-md']"
)
  .flex-1
    .flex.items-center.mb-2
      icon.mr-2(
        :name="isActive ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
        :class="isActive ? 'text-green-600' : 'text-gray-400'"
      )
      span.font-semibold.text-lg {{ pharmacy.name }}
    .space-y-1.text-sm.text-gray-600
      .flex.items-center
        icon.mr-2.flex-shrink-0(name="i-heroicons-map-pin")
        span {{ pharmacy.address }}
      .flex.items-center
        icon.mr-2.flex-shrink-0(name="i-heroicons-phone")
        span {{ pharmacy.phone }}
  .flex.flex-col.space-y-2.ml-4
    UButton(
      color="primary"
      variant="ghost"
      icon="i-heroicons-pencil"
      size="sm"
      @click="$emit('edit')"
    )
    UButton(
      color="red"
      variant="ghost"
      icon="i-heroicons-trash"
      size="sm"
      @click="$emit('delete')"
    )
</template>

<script lang="ts" setup>
import type { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'

const props = defineProps<{
  pharmacy: EmergencyPharmacy
}>()

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const isActive = computed(() => props.pharmacy.isActive)
</script>
