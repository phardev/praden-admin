<template lang="pug">
UForm(:state="formState" @submit="onSubmit")
  .space-y-6
    UFormGroup(:label="$t('shopSettings.emergencyPharmacies.name')" name="name" required)
      ft-text-field(
        v-model="formState.name"
        :disabled="isLoading"
      )

    UFormGroup(:label="$t('shopSettings.emergencyPharmacies.address')" name="address" required)
      ft-text-field(
        v-model="formState.address"
        :disabled="isLoading"
      )

    UFormGroup(:label="$t('shopSettings.emergencyPharmacies.phone')" name="phone" required)
      ft-text-field(
        v-model="formState.phone"
        type="tel"
        :disabled="isLoading"
      )

    UFormGroup(:label="$t('shopSettings.emergencyPharmacies.date')" name="date" required)
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton.w-full(
          icon="i-heroicons-calendar-days-20-solid"
          :disabled="isLoading"
          :label="formState.date ? formatDisplayDate(formState.date) : $t('shopSettings.emergencyPharmacies.selectDate')"
        )
          template(#trailing)
            UButton(
              v-show="formState.date"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click.prevent="clearDate"
            )
        template(#panel="{ close }")
          ft-date-picker(
            :model-value="formState.date"
            @update:model-value="dateChanged"
            @close="close"
          )

    UFormGroup(:label="$t('shopSettings.emergencyPharmacies.isActive')" name="isActive")
      UToggle(v-model="formState.isActive" size="xl" :disabled="isLoading")

    .flex.justify-end.space-x-4
      UButton(
        color="gray"
        variant="ghost"
        :label="$t('common.cancel')"
        :disabled="isLoading"
        @click="$emit('cancel')"
      )
      UButton(
        type="submit"
        color="primary"
        :label="mode === 'create' ? $t('common.create') : $t('common.update')"
        :loading="isSaving"
      )
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  name?: string
  address?: string
  phone?: string
  date?: number
  isActive?: boolean
  mode: 'create' | 'edit'
  isLoading?: boolean
  isSaving?: boolean
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    data: {
      name: string
      address: string
      phone: string
      date: number
      isActive: boolean
    }
  ): void
  (e: 'cancel'): void
}>()

const formState = reactive({
  name: props.name || '',
  address: props.address || '',
  phone: props.phone || '',
  date: props.date || null,
  isActive: props.isActive !== undefined ? props.isActive : true
})

watch(
  () => props.name,
  (newVal) => {
    formState.name = newVal || ''
  }
)
watch(
  () => props.address,
  (newVal) => {
    formState.address = newVal || ''
  }
)
watch(
  () => props.phone,
  (newVal) => {
    formState.phone = newVal || ''
  }
)
watch(
  () => props.date,
  (newVal) => {
    formState.date = newVal || null
  }
)
watch(
  () => props.isActive,
  (newVal) => {
    formState.isActive = newVal !== undefined ? newVal : true
  }
)

const formatDisplayDate = (timestamp: number) => {
  return format(new Date(timestamp), 'd MMMM yyyy', { locale: fr })
}

const dateChanged = (timestamp: number) => {
  formState.date = timestamp
}

const clearDate = () => {
  formState.date = null
}

const onSubmit = () => {
  if (
    !formState.name ||
    !formState.address ||
    !formState.phone ||
    !formState.date
  ) {
    return
  }

  emit('submit', {
    name: formState.name,
    address: formState.address,
    phone: formState.phone,
    date: formState.date,
    isActive: formState.isActive
  })
}
</script>
