<template lang="pug">
form(@submit.prevent="onSubmit")
  .space-y-6
    UFormGroup(:label="$t('shopSettings.announcementBar.text')" name="text" required)
      UTextarea(
        :model-value="formVM.get('text').value"
        :rows="3"
        :disabled="formVM.isLoading"
        @update:model-value="formVM.set('text', $event)"
      )

    UFormGroup(:label="$t('shopSettings.announcementBar.isActive')" name="isActive")
      UToggle(
        :model-value="formVM.get('isActive').value"
        size="xl"
        :disabled="formVM.isLoading"
        @update:model-value="formVM.set('isActive', $event)"
      )

    .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
      UFormGroup(:label="$t('shopSettings.announcementBar.startDate')" name="startDate")
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton.w-full(
            icon="i-heroicons-calendar-days-20-solid"
            :disabled="formVM.isLoading"
            :label="formVM.get('startDate').value ? formVM.formatDisplayDate(formVM.get('startDate').value) : $t('shopSettings.announcementBar.selectDate')"
          )
            template(#trailing)
              UButton(
                v-show="formVM.get('startDate').value"
                color="white"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click.prevent="formVM.set('startDate', '')"
              )
          template(#panel="{ close }")
            ft-date-picker(
              :model-value="isoStringToTimestamp(formVM.get('startDate').value)"
              @update:model-value="onStartDateChange($event)"
              @close="close"
            )

      UFormGroup(:label="$t('shopSettings.announcementBar.endDate')" name="endDate")
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton.w-full(
            icon="i-heroicons-calendar-days-20-solid"
            :disabled="formVM.isLoading"
            :label="formVM.get('endDate').value ? formVM.formatDisplayDate(formVM.get('endDate').value) : $t('shopSettings.announcementBar.selectDate')"
          )
            template(#trailing)
              UButton(
                v-show="formVM.get('endDate').value"
                color="white"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click.prevent="formVM.set('endDate', '')"
              )
          template(#panel="{ close }")
            ft-date-picker(
              :is-end-date="true"
              :model-value="isoStringToTimestamp(formVM.get('endDate').value)"
              @update:model-value="onEndDateChange($event)"
              @close="close"
            )

    .flex.justify-end.space-x-4
      UButton(
        color="gray"
        variant="ghost"
        :label="$t('common.cancel')"
        :disabled="formVM.isLoading"
        @click="emit('cancel')"
      )
      UButton(
        type="submit"
        color="primary"
        :label="$t('common.update')"
        :loading="isSaving"
      )
</template>

<script lang="ts" setup>
import type { announcementBarFormVM } from '@adapters/primary/view-models/announcement-bar/announcement-bar-form/announcementBarFormVM'

const props = defineProps<{
  formVM: ReturnType<typeof announcementBarFormVM>
  isSaving?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const isoStringToTimestamp = (isoString: string): number | undefined => {
  if (!isoString) return undefined
  return new Date(isoString).getTime()
}

const onStartDateChange = (timestamp: number) => {
  const isoString = new Date(timestamp).toISOString().slice(0, 16)
  props.formVM.set('startDate', isoString)
}

const onEndDateChange = (timestamp: number) => {
  const isoString = new Date(timestamp).toISOString().slice(0, 16)
  props.formVM.set('endDate', isoString)
}

const onSubmit = () => {
  emit('submit')
}
</script>
