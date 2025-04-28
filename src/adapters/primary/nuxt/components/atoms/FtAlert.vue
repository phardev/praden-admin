<template lang="pug">
  UAlert(
    :title="errorTitle"
    :description="errorMessage"
    color="orange"
    variant="solid"
    :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
    @close="dismiss"
  )
</template>

<script setup lang="ts">
defineProps({
  errorTitle: {
    type: String,
    default() {
      return ''
    }
  },
  errorMessage: {
    type: String,
    default() {
      return ''
    }
  }
})

const emit = defineEmits(['dismiss'])

const dismiss = () => {
  console.log('dismiss')
  emit('dismiss')
}
</script>
