<template lang="pug">
preparations-printing
.section.no-printme
  preparations-list(:preparations-vm="preparationsVM")
</template>

<script lang="ts" setup>
import { getWaitingPreparationsVM } from '@adapters/primary/view-models/get-waiting-preparations/getWaitingPreparationsVM'

definePageMeta({ layout: 'main' })

const preparationsVM = computed(() => {
  return getWaitingPreparationsVM()
})
</script>
