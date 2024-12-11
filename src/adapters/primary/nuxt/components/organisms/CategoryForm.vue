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
      .flex.flex-col.justify-center.gap-6.mt-20
        .h-10.w-10.bg-gray-200.rounded-full.animate-pulse
        .h-10.w-10.bg-gray-200.rounded-full.animate-pulse
      .flex-1
        .h-4.bg-gray-200.rounded.animate-pulse.mb-4(class='w-1/4')
        .space-y-2
          .h-10.bg-gray-200.rounded.animate-pulse
          .h-10.bg-gray-200.rounded.animate-pulse
          .h-10.bg-gray-200.rounded.animate-pulse
    .flex.flex-row-reverse.mt-4
      .h-12.w-32.bg-gray-200.rounded.animate-pulse
form(v-else)
  UFormGroup.pb-4(label="Nom" name="name")
    ft-text-field(
      :model-value="currentVM.get('name').value"
      :disabled="!currentVM.get('name').canEdit"
      @update:model-value="nameChanged"
    )
  UFormGroup.pb-4(label="Description" name="description")
    FtRichTextInput(
      :model-value="currentVM.get('description').value"
      :disabled="!currentVM.get('description').canEdit"
      @update:model-value="descriptionChanged"
    )
  UFormGroup.pb-4(label="Catégorie parent" name="category")
    ft-autocomplete(
      :model-value="currentVM.get('parentUuid').value"
      :disabled="!currentVM.get('parentUuid').canEdit"
      :options="currentVM.getAvailableCategories()"
      placeholder="Rechercher une catégorie"
      by="id"
      option-attribute="name"
      value-attribute="uuid"
      @update:model-value="parentCategoryChanged"
      @clear="clearParentCategory"
    )
      template(#option="{ option: category }")
        span {{ category.name }}
  UFormGroup.pb-4(label="Miniature" name="miniature")
    img.mb-4(
      v-if="currentVM.get('miniature').value"
      :src="currentVM.get('miniature').value"
      alt="miniature"
    )
    ft-file-input(
      v-if="currentVM.get('miniature').canEdit"
      accept="image/*"
      @input="miniatureChanged"
    )
  UFormGroup.pb-4(label="Image" name="image")
    img.mb-4(
      v-if="currentVM.get('image').value"
      :src="currentVM.get('image').value"
      height=200
      width=200
      alt="image"
    )
    ft-file-input(
      v-if="currentVM.get('image').canEdit"
      accept="image/*"
      @input="imageChanged"
    )
  ft-text-field(
    v-if="currentVM.get('products').canEdit"
    v-model="search"
    placeholder="Rechercher par nom, référence, catégorie, laboratoire"
    for="search"
    type='text'
    name='search'
    @input="searchChanged"
  ) Rechercher un produit
  div.flex.gap-6.mt-4
    div.flex-1(
      v-if="currentVM.get('products').canEdit"
    )
      product-table(
        :headers="currentVM.getAvailableProductsHeaders()"
        :items="currentVM.getAvailableProducts().value"
        :selectable="true"
        :selection="availableProductSelector.get()"
        :is-loading="currentVM.isLoading()"
        @item-selected="availableProductSelector.toggleSelect"
        @select-all="availableProductSelector.toggleSelectAll"
      )
        template(#title) Tous les produits
    div.flex.flex-col.justify-center.gap-6.mt-20(
      v-if="currentVM.get('products').canEdit"
    )
      ft-button.button-solid(
        @click="addProducts"
      )
        icon.icon-lg(name="ic:baseline-keyboard-arrow-right")
      ft-button.button-default(
        @click="removeProducts"
      )
        icon.icon-lg.rotate-180(name="ic:baseline-keyboard-arrow-right")
    div.flex-1
      product-table(
        :headers="currentVM.getProductsHeaders()"
        :items="currentVM.getProducts().value"
        :selectable="currentVM.get('products').canEdit"
        :selection="addedProductSelector.get()"
        :is-loading="currentVM.isLoading()"
        @item-selected="addedProductSelector.toggleSelect"
        @select-all="addedProductSelector.toggleSelectAll"
      )
        template(#title) Produits de la catégorie
  div.flex.flex-row-reverse.mt-4
    ft-button.px-6.text-xl(
      v-if="currentVM.getDisplayValidate()"
      :disabled="!currentVM.getCanValidate()"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
import { useSelection } from '@adapters/primary/nuxt/composables/useSelection'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

definePageMeta({ layout: 'main' })

const props = defineProps({
  vm: {
    type: Object,
    default() {
      return undefined
    }
  }
})

const currentVM = toRef(props, 'vm')
const router = useRouter()
const routeName = router.currentRoute.value.name
const availableProductSelector = useSelection()
const addedProductSelector = useSelection()
const search = ref('')

const nameChanged = (name: string) => {
  currentVM?.value?.set('name', name)
}

const parentCategoryChanged = (uuid: string) => {
  currentVM?.value?.set('parentUuid', uuid)
}

const clearParentCategory = () => {
  currentVM?.value?.set('parentUuid', undefined)
}

const descriptionChanged = (description: string) => {
  currentVM?.value?.set('description', description)
}

let debounceTimer
const minimumQueryLength = 3

const searchChanged = (e: any) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const filters = {
      query: e.target.value,
      minimumQueryLength
    }
    searchProducts(routeName, filters, useSearchGateway())
  }, 300)
}

const addProducts = () => {
  currentVM.value.addProducts(availableProductSelector.get())
  availableProductSelector.clear()
}

const removeProducts = () => {
  currentVM.value.removeProducts(addedProductSelector.get())
  addedProductSelector.clear()
}

const miniatureChanged = async (value: any) => {
  await currentVM?.value?.set('miniature', value[0])
}

const imageChanged = async (value: any) => {
  await currentVM?.value?.set('image', value[0])
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
