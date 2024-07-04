<template lang="pug">
div.flex.items-center.justify-center.space-x-4
  UToggle(v-bind="$attrs" v-model="model")
  slot
    div(v-if="model") Actif
    div(v-else) Inactif
</template>
<script lang="ts" setup>
const model = defineModel({ type: Boolean })
</script>
