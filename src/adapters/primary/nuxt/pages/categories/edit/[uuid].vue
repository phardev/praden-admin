<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer catégorie
  category-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { editCategory } from '@core/usecases/categories/category-edition/editCategory'
import { categoryFormEditVM } from '@adapters/primary/view-models/categories/category-form/categoryFormEditVM'
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { listCategoryProducts } from '@core/usecases/categories/list-category-products/listCategoryProducts'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const categoryUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

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
</script>
