<template lang="pug">
.section
  div.flex.items-center.align-center
    h1.text-page-title.flex-grow Catégories
    nuxt-link(to="/categories/new")
      ft-button.button-solid.text-xl.px-6 Créer catégorie
  ft-category-tree.mt-4(
    :is-loading="treeCategoriesVM.isLoading"
    :items="treeCategoriesVM.items"
    :show-status-toggle="true"
    @view="categorySelected"
    @toggle-status="toggleCategoryStatus"
  )
</template>

<script lang="ts" setup>
import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import type { CategoryStatus } from '@core/entities/category'
import { updateCategoryStatus } from '@core/usecases/categories/category-status-update/updateCategoryStatus'
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

const toggleCategoryStatus = async (
  uuid: string,
  currentStatus: CategoryStatus
) => {
  const newStatus: CategoryStatus =
    currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  await updateCategoryStatus(uuid, newStatus, useCategoryGateway())
}
</script>
