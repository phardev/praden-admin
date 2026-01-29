<template lang="pug">
.section
  div.flex.items-center.align-center
    h1.text-page-title.flex-grow Catégories
    nuxt-link(to="/categories/new")
      ft-button.button-solid.text-xl.px-6 Créer catégorie
  ft-category-tree.mt-4(
    :is-loading="treeCategoriesVM.isLoading"
    :items="treeCategoriesVM.items"
    :show-toggle="true"
    @view="categorySelected"
    @enable="onEnableCategory"
    @disable="onDisableCategory"
  )
</template>

<script lang="ts" setup>
import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import { disableCategory } from '@core/usecases/categories/disable-category/disableCategory'
import { enableCategory } from '@core/usecases/categories/enable-category/enableCategory'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCategories(useCategoryGateway())
})

const treeCategoriesVM = computed(() => {
  return getTreeCategoriesVM()
})

const categorySelected = (uuid: string) => {
  const router = useRouter()
  router.push(`/categories/get/${uuid}`)
}

const onEnableCategory = async (uuid: string) => {
  await enableCategory(uuid, useCategoryGateway())
}

const onDisableCategory = async (uuid: string) => {
  await disableCategory(uuid, useCategoryGateway())
}
</script>
