<template lang="pug">
ft-modal(v-model="model")
  div.grid.grid-cols-1.gap-4.mx-10.my-10(class="md:grid-cols-2")
    ft-button.button-solid.h-24.col-span-2(@click="openRemoveProduct") Retirer un produit
    ft-button.button-solid.h-24.col-span-2(@click="openChangeQuantity") Changer la quantité
    ft-button.button-solid.h-24.col-span-2(@click="openChangeReference") Modifier la référence

  ft-remove-product-modal(
    v-model="isRemoveProductOpened"
    @remove="removeProduct"
  )
  ft-change-quantity-modal(
    v-model="isChangeQuantityOpened"
    :products-references="productsReferences"
    @quantity-changed="changeQuantity"
  )
  ft-change-reference-modal(
    v-model="isChangeReferenceOpened"
    :products="products"
    @reference-changed="changeReference"
  )
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })

const props = defineProps({
  products: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits<{
  (e: 'removeProduct', value: string): void
  (e: 'changeQuantity', cip13: string, quantity: number): void
  (e: 'changeReference', oldReference: string, newReference: number): void
}>()

const isRemoveProductOpened = ref(false)

const openRemoveProduct = () => {
  isRemoveProductOpened.value = true
}

const removeProduct = (cip13: string) => {
  isRemoveProductOpened.value = false
  emit('removeProduct', cip13)
}

const productsReferences = computed(() => {
  return props.products.map((p) => p.reference)
})

const isChangeQuantityOpened = ref(false)

const openChangeQuantity = () => {
  isChangeQuantityOpened.value = true
}

const changeQuantity = (cip13: string, quantity: number) => {
  isChangeQuantityOpened.value = false
  emit('changeQuantity', cip13, quantity)
}

const isChangeReferenceOpened = ref(false)

const openChangeReference = () => {
  isChangeReferenceOpened.value = true
}

const changeReference = (oldReference: string, newReference: number) => {
  isChangeReferenceOpened.value = false
  emit('changeReference', oldReference, newReference)
}
</script>
