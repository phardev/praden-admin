<template lang="pug">
ft-modal(v-model="model")
  div.grid.grid-cols-1.gap-4.mx-10.my-10(class="md:grid-cols-2")
    ft-button.button-solid.h-24.col-span-2.text-lg(@click="openRemoveProduct") Retirer un produit
    ft-button.button-solid.h-24.col-span-2.text-lg(@click="openChangeQuantity") Changer la quantité
    ft-button.button-solid.h-24.col-span-2.text-lg(@click="openChangeReference") Modifier la référence
    ft-button.button-solid.h-24.col-span-2.text-lg(@click="validatePreparation") Valider la préparation
    ft-button.button-solid.h-24.col-span-2.text-lg(@click="cancelPreparation") Annuler la préparation

  ft-modal(v-model="isConfirmationOpen" @close="isConfirmationOpen = false")
    .flex.flex-col.items-center.gap-4.p-6
      h2.text-xl.font-bold.text-warning {{ confirmationTitle }}
      p.text-base.text-center {{ confirmationMessage }}
      .flex.justify-between.w-full.mt-6
        ft-button.button-outline(
          variant="outline"
          @click="isConfirmationOpen = false"
        ) Annuler
        ft-button.button-error(
          variant="error"
          @click="handleConfirm"
        ) Confirmer

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
  (e: 'validatePreparation'): void
  (e: 'cancelPreparation'): void
}>()

const isConfirmationOpen = ref(false)
const confirmationTitle = ref('')
const confirmationMessage = ref('')
const confirmAction = ref<null | (() => void)>(null)

function openConfirmation({
  title,
  message,
  action
}: {
  title: string
  message: string
  action: () => void
}) {
  confirmationTitle.value = title
  confirmationMessage.value = message
  confirmAction.value = action
  isConfirmationOpen.value = true
}

function handleConfirm() {
  isConfirmationOpen.value = false
  confirmAction.value?.()
  confirmAction.value = null
}

const isRemoveProductOpened = ref(false)

const openRemoveProduct = () => {
  isRemoveProductOpened.value = true
}

const removeProduct = (cip13: string) => {
  isRemoveProductOpened.value = false
  emit('removeProduct', cip13)
}

const productsReferences = computed(() => {
  return props.products.map((p: { reference: string }) => p.reference)
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

const validatePreparation = () => {
  openConfirmation({
    title: 'Valider la préparation',
    message:
      'Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?',
    action: () => emit('validatePreparation')
  })
}

const cancelPreparation = () => {
  openConfirmation({
    title: 'Annuler la préparation',
    message:
      'Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?',
    action: () => emit('cancelPreparation')
  })
}
</script>
