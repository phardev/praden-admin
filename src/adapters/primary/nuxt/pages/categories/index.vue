<template lang="pug">
.section
  div.flex.items-center.align-center
    h1.text-page-title.flex-grow Catégories
    nuxt-link(to="/categories/new")
      ft-button.button-solid.text-xl.px-6 Créer catégorie
  ft-category-tree.mt-4(
    :is-loading="treeCategoriesVM.isLoading"
    :items="treeCategoriesVM.items"
    :toggleable="true"
    @view="categorySelected"
    @toggle-status="handleToggleStatus"
  )
</template>

<script lang="ts" setup>
import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import type { CategoryStatus } from '@core/entities/category'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { setCategoryStatus } from '@core/usecases/categories/set-category-status/setCategoryStatus'
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

const handleToggleStatus = async (uuid: string, enabled: boolean) => {
  const status: CategoryStatus = enabled ? 'ACTIVE' : 'INACTIVE'
  await setCategoryStatus(uuid, status, useCategoryGateway())
}
</script>
