<template lang="pug">
.section
  h1.text-title Créer nouvelle catégorie
  category-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { categoryFormCreateVM } from '@adapters/primary/view-models/categories/category-form/categoryFormCreateVM'
import { createCategory } from '@core/usecases/categories/category-creation/createCategory'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../gateways/productGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = String(router.currentRoute.value.name)
const vm = ref(categoryFormCreateVM(routeName))

const validate = async () => {
  await createCategory(
    vm.value.getDto(),
    useCategoryGateway(),
    useProductGateway()
  )
  router.push('/categories/')
}
</script>
