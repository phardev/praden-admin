<template lang="pug">
UInput.mt-8.w-full.rounded-full.border-opposite(
  v-model="model"
  v-bind="$attrs"
  autofocus
  @keyup.enter="scanned"
)

</template>

<script lang="ts" setup>
const model = defineModel({ type: String })

const emit = defineEmits<{
  (e: 'scanned', value: string): void
}>()

const scanned = () => {
  const ean13Length = 13
  if (model.value.length > ean13Length) {
    scanGS1()
  } else {
    emit('scanned', model.value)
  }
  model.value = ''
}

const scanGS1 = () => {
  const ean13Regex = /010(\d{13})/
  const ean13Match = model.value.match(ean13Regex)
  if (ean13Match) {
    emit('scanned', ean13Match[1])
  }
}
</script>
