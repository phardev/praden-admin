<template lang="pug">
.section
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management')"
    )

  div.flex.items-center.align-center
    h1.text-page-title.flex-grow {{ $t('shopManagement.announcementBar.title') }}
    ft-button.button-solid.text-xl.px-6(@click="openCreateModal")
      | {{ $t('shopManagement.announcementBar.create') }}

  AnnouncementBarsList(
    :announcement-bars-vm="announcementBarsVM"
    @edit="handleEdit"
    @delete="handleDelete"
  )

  AnnouncementBarFormModal(
    v-model="modalState.isOpen"
    :mode="modalState.mode"
    :announcement-bar-uuid="modalState.uuid"
    @success="handleSuccess"
  )
</template>

<script lang="ts" setup>
import AnnouncementBarFormModal from '@adapters/primary/nuxt/components/organisms/AnnouncementBarFormModal.vue'
import AnnouncementBarsList from '@adapters/primary/nuxt/components/organisms/AnnouncementBarsList.vue'
import { getAnnouncementBarsVM } from '@adapters/primary/view-models/announcement-bar/get-announcement-bars/getAnnouncementBarsVM'
import { deleteAnnouncementBar } from '@core/usecases/announcement-bar/announcement-bar-deletion/deleteAnnouncementBar'
import { listAnnouncementBars } from '@core/usecases/announcement-bar/list-announcement-bars/listAnnouncementBars'
import { useAnnouncementBarGateway } from '../../../../../../gateways/announcementBarGateway'
import { useDateProvider } from '../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const announcementBarGateway = useAnnouncementBarGateway()

const modalState = reactive({
  isOpen: false,
  mode: 'create' as 'create' | 'edit',
  uuid: undefined as string | undefined
})

onMounted(() => {
  listAnnouncementBars(announcementBarGateway)
})

const announcementBarsVM = computed(() => {
  return getAnnouncementBarsVM(useDateProvider())
})

const openCreateModal = () => {
  modalState.mode = 'create'
  modalState.uuid = undefined
  modalState.isOpen = true
}

const handleEdit = (uuid: string) => {
  modalState.mode = 'edit'
  modalState.uuid = uuid
  modalState.isOpen = true
}

const handleDelete = async (uuid: string) => {
  try {
    await deleteAnnouncementBar(uuid, announcementBarGateway)
    toast.add({
      title: t('shopManagement.announcementBar.deleteSuccess'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.announcementBar.deleteError'),
      color: 'red'
    })
  }
}

const handleSuccess = () => {
  toast.add({
    title:
      modalState.mode === 'create'
        ? t('shopManagement.announcementBar.createSuccess')
        : t('shopManagement.announcementBar.updateSuccess'),
    color: 'green'
  })
}
</script>
