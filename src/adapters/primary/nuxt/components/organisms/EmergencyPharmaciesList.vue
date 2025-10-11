<template lang="pug">
.space-y-6
  div(v-for="group in pharmaciesGroupedByDate" :key="group.date")
    h3.text-lg.font-semibold.mb-3 {{ formatDate(group.date) }}
    .space-y-2
      EmergencyPharmacyCard(
        v-for="pharmacy in group.pharmacies"
        :key="pharmacy.uuid"
        :pharmacy="pharmacy"
        @edit="$emit('edit', pharmacy.uuid)"
        @delete="$emit('delete', pharmacy)"
      )
</template>

<script lang="ts" setup>
import EmergencyPharmacyCard from '@adapters/primary/nuxt/components/molecules/EmergencyPharmacyCard.vue'
import type { PharmacyGroup } from '@adapters/primary/view-models/emergency-pharmacies/emergency-pharmacies-list/emergencyPharmaciesListVM'
import type { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'

defineProps<{
  pharmaciesGroupedByDate: Array<PharmacyGroup>
  formatDate: (timestamp: number) => string
}>()

defineEmits<{
  (e: 'edit', uuid: string): void
  (e: 'delete', pharmacy: EmergencyPharmacy): void
}>()
</script>
