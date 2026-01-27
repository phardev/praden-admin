<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer catégorie
  category-form(
    :vm="vm"
    @validate="validate"
    @toggle-status="handleToggleStatus"
  )
</template>

<script lang="ts" setup>
import { categoryFormEditVM } from '@adapters/primary/view-models/categories/category-form/categoryFormEditVM'
import type { CategoryStatus } from '@core/entities/category'
import { editCategory } from '@core/usecases/categories/category-edition/editCategory'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { listCategoryProducts } from '@core/usecases/categories/list-category-products/listCategoryProducts'
import { setCategoryStatus } from '@core/usecases/categories/set-category-status/setCategoryStatus'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../../gateways/productGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const categoryUuid = String(route.params.uuid)
const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')

onMounted(async () => {
  const categoryGateway = useCategoryGateway()
  const productGateway = useProductGateway()
  await getCategory(categoryUuid, categoryGateway)
  await listCategoryProducts(25, 0, categoryUuid, productGateway)
  vm.value = categoryFormEditVM(routeName)
})

const validate = async () => {
  await editCategory(
    categoryUuid,
    vm.value.getDto(),
    useCategoryGateway(),
    useProductGateway()
  )
  router.push('/categories/')
}

const handleToggleStatus = async (enabled: boolean) => {
  const status: CategoryStatus = enabled ? 'ACTIVE' : 'INACTIVE'
  await setCategoryStatus(categoryUuid, status, useCategoryGateway())
}
</script>
