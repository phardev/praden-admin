<template lang="pug">
.section
  div.flex.items-center.align-center
    h1.text-page-title.flex-grow Catégories
    nuxt-link(to="/categories/new")
      ft-button.button-solid.text-xl.px-6 Créer catégorie
  ft-category-tree.mt-4(
    :is-loading="treeCategoriesVM.isLoading"
    :items="treeCategoriesVM.items"
    @view="categorySelected"
    @toggle-status="handleToggleStatus"
  )
</template>

<script lang="ts" setup>
import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import { CategoryStatus } from '@core/entities/category'
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

const handleToggleStatus = async (uuid: string, currentStatus: string) => {
  const categoryGateway = useCategoryGateway()
  if (currentStatus === CategoryStatus.Active) {
    await disableCategory(uuid, categoryGateway)
  } else {
    await enableCategory(uuid, categoryGateway)
  }
}
</script>
