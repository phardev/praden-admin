<template lang="pug">
ft-modal(v-model="model")
  div.mx-10.my-10
    UFormGroup.pb-4(label="Scannez le produit à retirer" name="scanner")
      ft-text-field(
        v-model="scan"
        @keyup.enter="removeProduct"
      )
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })
const scan = ref('')

const emit = defineEmits<{
  (e: 'remove', value: string): void
}>()

const removeProduct = () => {
  emit('remove', scan.value)
}
</script>
