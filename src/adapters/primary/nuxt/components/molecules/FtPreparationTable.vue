<template lang="pug">
ft-table(
  :headers="vm.headers"
  :items="vm.lines"
  :is-loading="vm.isLoading"
)
  template(#status="{ item }")
    icon.icon-lg.text-yellow-400(v-if="item.status === PreparationStatus.NotPrepared" name="bx:bxs-error")
    icon.icon-lg.text-grass9(v-if="item.status === PreparationStatus.Prepared" name="material-symbols:check-circle")
    icon.icon-lg.text-tomato8(v-if="item.status > PreparationStatus.Prepared" name="fluent-mdl2:status-error-full")
</template>

<script setup lang="ts">
import { PreparationStatus } from '@adapters/primary/view-models/preparations/get-preparation/getPreparationVM'

defineProps({
  vm: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>
