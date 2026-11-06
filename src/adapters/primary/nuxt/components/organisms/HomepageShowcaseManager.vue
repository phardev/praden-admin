<template lang="pug">
.space-y-6
  .space-y-3(v-if="showcaseVM.isLoading")
    USkeleton.h-24(v-for="n in 3" :key="n")

  .selected-products(v-else-if="showcaseVM.items.length > 0")
    .space-y-3
      draggable(
        :model-value="showcaseVM.items"
        item-key="uuid"
        handle=".product-item"
        @start="onDragStart"
        @end="onDragEnd"
      )
        template(#item="{ element }")
          HomepageShowcaseItem.mb-3(
            :item="element"
            :is-dragging="draggedUuid === element.uuid"
            @remove="showcaseVM.removeProduct(element.uuid)"
          )

  .text-center.py-16.bg-gray-50.rounded-lg.border-2.border-dashed.border-gray-200(v-else)
    icon.mx-auto.mb-4.text-gray-400(name="i-heroicons-shopping-bag" class="w-16 h-16" aria-hidden="true")
    h3.text-lg.font-semibold.text-gray-900.mb-2 {{ $t(`shopManagement.homepageShowcase.kinds.${kind}.emptyTitle`) }}
    p.text-gray-600.mb-6.max-w-md.mx-auto {{ $t(`shopManagement.homepageShowcase.kinds.${kind}.emptyDescription`) }}
    UButton(
      color="primary"
      icon="i-heroicons-plus"
      :label="$t(`shopManagement.homepageShowcase.kinds.${kind}.addFirstProduct`)"
      @click="isModalOpen = true"
    )

  ProductSearchModal(
    :model-value="isModalOpen"
    :namespace="showcaseVM.searchNamespace"
    :selected-product-uuids="showcaseVM.getProductUuids()"
    :promotions-filter="kind === ShowcaseKind.HomepagePromotions"
    @update:model-value="isModalOpen = $event"
    @product-added="onProductAdded"
  )
</template>

<script lang="ts" setup>
import HomepageShowcaseItem from '@adapters/primary/nuxt/components/molecules/HomepageShowcaseItem.vue'
import ProductSearchModal from '@adapters/primary/nuxt/components/organisms/ProductSearchModal.vue'
import type { homepageShowcaseFormVM } from '@adapters/primary/view-models/homepage-showcases/homepage-showcase-form/homepageShowcaseFormVM'
import { ShowcaseKind } from '@core/entities/homepageShowcase'
import draggable from 'vuedraggable'

const props = defineProps<{
  kind: ShowcaseKind
  showcaseVM: ReturnType<typeof homepageShowcaseFormVM>
}>()

const draggedUuid = ref<string | null>(null)
const isModalOpen = ref(false)

const onProductAdded = (productUuid: string) => {
  props.showcaseVM.addProduct(productUuid)
}

const onDragStart = (event: any) => {
  draggedUuid.value = props.showcaseVM.items[event.oldIndex]?.uuid || null
}

const onDragEnd = (event: any) => {
  draggedUuid.value = null
  props.showcaseVM.reorder(event.oldIndex, event.newIndex)
}

const openModal = () => {
  isModalOpen.value = true
}

defineExpose({
  isModalOpen,
  openModal
})
</script>
