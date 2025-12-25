<template lang="pug">
ft-modal(v-model="model")
  div.mx-10.my-10
    UFormGroup.pb-4(
      label="Choisissez le produit" name="productChoice"
    )
      ft-autocomplete(
        v-model="productSelected"
        :options="products"
        by="reference"
        option-attribute="name"
        value-attribute="reference"
        :search-attributes="['reference', 'name']"
        @update:model-value="handleProductSelected"
      )
        template(#option="{ option: product }")
          span {{ product.reference }} - {{ product.name }}
  ft-modal(v-model="scanModal")
    UFormGroup.pb-4(
      label="Scannez la nouvelle référence" name="scanner"
    )
      ft-text-field(
        v-model="scan"
        @keyup.enter="productScanned"
      )
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })
const scan = ref('')
const scanModal = ref(false)
const selectedProduct = ref()

defineProps({
  products: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits<{
  (e: 'referenceChanged', oldReference: string, newReference: string): void
}>()

const productSelected = ref('')

const handleProductSelected = (reference: string) => {
  scanModal.value = true
  selectedProduct.value = reference
}

const productScanned = () => {
  scanModal.value = false
  emit('referenceChanged', selectedProduct.value, scan.value)
}
</script>
