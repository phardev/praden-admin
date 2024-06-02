<template lang="pug">
.section
  h1.text-title Créer nouvelle catégorie
  category-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { createCategory } from '@core/usecases/categories/category-creation/createCategory'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { categoryFormCreateVM } from '@adapters/primary/view-models/categories/category-form/categoryFormCreateVM'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name
const vm = ref(categoryFormCreateVM(routeName))

const validate = async () => {
  await createCategory(vm.value.getDto(), useCategoryGateway())
  router.push('/categories/')
}
</script>
