<template lang="pug">
ft-modal(v-model="model")
  div.grid.grid-cols-1.gap-4.mx-10.my-10(class="md:grid-cols-2")
    ft-button.button-solid.h-24.col-span-2(@click="openRemoveProduct") Retirer un produit
    ft-button.button-solid.h-24.col-span-2(@click="openChangeQuantity") Changer la quantité
    //ft-button.button-solid.h-24.col-span-2(@click="changeReference") Modifier la référence

  ft-remove-product-modal(
    v-model="isRemoveProductOpened"
    @remove="removeProduct"
  )
  ft-change-quantity-modal(
    v-model="isChangeQuantityOpened"
    :products-references="productsReferences"
    @quantity-changed="changeQuantity"
  )
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })

defineProps({
  productsReferences: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits<{
  (e: 'removeProduct', value: string): void
  (e: 'changeQuantity', cip13: string, quantity: number): void
}>()

const isRemoveProductOpened = ref(false)

const openRemoveProduct = () => {
  isRemoveProductOpened.value = true
}

const removeProduct = (cip13: string) => {
  isRemoveProductOpened.value = false
  emit('removeProduct', cip13)
}

const isChangeQuantityOpened = ref(false)

const openChangeQuantity = () => {
  isChangeQuantityOpened.value = true
}

const changeQuantity = (cip13: string, quantity: number) => {
  isChangeQuantityOpened.value = false
  emit('changeQuantity', cip13, quantity)
}
</script>
