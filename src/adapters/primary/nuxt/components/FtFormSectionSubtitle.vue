<template lang="pug">
div.flex.align-center.text-subtitle.pb-4
  div.rounded-full.border-2.border-primary1.w-2.h-2.flex.align-center.p-5.justify-center {{ id }}
  div.ml-4 {{ subtitle }}
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: Number,
    default: () => {
      return -1
    }
  },
  subtitle: {
    type: String,
    default: () => {
      return ''
    }
  }
})
</script>
