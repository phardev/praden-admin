<template lang="pug">
UInputMenu(
  v-model="model"
  v-bind="$attrs"
  size="lg"
)
</template>
<script lang="ts" setup>
const model = defineModel({ type: Array })
</script>
