<template lang="pug">
  ft-table(
    v-bind="{ ...$attrs, ...$slots }"
  )
    template(v-for="(_, name) in $slots", #[name]="scope")
      slot(:name="name" v-bind="scope")
    template(#status="{ item }")
      ft-delivery-status-badge(:status="item.status")
</template>

<script setup lang="ts">
defineProps({
  vm: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>
