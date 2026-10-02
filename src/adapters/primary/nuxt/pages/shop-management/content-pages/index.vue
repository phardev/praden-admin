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
      .flex.items-start.justify-between.gap-4
        div
          h1.text-2xl.font-bold {{ $t('shopManagement.contentPages.title') }}
          p.text-gray-600.mt-2 {{ $t('shopManagement.contentPages.description') }}
        UButton(
          color="primary"
          icon="i-heroicons-plus"
          :label="$t('shopManagement.contentPages.create')"
          @click="navigateTo('/shop-management/content-pages/new')"
        )

    template(#default)
      TabGroup.border-b.border-gray-200(as="div" @change="onTabChange")
        TabList.-mb-px.flex.space-x-4
          Tab.outline-0.cursor-pointer(
            v-for="(tab, tabIndex) in tabs"
            v-slot="{ selected }"
            :key="tabIndex"
            as="div"
          )
            div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
              :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
            )
              div {{ tab.label }}
        TabPanels
          TabPanel.mt-4.pb-4
            .space-y-3(v-if="vm.isLoading")
              USkeleton.h-12(v-for="n in 5" :key="n")

            div(v-else-if="vm.items.length === 0")
              .text-center.py-12.text-gray-500
                icon.mb-4(name="i-heroicons-document-text" class="text-6xl")
                p {{ $t('shopManagement.contentPages.list.empty') }}

            UTable(v-else :columns="columns" :rows="rows")
              template(#name-data="{ row }")
                .flex.items-center.gap-2
                  span.font-medium {{ row.name }}
                  ft-mandatory-badge(v-if="row.isMandatory")
                .text-xs.text-gray-500 /{{ row.slug }}

              template(#status-data="{ row }")
                ft-content-page-status-badge(:status="row.status")

              template(#lastUpdate-data="{ row }")
                span.text-sm.text-gray-500 {{ row.lastUpdate }}

              template(#actions-data="{ row }")
                .flex.justify-end.gap-1
                  UButton(
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-pencil"
                    size="xs"
                    :label="$t('shopManagement.contentPages.list.edit')"
                    @click="navigateTo(`/shop-management/content-pages/edit/${row.slug}`)"
                  )
                  UButton(
                    v-if="row.canDelete"
                    color="red"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    size="xs"
                    :aria-label="$t('shopManagement.contentPages.list.delete')"
                    @click="openDeleteModal(row.slug)"
                  )

          TabPanel.mt-4.pb-4
            footer-order-manager(
              :sections="footerVM.sections"
              :is-loading="footerVM.isLoading"
              :is-saving="footerVM.isSaving"
              @reorder="reorder"
            )

  content-page-delete-modal(
    :is-open="isDeleteModalOpen"
    :content-page="itemToDelete"
    :is-deleting="vm.isDeleting"
    @update:is-open="isDeleteModalOpen = $event"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  )
</template>

<script lang="ts" setup>
import type { GetContentPagesItemVM } from '@adapters/primary/view-models/content-page/get-content-pages/getContentPagesVM'
import { getContentPagesVM } from '@adapters/primary/view-models/content-page/get-content-pages/getContentPagesVM'
import { getFooterOrderVM } from '@adapters/primary/view-models/content-page/get-footer-order/getFooterOrderVM'
import type { FooterSection } from '@core/entities/footer'
import { deleteContentPage } from '@core/usecases/content-page/content-page-deletion/deleteContentPage'
import { listContentPages } from '@core/usecases/content-page/list-content-pages/listContentPages'
import { reorderFooterSection } from '@core/usecases/footer/footer-section-reorder/reorderFooterSection'
import { getFooter } from '@core/usecases/footer/get-footer/getFooter'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { useContentPageGateway } from '../../../../../../../gateways/contentPageGateway'
import { useFooterGateway } from '../../../../../../../gateways/footerGateway'

definePageMeta({ layout: 'main' })

const PAGES_TAB = 0

const { t } = useI18n()
const toast = useToast()
const contentPageGateway = useContentPageGateway()
const footerGateway = useFooterGateway()

const vm = computed(() => getContentPagesVM())
const footerVM = computed(() => getFooterOrderVM())
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<GetContentPagesItemVM | undefined>(undefined)

const tabs = computed(() => [
  { label: t('shopManagement.contentPages.tabs.pages') },
  { label: t('shopManagement.contentPages.tabs.footer') }
])

const columns = computed(() => [
  { key: 'name', label: t('shopManagement.contentPages.list.page') },
  { key: 'status', label: t('shopManagement.contentPages.list.status') },
  {
    key: 'lastUpdate',
    label: t('shopManagement.contentPages.list.lastUpdate')
  },
  { key: 'actions', label: '' }
])

const rows = computed(() =>
  vm.value.items.map((item: GetContentPagesItemVM) => ({
    ...item,
    lastUpdate: t(
      `shopManagement.contentPages.lastUpdated.${item.authorKind}`,
      {
        date: item.updatedAt,
        author: item.authorName
      }
    )
  }))
)

const loadPages = async () => {
  try {
    await listContentPages(contentPageGateway)
  } catch {
    toast.add({ title: t('error.unknown'), color: 'red' })
  }
}

const loadFooter = async () => {
  try {
    await getFooter(footerGateway)
  } catch {
    toast.add({ title: t('error.unknown'), color: 'red' })
  }
}

onMounted(loadPages)

const onTabChange = async (tabIndex: number) => {
  if (tabIndex === PAGES_TAB) {
    await loadPages()
    return
  }
  await loadFooter()
}

const reorder = async (section: FooterSection, uuids: Array<string>) => {
  try {
    await reorderFooterSection(section, uuids, footerGateway)
  } catch {
    toast.add({
      title: t('shopManagement.contentPages.footer.reorderError'),
      color: 'red'
    })
    await loadFooter()
  }
}

const openDeleteModal = (slug: string) => {
  itemToDelete.value = vm.value.items.find(
    (item: GetContentPagesItemVM) => item.slug === slug
  )
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  itemToDelete.value = undefined
}

const confirmDelete = async () => {
  try {
    await deleteContentPage(itemToDelete.value!.slug, contentPageGateway)
    toast.add({
      title: t('shopManagement.contentPages.delete.success'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.contentPages.delete.error'),
      color: 'red'
    })
  } finally {
    closeDeleteModal()
  }
}
</script>
