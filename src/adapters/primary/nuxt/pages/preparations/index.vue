<template lang="pug">
preparations-printing
.section.no-printme
  preparations-list(:preparations-vm="preparationsVM")
</template>

<script lang="ts" setup>
import { getPreparationsVM } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'

definePageMeta({ layout: 'main' })

const preparationsVM = computed(() => {
  return getPreparationsVM()
})
</script>
