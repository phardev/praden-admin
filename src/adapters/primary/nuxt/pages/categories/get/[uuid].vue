<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer catégorie
  h1.text-title Voir catégorie
  category-form(
    :vm="vm"
  )
</template>

<script lang="ts" setup>
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { categoryFormGetVM } from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { listCategoryProducts } from '@core/usecases/categories/list-category-products/listCategoryProducts'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const categoryUuid = route.params.uuid as string
const router = useRouter()
const routeName = router.currentRoute.value.name as string

onMounted(async () => {
  const categoryGateway = useCategoryGateway()
  const productGateway = useProductGateway()
  await getCategory(categoryUuid, categoryGateway)
  await listCategoryProducts(25, 0, categoryUuid, productGateway)
  vm.value = categoryFormGetVM(routeName)
})

const edit = () => {
  router.push(`/categories/edit/${categoryUuid}`)
}
</script>
