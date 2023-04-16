<template lang="pug">
input.mt-8.w-full.rounded-full.border-opposite(
  ref="scanner"
  type='text'
  :placeholder='placeholder'
  :value="scan"
  @change="scanChanged"
  @keyup.enter="scanned"
)

</template>

<script lang="ts" setup>
defineProps({
  placeholder: {
    type: String,
    default: () => {
      return ''
    }
  }
})

const scanner = ref(null)
const scan = ref('')

const emit = defineEmits<{
  (e: 'scanned', value: string): void
  (e: 'scanner-mounted', input: any): void
}>()

onMounted(() => {
  emit('scanner-mounted', scanner.value)
})

const scanChanged = (e: any) => {
  scan.value = e.target.value
}

const scanned = () => {
  emit('scanned', scan.value)
  scan.value = ''
}
</script>
