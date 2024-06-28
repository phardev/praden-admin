<template lang="pug">
.section
  div.flex.items-center.align-center
    h1.text-page-title.flex-grow Catégories
    nuxt-link(to="/categories/new")
      ft-button.button-solid.text-xl.px-6 Créer catégorie

  div.flex.flex-row-reverse.mt-4
    ft-view-switcher(
      :current-view="currentView"
      :options="viewOptions"
      @switch-view="switchView"
    )
  //  div.flex.items-center.align-center.border.border-primary6(@click="toggleView")
  //    icon.icon-xl.border.border-2.border-primary6(name="material-symbols:data-table-outline-sharp")
  //    icon.icon-xl.border.border-2.border-light(name="ph:tree-view")
  FtTree(
    v-if="currentView === 'tree'"
    :tree="treeCategoriesVM"
  )
  ft-table(
    v-if="currentView === 'table'"
    :headers="categoriesVM.headers"
    :items="categoriesVM.items"
    @clicked="categorySelected"
  )
    template(#name="{ item }")
      .font-medium.text-default {{ item.name }}
</template>

<script lang="ts" setup>
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { getCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getCategoriesVM'
import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import FtTree from '@adapters/primary/nuxt/components/molecules/FtTree.vue'

definePageMeta({ layout: 'main' })

const viewOptions = [
  {
    name: 'table',
    icon: 'material-symbols:data-table-outline-sharp'
  },
  {
    name: 'tree',
    icon: 'ph:tree-view'
  }
]

const currentView = ref(viewOptions[0].name)

onMounted(() => {
  listCategories(useCategoryGateway())
})

const categoriesVM = computed(() => {
  return getCategoriesVM()
})

const treeCategoriesVM = computed(() => {
  return getTreeCategoriesVM()
})

const categorySelected = (uuid: string) => {
  const router = useRouter()
  router.push(`/categories/get/${uuid}`)
}

const switchView = (viewName: string) => {
  currentView.value = viewName
}
</script>
