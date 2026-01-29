<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse.items-center.gap-4
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer catégorie
    span.px-3.py-1.rounded-full.text-sm.font-medium(
      :class="vm.get('status').value === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
    ) {{ vm.get('status').value === 'ACTIVE' ? 'Actif' : 'Inactif' }}
  h1.text-title Voir catégorie
  category-form(
    :vm="vm"
  )
</template>

<script lang="ts" setup>
import { categoryFormGetVM } from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { listCategoryProducts } from '@core/usecases/categories/list-category-products/listCategoryProducts'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../../gateways/productGateway'

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
