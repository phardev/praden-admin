<template lang="pug">
.space-y-6
  .selected-products(v-if="selectionVM.selectedProducts.length > 0")
    .space-y-3
      draggable(
        :model-value="selectionVM.selectedProducts"
        item-key="uuid"
        handle=".product-item"
        @start="onDragStart"
        @end="onDragEnd"
      )
        template(#item="{ element }")
          PharmacistSelectionItem(
            :product="element"
            :is-dragging="draggedUuid === element.uuid"
            @remove="onProductRemoved(element.uuid)"
          )

  .text-center.py-16.bg-gray-50.rounded-lg.border-2.border-dashed.border-gray-200(v-else)
    icon.mx-auto.mb-4.text-gray-400(name="i-heroicons-shopping-bag" class="w-16 h-16")
    h3.text-lg.font-semibold.text-gray-900.mb-2 {{ $t('shopManagement.pharmacistSelection.emptyTitle') }}
    p.text-gray-600.mb-6.max-w-md.mx-auto {{ $t('shopManagement.pharmacistSelection.emptyDescription') }}
    UButton(
      color="primary"
      icon="i-heroicons-plus"
      :label="$t('shopManagement.pharmacistSelection.addFirstProduct')"
      @click="isModalOpen = true"
    )

  ProductSearchModal(
    :model-value="isModalOpen"
    :selected-product-uuids="selectionVM.selectedProducts.map(p => p.uuid)"
    @update:model-value="isModalOpen = $event"
    @product-added="onProductAdded"
  )
</template>

<script lang="ts" setup>
import PharmacistSelectionItem from '@adapters/primary/nuxt/components/molecules/PharmacistSelectionItem.vue'
import ProductSearchModal from '@adapters/primary/nuxt/components/organisms/ProductSearchModal.vue'
import type { pharmacistSelectionFormVM } from '@adapters/primary/view-models/pharmacist-selection/pharmacist-selection-form/pharmacistSelectionFormVM'
import draggable from 'vuedraggable'

const props = defineProps<{
  selectionVM: ReturnType<typeof pharmacistSelectionFormVM>
}>()

const draggedUuid = ref<string | null>(null)
const isModalOpen = ref(false)

const onProductAdded = (productUuid: string) => {
  props.selectionVM.addProduct(productUuid)
  isModalOpen.value = false
}

const onDragStart = (event: any) => {
  draggedUuid.value =
    props.selectionVM.selectedProducts[event.oldIndex]?.uuid || null
}

const onDragEnd = (event: any) => {
  draggedUuid.value = null
  props.selectionVM.reorder(event.oldIndex, event.newIndex)
}

const onProductRemoved = (productUuid: string) => {
  props.selectionVM.removeProduct(productUuid)
}

const openModal = () => {
  isModalOpen.value = true
}

defineExpose({
  isModalOpen,
  openModal
})
</script>
