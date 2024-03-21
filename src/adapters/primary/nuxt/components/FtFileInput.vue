<template lang="pug">
v-file-input(
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
