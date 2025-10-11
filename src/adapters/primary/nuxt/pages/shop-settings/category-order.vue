<template lang="pug">
.category-order-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-settings')"
    )

  UCard
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold {{ $t('shopSettings.categoryOrder.title') }}
        UButton(
          v-if="reorderVM.hasChanges"
          color="primary"
          :label="$t('common.update')"
          :loading="isSaving"
          @click="saveOrder"
        )

    template(#default)
      div(v-if="reorderVM.isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else)
        p.text-gray-600.mb-6 {{ $t('shopSettings.categoryOrder.description') }}

        CategoryOrderList(
          :categories="reorderVM.sortedCategories"
          @reorder="reorderVM.reorder"
        )
</template>

<script lang="ts" setup>
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { reorderCategories } from '@core/usecases/categories-reorder/reorderCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { categoryReorderVM } from '@adapters/primary/view-models/categories/category-reorder/categoryReorderVM'
import CategoryOrderList from '@adapters/primary/nuxt/components/organisms/CategoryOrderList.vue'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const isSaving = ref(false)
const categoryGateway = useCategoryGateway()

onMounted(async () => {
  await listCategories(categoryGateway)
})

const reorderVM = computed(() => categoryReorderVM())

const saveOrder = async () => {
  isSaving.value = true

  try {
    await reorderCategories(reorderVM.value.getCategoryUuids(), categoryGateway)

    const toast = useToast()
    toast.add({
      title: t('shopSettings.categoryOrder.reorderSuccess'),
      color: 'green'
    })

    navigateTo('/shop-settings')
  } catch {
    const toast = useToast()
    toast.add({
      title: t('shopSettings.categoryOrder.reorderError'),
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}
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
