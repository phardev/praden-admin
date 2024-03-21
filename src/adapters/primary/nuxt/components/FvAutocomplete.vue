<template lang="pug">
v-autocomplete.autocomplete(
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
.autocomplete .v-field--variant-outlined .v-field__input input {
  box-shadow: none !important;
}
</style>
