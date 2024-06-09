<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer catégorie
  category-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { editCategory } from '@core/usecases/categories/category-edition/editCategory'
import { categoryFormEditVM } from '@adapters/primary/view-models/categories/category-form/categoryFormEditVM'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const categoryUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  const categoryGateway = useCategoryGateway()
  listCategories(categoryGateway)
  await getCategory(categoryUuid, categoryGateway)
  vm.value = categoryFormEditVM(routeName)
})

const validate = async () => {
  await editCategory(categoryUuid, vm.value.getDto(), useCategoryGateway())
  router.push('/categories/')
}
</script>
