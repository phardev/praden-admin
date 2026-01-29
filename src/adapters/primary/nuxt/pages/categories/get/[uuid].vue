<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer catégorie
  h1.text-title Voir catégorie
  .flex.items-center.gap-2.mb-4
    span.text-sm.font-medium {{ $t('common.status') }}:
    UBadge.uppercase.py-1.px-3(
      :color="categoryStatus === 'ACTIVE' ? 'green' : 'gray'"
      :ui="{ rounded: 'rounded-full' }"
    ) {{ categoryStatus === 'ACTIVE' ? $t('common.active') : $t('common.inactive') }}
  category-form(
    :vm="vm"
  )
</template>

<script lang="ts" setup>
import { categoryFormGetVM } from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { listCategoryProducts } from '@core/usecases/categories/list-category-products/listCategoryProducts'
import { useCategoryStore } from '@store/categoryStore'
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

const categoryStore = useCategoryStore()

const categoryStatus = computed(() => {
  return categoryStore.current?.category?.status || 'ACTIVE'
})

const edit = () => {
  router.push(`/categories/edit/${categoryUuid}`)
}
</script>
