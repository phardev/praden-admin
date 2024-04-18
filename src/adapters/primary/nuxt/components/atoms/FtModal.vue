<template lang="pug">
UModal(v-model="model")
  .p-4
    slot
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })
</script>
