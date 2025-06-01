<template lang="pug">
div
  UToggle(v-bind="$attrs" v-model="model")
  slot
</template>
<script lang="ts" setup>
const model = defineModel({ type: Boolean })
</script>
