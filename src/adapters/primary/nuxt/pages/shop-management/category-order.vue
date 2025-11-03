<template lang="pug">
.category-order-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="handleBackClick"
    )

  UAlert.mb-4(
    v-if="!reorderVM.isLoading && reorderVM.hasChanges"
    color="amber"
    variant="subtle"
    icon="i-heroicons-exclamation-triangle"
    :title="$t('shopManagement.categoryOrder.unsavedChanges')"
    :description="$t('shopManagement.categoryOrder.unsavedChangesDescription')"
  )
    template(#actions)
      .flex.gap-3
        UButton(
          color="gray"
          variant="ghost"
          :label="$t('common.cancel')"
          @click="handleCancelClick"
        )
        UButton(
          color="primary"
          :label="$t('shopManagement.categoryOrder.save')"
          :loading="isSaving"
          @click="saveChanges"
        )

  UCard
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold {{ $t('shopManagement.categoryOrder.title') }}

    template(#default)
      div(v-if="categoryStore.isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else)
        p.text-gray-600.mb-6 {{ $t('shopManagement.categoryOrder.description') }}

        CategoryOrderTree(v-model="categoryTree")

  UModal(v-model="showCancelModal")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('shopManagement.categoryOrder.cancelChanges') }}
      template(#default)
        p.text-gray-600 {{ $t('shopManagement.categoryOrder.cancelChangesConfirm') }}
      template(#footer)
        .flex.justify-end.gap-3
          UButton(
            color="gray"
            variant="ghost"
            :label="$t('common.cancel')"
            @click="showCancelModal = false"
          )
          UButton(
            color="red"
            :label="$t('common.cancel')"
            @click="confirmCancel"
          )
</template>

<script lang="ts" setup>
import CategoryOrderTree from '@adapters/primary/nuxt/components/organisms/CategoryOrderTree.vue'
import { categoryReorderFormVM } from '@adapters/primary/view-models/categories/category-reorder-form/categoryReorderFormVM'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { reorderCategories } from '@core/usecases/categories-reorder/reorderCategories'
import { useCategoryStore } from '@store/categoryStore'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const categoryGateway = useCategoryGateway()
const categoryStore = useCategoryStore()

const reorderVM = ref(categoryReorderFormVM())
const showCancelModal = ref(false)
const isSaving = ref(false)

onMounted(async () => {
  await listCategories(categoryGateway)
  reorderVM.value = categoryReorderFormVM()
})

const categoryTree = computed({
  get: () => reorderVM.value.tree,
  set: (v) => reorderVM.value.updateTree(v)
})

const saveChanges = async () => {
  try {
    isSaving.value = true
    const orderedUuids = reorderVM.value.getOrderedUuids()
    await reorderCategories(orderedUuids, categoryGateway)

    const toast = useToast()
    toast.add({
      title: t('shopManagement.categoryOrder.reorderSuccess'),
      color: 'green'
    })

    navigateTo('/shop-management')
  } catch {
    const toast = useToast()
    toast.add({
      title: t('shopManagement.categoryOrder.reorderError'),
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}

const handleBackClick = () => {
  if (reorderVM.value.hasChanges) {
    if (confirm(t('shopManagement.categoryOrder.leavePageConfirm'))) {
      navigateTo('/shop-management')
    }
  } else {
    navigateTo('/shop-management')
  }
}

const handleCancelClick = () => {
  showCancelModal.value = true
}

const confirmCancel = () => {
  reorderVM.value.reset()
  showCancelModal.value = false
}

onBeforeRouteLeave((to, from, next) => {
  if (reorderVM.value.hasChanges) {
    if (confirm(t('shopManagement.categoryOrder.leavePageConfirm'))) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>

<style scoped>
.category-order-container {
  max-width: 800px;
  margin: 0 auto;
}

.category-item {
  transition: all 0.2s ease;
}

.category-item:hover {
  background-color: #f9fafb;
  transform: translateX(4px);
}
</style>
