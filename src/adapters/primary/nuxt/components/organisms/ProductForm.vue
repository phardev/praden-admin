<template lang="pug">
div(v-if="!currentVM || currentVM.isLoading()")
  .space-y-6
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-32.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-24.w-24.bg-gray-200.rounded.animate-pulse.mb-4
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-48.w-48.bg-gray-200.rounded.animate-pulse.mb-4
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .flex.gap-6.mt-4
      .flex-1
        .h-4.bg-gray-200.rounded.animate-pulse.mb-4(class='w-1/4')
        .space-y-2
          .h-10.bg-gray-200.rounded.animate-pulse
          .h-10.bg-gray-200.rounded.animate-pulse
          .h-10.bg-gray-200.rounded.animate-pulse
    .flex.flex-row-reverse.mt-4
      .h-12.w-32.bg-gray-200.rounded.animate-pulse
UForm(v-else)
  UAccordion(
    multiple
    size="xl"
    :items="items"
  )
    template(#informations)
      UFormGroup.pb-4(label="Statut" name="status")
        UToggle(
          size="xl"
          on-icon="i-heroicons-check-20-solid"
          off-icon="i-heroicons-x-mark-20-solid"
          :model-value="currentVM.get('isActive').value"
          :disabled="!currentVM.get('isActive').canEdit"
          @click="toggleIsActive"
        )
      UFormGroup.pb-4(label="Autoriser les promotions" name="arePromotionsAllowed")
        UToggle(
          size="xl"
          :model-value="currentVM.get('arePromotionsAllowed').value"
          :disabled="!currentVM.get('arePromotionsAllowed').canEdit"
          @update:model-value="val => currentVM.set('arePromotionsAllowed', val)"
        )
      UFormGroup.pb-4(label="Nom" name="name")
        ft-text-field(
          :model-value="currentVM.get('name').value"
          :disabled="!currentVM.get('name').canEdit"
          @update:model-value="nameChanged"
        )
      UFormGroup.pb-4(label="Catégories" name="categories")
        ft-category-tree.mt-4(
          :items="treeCategoriesVM.items"
          :disabled="!currentVM.get('categoryUuids').canEdit"
          :selectable="true"
          :selection="currentVM.get('categoryUuids').value"
          @view="viewCategory"
          @selected="categorySelected"
        )
      UFormGroup.pb-4(label="CIP7" name="cip7")
        ft-text-field(
          :model-value="currentVM.get('cip7').value"
          :disabled="!currentVM.get('cip7').canEdit"
          @update:model-value="cip7Changed"
        )
      UFormGroup.pb-4(label="Médicament" name="isMedicine")
        UToggle(
          size="xl"
          :model-value="currentVM.get('isMedicine').value"
          :disabled="true"
        )
      UFormGroup.pb-4(label="CIP13" name="cip13")
        ft-text-field(
          :model-value="currentVM.get('cip13').value"
          :disabled="!currentVM.get('cip13').canEdit"
          @update:model-value="cip13Changed"
        )
      UFormGroup.pb-4(label="EAN13" name="ean13")
        ft-text-field(
          :model-value="currentVM.get('ean13').value"
          :disabled="!currentVM.get('ean13').canEdit"
          @update:model-value="ean13Changed"
        )
      UFormGroup.pb-4(label="Laboratoire" name="laboratory")
        ft-autocomplete(
          :model-value="currentVM.get('laboratory').value"
          :disabled="!currentVM.get('laboratory').canEdit"
          :options="currentVM.getAvailableLaboratories()"
          placeholder="Rechercher un laboratoire"
          by="uuid"
          option-attribute="name"
          value-attribute="uuid"
          @update:model-value="laboratoryChanged"
          @clear="clearLaboratory"
        )
          template(#option="{ option: laboratory }")
            span {{ laboratory.name }}
      UFormGroup.pb-4(label="Poids (kg)" name="weight")
        ft-text-field(
          :model-value="currentVM.get('weight').value"
          :disabled="!currentVM.get('weight').canEdit"
          label="Poids (kg)"
          @update:model-value="weightChanged"
        )
      UFormGroup.pb-4(label="Miniature" name="miniature")
        img.mb-4(
          v-if="currentVM.get('miniature').value"
          height=200 width=200
          :src="currentVM.get('miniature').value"
          alt="miniature"
        )
        ft-file-input(
          v-if="currentVM.get('miniature').canEdit"
          accept="image/*"
          @input="miniatureChanged"
        )
      UFormGroup.pb-4(label="Images" name="images")
        draggable.flex.items-center.gap-4(
          v-if="currentVM.getProductImagesForDisplay"
          :model-value="productImagesDisplay"
          :disabled="!canEditImages"
          item-key="id"
          @change="onImageReorder"
        )
          template(#item="{ element, index }")
            div.relative.group.cursor-grab
              img.mb-4(:src="element.url" height=200 width=200 alt="Selected Image")
              button(
                v-if="canEditImages"
                type="button"
                class="absolute top-0 right-0 rounded-full flex items-center justify-center text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                @click="removeImageById(element.id)"
              )
                icon.icon-xl.text-error(name="material-symbols:cancel")
              div(
                v-if="canEditImages"
                class="absolute inset-0 border-2 border-tomato9 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              )
        ft-file-input(
          v-if="canEditImages"
          accept="image/*"
          multiple
          @input="imagesChanged"
        )
    template(#price)
      div.flex.gap-8.items-center
        div.grow
          UFormGroup.pb-4(label="Prix (HT)" name="priceWithoutTax")
            ft-currency-input(
              v-model.lazy="currentVM.get('priceWithoutTax').value"
              :disabled="!currentVM.get('priceWithoutTax').canEdit"
              label="Prix (HT)"
              @update:model-value="priceWithoutTaxChanged"
            )
          UFormGroup.pb-4(label="Taxe (%)" name="percentTaxRate")
            ft-percentage-input(
              :model-value="currentVM.get('percentTaxRate').value"
              :disabled="!currentVM.get('percentTaxRate').canEdit"
              label="Taxe (%)"
              @update:model-value="percentTaxRateChanged"
            )
          UFormGroup.pb-4(label="Prix (TTC)" name="priceWithTax")
            ft-currency-input(
              v-model.lazy="currentVM.get('priceWithTax').value"
              :disabled="!currentVM.get('priceWithTax').canEdit"
              label="Prix (HT)"
              @update:model-value="priceWithTaxChanged"
            )
        div.flex.flex-col.gap-4.border.border-2.border-default.p-4(v-if="currentVM.getPromotion()")
          p.text-2xl Promotion en cours
          div {{ currentVM.getPromotion().amount }}
          div.flex.gap-4
            div(v-if="currentVM.getPromotion().startDatetime")
              div Date de début
              time(:datetime='currentVM.getPromotion().startDatetime') {{ currentVM.getPromotion().startDate }}
            div(v-if="currentVM.getPromotion().endDatetime")
              div Date de fin
              time(:datetime='currentVM.getPromotion().endDatetime') {{ currentVM.getPromotion().endDate }}
          div.flex.justify-center.items-center
            icon.icon-md(name="material-symbols:arrow-circle-right-outline-rounded")
            nuxt-link.text-xl.text-link(:href="currentVM.getPromotion().href") Voir la promotion

    template(#stock)
      UFormGroup.pb-4(
        v-for="location in currentVM.getAvailableLocations()"
        :key="location.uuid"
        :label="location.name"
      )
        ft-text-field(
          :model-value="currentVM.get('locations').value[location.uuid]"
          :disabled="!currentVM.get('locations').canEdit"
          @update:model-value="(newValue) => locationChanged(location.uuid, newValue)"
        )
      UFormGroup.pb-4(label="Stock disponible" name="availableStock")
        ft-text-field(
          :model-value="currentVM.get('availableStock').value"
          :disabled="!currentVM.get('availableStock').canEdit"
          type="number"
          @update:model-value="availableStockChanged"
        )
      UFormGroup.pb-4(label="Stock minimum pour vendre en ligne" name="minStockToSell")
        ft-text-field(
          :model-value="currentVM.get('minStockToSell').value"
          :disabled="!currentVM.get('minStockToSell').canEdit"
          type="number"
          @update:model-value="minStockToSellChanged"
        )
      UFormGroup.pb-4(label="Mode de gestion du stock" name="stockManagementMode")
        USelectMenu(
          :model-value="currentVM.get('stockManagementMode').value"
          :disabled="!currentVM.get('stockManagementMode').canEdit"
          :options="stockManagementModeOptions"
          value-attribute="value"
          option-attribute="label"
          @update:model-value="stockManagementModeChanged"
        )
      UFormGroup.pb-4(label="Quantité limite pour une commande" name="maxQuantityForOrder")
        ft-text-field(
          :model-value="currentVM.get('maxQuantityForOrder').value"
          :disabled="!currentVM.get('maxQuantityForOrder').canEdit"
          type="number"
          @update:model-value="maxQuantityForOrderChanged"
        )
    template(#details)
      UFormGroup.pb-4(label="Description" name="description")
        FtRichTextInput(
          :model-value="currentVM.get('description').value"
          :disabled="!currentVM.get('description').canEdit"
          @update:model-value="descriptionChanged"
        )
      UFormGroup.pb-4(label="Instructions" name="instructions")
        FtRichTextInput(
          :model-value="currentVM.get('instructionsForUse').value"
          :disabled="!currentVM.get('instructionsForUse').canEdit"
          @update:model-value="instructionsChanged"
        )
      UFormGroup.pb-4(label="Composition" name="composition")
        FtRichTextInput(
          :model-value="currentVM.get('composition').value"
          :disabled="!currentVM.get('composition').canEdit"
          @update:model-value="compositionChanged"
        )
  div.flex.flex-row-reverse.mt-4
    ft-button.px-6.text-xl(
      v-if="currentVM.getDisplayValidate()"
      :disabled="!currentVM.getCanValidate()"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
import FtButton from '@adapters/primary/nuxt/components/atoms/FtButton.vue'
import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import { listLaboratories } from '@core/usecases/laboratories/laboratory-listing/listLaboratories'
import { listLocations } from '@core/usecases/locations/location-listing/listLocations'
import draggable from 'vuedraggable'
import { useLaboratoryGateway } from '../../../../../../gateways/laboratoryGateway'
import { useLocationGateway } from '../../../../../../gateways/locationGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listLocations(useLocationGateway())
  listLaboratories(useLaboratoryGateway())
})

const items = [
  {
    label: '1. Informations produit',
    defaultOpen: true,
    slot: 'informations'
  },
  {
    label: '2. Prix',
    defaultOpen: true,
    slot: 'price'
  },
  {
    label: '3. Stock',
    defaultOpen: true,
    slot: 'stock'
  },
  {
    label: '4. Détails',
    defaultOpen: true,
    slot: 'details'
  }
]

const props = defineProps({
  vm: {
    type: Object,
    default() {
      return undefined
    }
  }
})

const treeCategoriesVM = computed(() => {
  return getTreeCategoriesVM()
})

const currentVM = toRef(props, 'vm')

const productImagesDisplay = computed(() => {
  return currentVM.value?.getProductImagesForDisplay?.() || []
})

const canEditImages = computed(() => {
  return currentVM.value?.get?.('productImages')?.canEdit ?? false
})

const stockManagementModeOptions = [
  { value: 'WINPHARMA', label: 'Winpharma' },
  { value: 'MANUAL', label: 'Manuel' }
]

const nameChanged = (name: string) => {
  currentVM?.value?.set('name', name)
}

const cip7Changed = (cip7: string) => {
  currentVM?.value?.set('cip7', cip7)
}

const cip13Changed = (cip13: string) => {
  currentVM?.value?.set('cip13', cip13)
}

const ean13Changed = (ean13: string) => {
  currentVM?.value?.set('ean13', ean13)
}

const priceWithoutTaxChanged = (priceWithoutTax: number) => {
  if (currentVM?.value?.get('priceWithoutTax').canEdit)
    currentVM?.value?.set('priceWithoutTax', priceWithoutTax)
}

const percentTaxRateChanged = (percentTaxRate: number) => {
  currentVM?.value?.set('percentTaxRate', percentTaxRate)
}

const priceWithTaxChanged = (priceWithTax: number) => {
  if (currentVM?.value?.get('priceWithTax').canEdit)
    currentVM?.value?.set('priceWithTax', priceWithTax)
}

const laboratoryChanged = (laboratory: string) => {
  currentVM?.value?.set('laboratory', laboratory)
}

const clearLaboratory = () => {
  currentVM?.value?.set('laboratory', undefined)
}

const weightChanged = (weight: string) => {
  currentVM?.value?.set('weight', weight)
}

const miniatureChanged = async (value: any) => {
  await currentVM?.value?.set('miniature', value[0])
}

const imagesChanged = async (value: FileList) => {
  await currentVM?.value?.addImages?.(Array.from(value))
}

const removeImageById = (imageId: string) => {
  currentVM?.value?.removeImageById?.(imageId)
}

const onImageReorder = (event: {
  moved?: { oldIndex: number; newIndex: number }
}) => {
  if (event.moved) {
    currentVM?.value?.reorderImages?.(
      event.moved.oldIndex,
      event.moved.newIndex
    )
  }
}

const categorySelected = (uuid: string) => {
  currentVM?.value?.toggleCategory(uuid)
}

const locationChanged = (uuid: string, value: string) => {
  currentVM?.value?.set('locations', { uuid, value })
}

const availableStockChanged = (availableStock: string) => {
  currentVM?.value?.set('availableStock', availableStock)
}

const minStockToSellChanged = (minStockToSell: string) => {
  currentVM?.value?.set('minStockToSell', minStockToSell)
}

const stockManagementModeChanged = (stockManagementMode: string) => {
  currentVM?.value?.set('stockManagementMode', stockManagementMode)
}

const maxQuantityForOrderChanged = (maxQuantityForOrder: string) => {
  currentVM?.value?.set('maxQuantityForOrder', maxQuantityForOrder)
}

const descriptionChanged = (description: string) => {
  currentVM?.value?.set('description', description)
}

const instructionsChanged = (instructions: string) => {
  currentVM?.value?.set('instructionsForUse', instructions)
}

const compositionChanged = (composition: string) => {
  currentVM?.value?.set('composition', composition)
}

const toggleIsActive = () => {
  currentVM?.value?.toggleIsActive()
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
