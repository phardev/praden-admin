<template lang="pug">
FtModal(v-model="isOpen" @close="handleClose")
  div(class="max-w-2xl mx-auto")
    .flex.items-center.justify-between.mb-6
      h2.text-xl.font-semibold.text-gray-900
        | {{ mode === 'create' ? $t('shopManagement.announcementBar.createTitle') : $t('shopManagement.announcementBar.editTitle') }}

    p.text-gray-600.mb-6
      | {{ mode === 'create' ? $t('shopManagement.announcementBar.createDescription') : $t('shopManagement.announcementBar.editDescription') }}

    div(v-if="modalState.error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md")
      p(class="text-red-600") {{ modalState.error }}

    div(v-if="modalState.isLoading || !currentFormVM")
      div(class="space-y-6")
        div(class="pb-4")
          div(class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4")
          div(class="h-10 bg-gray-200 rounded animate-pulse")
        div(class="pb-4")
          div(class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4")
          div(class="h-6 bg-gray-200 rounded animate-pulse")

      div(class="flex justify-end space-x-4 pt-6 border-t border-gray-200")
        ft-button(
          type="button"
          variant="outline"
          @click="handleClose"
        ) {{ $t('common.cancel') }}

    form(v-else @submit.prevent="handleSubmit")
      UFormGroup(
        :label="$t('shopManagement.announcementBar.text')"
        name="text"
        required
        class="pb-4"
      )
        UTextarea(
          :model-value="currentFormVM.get('text').value"
          :disabled="!currentFormVM.get('text').canEdit"
          :rows="3"
          @update:model-value="textChanged"
        )

      UFormGroup(
        :label="$t('shopManagement.announcementBar.isActive')"
        name="isActive"
        class="pb-4"
      )
        UToggle(
          :model-value="currentFormVM.get('isActive').value"
          size="xl"
          @update:model-value="isActiveChanged"
        )

      .grid.grid-cols-1.gap-4(class="md:grid-cols-2 pb-6")
        UFormGroup(
          :label="$t('shopManagement.announcementBar.startDate')"
          name="startDate"
        )
          UPopover(:popper="{ placement: 'bottom-start' }")
            UButton.w-full(
              icon="i-heroicons-calendar-days-20-solid"
              :label="currentFormVM.get('startDate').value ? formatDisplayDate(currentFormVM.get('startDate').value) : $t('shopManagement.announcementBar.selectDate')"
            )
              template(#trailing)
                UButton(
                  v-show="currentFormVM.get('startDate').value"
                  color="white"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  :padded="false"
                  @click.prevent="clearStartDate"
                )
            template(#panel="{ close }")
              ft-date-picker(
                :model-value="currentFormVM.get('startDate').value"
                @update:model-value="startDateChanged"
                @close="close"
              )

        UFormGroup(
          :label="$t('shopManagement.announcementBar.endDate')"
          name="endDate"
        )
          UPopover(:popper="{ placement: 'bottom-start' }")
            UButton.w-full(
              icon="i-heroicons-calendar-days-20-solid"
              :label="currentFormVM.get('endDate').value ? formatDisplayDate(currentFormVM.get('endDate').value) : $t('shopManagement.announcementBar.selectDate')"
            )
              template(#trailing)
                UButton(
                  v-show="currentFormVM.get('endDate').value"
                  color="white"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  :padded="false"
                  @click.prevent="clearEndDate"
                )
            template(#panel="{ close }")
              ft-date-picker(
                :is-end-date="true"
                :model-value="currentFormVM.get('endDate').value"
                @update:model-value="endDateChanged"
                @close="close"
              )

      .space-y-2.pb-6(aria-live="polite")
        .flex.items-start.gap-2.rounded-md.border.border-blue-200.bg-blue-50.p-3.text-sm.text-blue-900(
          v-for="period in impactVM.replaces"
          :key="`replaces-${period.startLabel}-${period.text}`"
        )
          icon.icon-md.shrink-0(name="material-symbols:swap-horiz")
          span {{ $t('shopManagement.announcementBar.impact.replaces', period) }}
        .flex.items-start.gap-2.rounded-md.border.border-orange-200.bg-orange-50.p-3.text-sm.text-orange-900(
          v-for="period in impactVM.maskedBy"
          :key="`masked-${period.startLabel}-${period.text}`"
        )
          icon.icon-md.shrink-0(name="material-symbols:visibility-off-outline")
          span {{ $t('shopManagement.announcementBar.impact.maskedBy', period) }}

      div(class="flex justify-end space-x-4 pt-6 border-t border-gray-200")
        ft-button(
          type="button"
          variant="outline"
          @click="handleClose"
        ) {{ $t('common.cancel') }}

        ft-button(
          type="submit"
          :disabled="!canValidate"
          :loading="modalState.isSubmitting"
        ) {{ mode === 'create' ? $t('shopManagement.announcementBar.createSubmit') : $t('shopManagement.announcementBar.editSubmit') }}
</template>

<script setup lang="ts">
import {
  type AnnouncementBarFormCreateVM,
  announcementBarFormCreateVM
} from '@adapters/primary/view-models/announcement-bar/announcement-bar-form/announcementBarFormCreateVM'
import {
  type AnnouncementBarFormEditVM,
  announcementBarFormEditVM
} from '@adapters/primary/view-models/announcement-bar/announcement-bar-form/announcementBarFormEditVM'
import { getAnnouncementBarImpactVM } from '@adapters/primary/view-models/announcement-bar/get-announcement-bar-impact/getAnnouncementBarImpactVM'
import type { AnnouncementBarDraft } from '@core/gateways/announcementBarGateway'
import { createAnnouncementBar } from '@core/usecases/announcement-bar/announcement-bar-creation/createAnnouncementBar'
import { editAnnouncementBar } from '@core/usecases/announcement-bar/announcement-bar-edition/editAnnouncementBar'
import { getAnnouncementBar } from '@core/usecases/announcement-bar/announcement-bar-get/getAnnouncementBar'
import { previewAnnouncementBarSchedule } from '@core/usecases/announcement-bar/announcement-bar-schedule-preview/previewAnnouncementBarSchedule'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAnnouncementBarGateway } from '~/gateways/announcementBarGateway'

interface Props {
  modelValue: boolean
  mode: 'create' | 'edit'
  announcementBarUuid?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  mode: 'create',
  announcementBarUuid: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const announcementBarGateway = useAnnouncementBarGateway()
const modalState = reactive({
  isLoading: false,
  isSubmitting: false,
  error: null as string | null
})

const currentFormVM = ref<
  AnnouncementBarFormCreateVM | AnnouncementBarFormEditVM | null
>(null)

const formKey = computed(() => {
  if (props.mode === 'create') {
    return 'announcement-bar-create-form'
  } else if (props.mode === 'edit' && props.announcementBarUuid) {
    return `announcement-bar-edit-form-${props.announcementBarUuid}`
  }
  return null
})

const canValidate = computed(() => {
  if (!currentFormVM.value) return false
  return currentFormVM.value.getCanValidate()
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formatDisplayDate = (timestamp: number): string => {
  if (!timestamp) return ''
  return format(new Date(timestamp), 'd MMMM yyyy', { locale: fr })
}

watch(
  () => [props.mode, props.announcementBarUuid, isOpen.value],
  async () => {
    currentFormVM.value = null
    modalState.error = null

    if (!isOpen.value) {
      return
    }

    modalState.isLoading = true
    modalState.error = null

    try {
      if (props.mode === 'create') {
        currentFormVM.value = announcementBarFormCreateVM(formKey.value!)
      } else if (props.mode === 'edit' && props.announcementBarUuid) {
        await getAnnouncementBar(
          props.announcementBarUuid,
          announcementBarGateway
        )
        currentFormVM.value = announcementBarFormEditVM(formKey.value!)
      }
    } catch (error: any) {
      modalState.error = error.message
    } finally {
      modalState.isLoading = false
    }
  },
  { immediate: true }
)

const PREVIEW_DEBOUNCE_IN_MS = 300

const impactVM = computed(() => getAnnouncementBarImpactVM())

const editedUuid = computed(() =>
  props.mode === 'edit' ? props.announcementBarUuid : undefined
)

const draft = computed((): AnnouncementBarDraft | undefined => {
  if (!currentFormVM.value) return undefined
  const { isActive, startDate, endDate } = currentFormVM.value.getDto()
  return { uuid: editedUuid.value, isActive, startDate, endDate }
})

watchDebounced(
  () => JSON.stringify(draft.value),
  async () => {
    if (!draft.value) return
    try {
      await previewAnnouncementBarSchedule(draft.value, announcementBarGateway)
    } catch {
      return
    }
  },
  { debounce: PREVIEW_DEBOUNCE_IN_MS, immediate: true }
)

const textChanged = (value: string) => {
  if (currentFormVM.value) {
    currentFormVM.value.set('text', value)
  }
}

const isActiveChanged = (value: boolean) => {
  if (currentFormVM.value) {
    currentFormVM.value.set('isActive', value)
  }
}

const startDateChanged = (timestamp: number) => {
  if (currentFormVM.value) {
    currentFormVM.value.set('startDate', timestamp)
  }
}

const clearStartDate = () => {
  if (currentFormVM.value) {
    currentFormVM.value.set('startDate', undefined)
  }
}

const endDateChanged = (timestamp: number) => {
  if (currentFormVM.value) {
    currentFormVM.value.set('endDate', timestamp)
  }
}

const clearEndDate = () => {
  if (currentFormVM.value) {
    currentFormVM.value.set('endDate', undefined)
  }
}

const handleSubmit = async () => {
  if (!currentFormVM.value || !canValidate.value) return

  modalState.isSubmitting = true
  try {
    if (props.mode === 'create') {
      const dto = (currentFormVM.value as AnnouncementBarFormCreateVM).getDto()
      await createAnnouncementBar(dto, announcementBarGateway)
    } else if (props.mode === 'edit' && props.announcementBarUuid) {
      const dto = (currentFormVM.value as AnnouncementBarFormEditVM).getDto()
      await editAnnouncementBar(
        props.announcementBarUuid,
        dto,
        announcementBarGateway
      )
    }

    emit('success')
    handleClose()
  } catch (error: any) {
    modalState.error = error.message
  } finally {
    modalState.isSubmitting = false
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
