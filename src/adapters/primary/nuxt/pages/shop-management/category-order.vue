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

    template(#default)
      div(v-if="categoryStore.isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else)
        p.text-gray-600.mb-6 {{ $t('shopSettings.categoryOrder.description') }}

        CategoryOrderList(v-model="categories")
</template>

<script lang="ts" setup>
import CategoryOrderList from '@adapters/primary/nuxt/components/organisms/CategoryOrderList.vue'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { reorderCategories } from '@core/usecases/categories-reorder/reorderCategories'
import { useCategoryStore } from '@store/categoryStore'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const categoryGateway = useCategoryGateway()
const categoryStore = useCategoryStore()

onMounted(async () => {
  await listCategories(categoryGateway)
})

const allCategories = ref([])

watch(
  () => categoryStore.items,
  () => {
    allCategories.value = [...categoryStore.items].sort(
      (a, b) => a.order - b.order
    )
  },
  { immediate: true }
)

const categories = computed({
  get: () => allCategories.value,
  set: async (v) => {
    allCategories.value = v
    try {
      await reorderCategories(
        v.map((c) => c.uuid),
        categoryGateway
      )

      const toast = useToast()
      toast.add({
        title: t('shopSettings.categoryOrder.reorderSuccess'),
        color: 'green'
      })
    } catch {
      const toast = useToast()
      toast.add({
        title: t('shopSettings.categoryOrder.reorderError'),
        color: 'red'
      })
    }
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
