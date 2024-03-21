<template lang="pug">
v-text-field.text-field(
  v-bind="$attrs"
  variant="outlined"
  :base-color="color"
  :color="color"
)
</template>

<script setup>
import { useCssVariables } from 'vue-composable'

const { color } = useCssVariables({ color: '--color-primary11' })
</script>

<style lang="scss">
.text-field .v-field--variant-outlined .v-field__field input {
  box-shadow: none !important;
}
</style>
