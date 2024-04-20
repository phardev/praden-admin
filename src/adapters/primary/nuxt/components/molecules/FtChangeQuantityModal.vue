<template lang="pug">
ft-modal(v-model="model")
  div.mx-10.my-10
    UFormGroup.pb-4(
      label="Scannez le produit" name="scanner"
    )
      ft-text-field(
        v-model="scan"
        @keyup.enter="productScanned"
      )
  ft-modal(v-model="quantityModal")
    UFormGroup.pb-4(
      label="Entrez la quantité" name="quantity"
    )
      ft-text-field(
        v-model="quantity"
        type="number"
        @keyup.enter="validateQuantity"
      )
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })
const scan = ref('')
const quantityModal = ref(false)
const quantity = ref(0)

const props = defineProps({
  productsReferences: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits<{
  (e: 'quantityChanged', cip13: string, quantity: number): void
}>()

const productScanned = () => {
  if (props.productsReferences.includes(scan.value)) {
    quantityModal.value = true
  }
}

const validateQuantity = () => {
  quantityModal.value = false
  emit('quantityChanged', scan.value, quantity.value)
}
</script>
