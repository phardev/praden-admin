<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/categories/new")
      ft-button.button-solid.text-xl.px-6 Créer catégorie
  ft-table(
    :headers="categoriesVM.headers"
    :items="categoriesVM.items"
  )
    template(#title) Catégories
    template(#name="{ item }")
      .font-medium.text-default {{ item.name }}
</template>

<script lang="ts" setup>
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { getCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getCategoriesVM'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCategories(useCategoryGateway())
})

const categoriesVM = computed(() => {
  return getCategoriesVM()
})
</script>
