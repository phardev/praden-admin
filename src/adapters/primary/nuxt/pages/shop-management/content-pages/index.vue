<template lang="pug">
.content-pages-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management')"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('shopManagement.contentPages.title') }}
      p.text-gray-600.mt-2 {{ $t('shopManagement.contentPages.description') }}

    template(#default)
      div(v-if="vm.isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else-if="rows.length === 0")
        .text-center.py-12.text-gray-500
          icon.mb-4(name="i-heroicons-document-text" class="text-6xl")
          p {{ $t('shopManagement.contentPages.list.empty') }}

      UTable(v-else :columns="columns" :rows="rows")
        template(#label-data="{ row }")
          span.font-medium {{ row.label }}

        template(#lastUpdate-data="{ row }")
          span.text-sm.text-gray-500 {{ row.lastUpdate }}

        template(#actions-data="{ row }")
          .flex.justify-end
            UButton(
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil"
              size="xs"
              :label="$t('shopManagement.contentPages.list.edit')"
              @click="navigateTo(`/shop-management/content-pages/edit/${row.slug}`)"
            )
</template>

<script lang="ts" setup>
import { getContentPagesVM } from '@adapters/primary/view-models/content-page/get-content-pages/getContentPagesVM'
import { listContentPages } from '@core/usecases/content-page/list-content-pages/listContentPages'
import { useContentPageGateway } from '../../../../../../../gateways/contentPageGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const contentPageGateway = useContentPageGateway()

const vm = computed(() => getContentPagesVM())

const columns = computed(() => [
  { key: 'label', label: t('shopManagement.contentPages.list.page') },
  {
    key: 'lastUpdate',
    label: t('shopManagement.contentPages.list.lastUpdate')
  },
  { key: 'actions', label: '' }
])

const rows = computed(() =>
  vm.value.items.map((item) => ({
    slug: item.slug,
    label: t(`shopManagement.contentPages.pages.${item.slug}`),
    lastUpdate: t(
      `shopManagement.contentPages.lastUpdated.${item.authorKind}`,
      {
        date: item.updatedAt,
        author: item.authorName
      }
    )
  }))
)

onMounted(async () => {
  try {
    await listContentPages(contentPageGateway)
  } catch {
    toast.add({ title: t('error.unknown'), color: 'red' })
  }
})
</script>
