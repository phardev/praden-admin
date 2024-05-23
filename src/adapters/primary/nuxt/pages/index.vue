<template>
  <div>
    <p>Current Environment: {{ env }}</p>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'main' })
const { ENV } = useRuntimeConfig().public
console.log('Runtime Config ENV:', ENV) // Add this line to debug
const env = ENV
</script>
