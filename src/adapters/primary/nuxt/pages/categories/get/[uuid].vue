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
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { getCategory } from '@core/usecases/categories/get-category/getCategory'
import { categoryFormGetVM } from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'

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
  vm.value = categoryFormGetVM(routeName)
})

const edit = () => {
  router.push(`/categories/edit/${categoryUuid}`)
}
</script>
