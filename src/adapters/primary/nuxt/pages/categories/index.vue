<template lang="pug">
.section
  div.flex.items-center.align-center
    h1.text-page-title.flex-grow Catégories
    nuxt-link(to="/categories/new")
      ft-button.button-solid.text-xl.px-6 Créer catégorie
  ft-category-tree.mt-4(
    :is-loading="treeCategoriesVM.isLoading"
    :items="treeCategoriesVM.items"
    :show-toggle="true"
    @view="categorySelected"
    @toggle-status="onToggleStatus"
  )
  u-modal(v-model="showCascadeModal")
    u-card
      template(#header)
        h3.text-lg.font-semibold {{ $t('category.toggle.cascadeTitle') }}
      p {{ $t('category.toggle.cascadeMessage') }}
      template(#footer)
        div.flex.justify-end.space-x-2
          u-button(
            color="gray"
            variant="soft"
            @click="toggleWithoutCascade"
          ) {{ $t('category.toggle.onlyThis') }}
          u-button(
            color="primary"
            @click="toggleWithCascade"
          ) {{ $t('category.toggle.includeChildren') }}
</template>

<script lang="ts" setup>
import { getTreeCategoriesVM } from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { toggleCategoryStatus } from '@core/usecases/categories/toggle-category-status/toggleCategoryStatus'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'

definePageMeta({ layout: 'main' })

const showCascadeModal = ref(false)
const pendingToggleUuid = ref<string | null>(null)

onMounted(() => {
  listCategories(useCategoryGateway())
})

const treeCategoriesVM = computed(() => {
  return getTreeCategoriesVM()
})

const categorySelected = (uuid: string) => {
  const router = useRouter()
  router.push(`/categories/get/${uuid}`)
}

const onToggleStatus = async (uuid: string, hasChildren: boolean) => {
  if (hasChildren) {
    pendingToggleUuid.value = uuid
    showCascadeModal.value = true
  } else {
    await toggleCategoryStatus(uuid, false, useCategoryGateway())
  }
}

const toggleWithoutCascade = async () => {
  if (pendingToggleUuid.value) {
    await toggleCategoryStatus(
      pendingToggleUuid.value,
      false,
      useCategoryGateway()
    )
    showCascadeModal.value = false
    pendingToggleUuid.value = null
  }
}

const toggleWithCascade = async () => {
  if (pendingToggleUuid.value) {
    await toggleCategoryStatus(
      pendingToggleUuid.value,
      true,
      useCategoryGateway()
    )
    showCascadeModal.value = false
    pendingToggleUuid.value = null
  }
}
</script>
