<template lang="pug">
UForm(:state="formState" @submit="onSubmit")
  .space-y-6
    UFormGroup(:label="$t('deliveryPriceRules.fields.deliveryMethod')" name="deliveryMethodUuid" required)
      USelectMenu(
        v-model="formState.deliveryMethodUuid"
        :options="deliveryMethodOptions"
        value-attribute="uuid"
        option-attribute="name"
        :disabled="isLoading"
        :placeholder="$t('deliveryPriceRules.form.selectDeliveryMethod')"
      )

    UFormGroup(:label="$t('deliveryPriceRules.fields.name')" name="name" required)
      ft-text-field(
        v-model="formState.name"
        :disabled="isLoading"
        :placeholder="$t('deliveryPriceRules.form.namePlaceholder')"
      )

    .grid(class="grid-cols-1 md:grid-cols-2 gap-6")
      UFormGroup(:label="$t('deliveryPriceRules.fields.price')" name="priceInEuros" required)
        ft-currency-input(
          v-model="formState.priceInEuros"
          :disabled="isLoading"
        )

      UFormGroup(:label="$t('deliveryPriceRules.fields.minOrderValue')" name="minOrderValueInEuros")
        ft-currency-input(
          v-model="formState.minOrderValueInEuros"
          :disabled="isLoading"
        )

    .grid(class="grid-cols-1 md:grid-cols-2 gap-6")
      UFormGroup(:label="$t('deliveryPriceRules.fields.maxWeight')" name="maxWeightInKg")
        UInput(
          v-model.number="formState.maxWeightInKg"
          type="number"
          step="0.1"
          min="0"
          :disabled="isLoading"
        )
          template(#trailing)
            span.text-gray-500.text-sm {{ $t('deliveryPriceRules.form.weightUnit') }}

      UFormGroup(:label="$t('deliveryPriceRules.fields.priority')" name="priority")
        UInput(
          v-model.number="formState.priority"
          type="number"
          min="0"
          :disabled="isLoading"
        )
        p.text-sm.text-gray-500.mt-1 {{ $t('deliveryPriceRules.fields.priorityHelp') }}

    .grid(class="grid-cols-1 md:grid-cols-2 gap-6")
      UFormGroup(:label="$t('deliveryPriceRules.fields.startDate')" name="startDate")
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton.w-full(
            icon="i-heroicons-calendar-days-20-solid"
            :disabled="isLoading"
            :label="formState.startDate ? formatDisplayDate(formState.startDate) : $t('deliveryPriceRules.form.selectStartDate')"
          )
            template(#trailing)
              UButton(
                v-show="formState.startDate"
                color="white"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click.prevent="clearStartDate"
              )
          template(#panel="{ close }")
            ft-date-picker(
              :model-value="formState.startDate"
              @update:model-value="startDateChanged"
              @close="close"
            )

      UFormGroup(:label="$t('deliveryPriceRules.fields.endDate')" name="endDate")
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton.w-full(
            icon="i-heroicons-calendar-days-20-solid"
            :disabled="isLoading"
            :label="formState.endDate ? formatDisplayDate(formState.endDate) : $t('deliveryPriceRules.form.selectEndDate')"
          )
            template(#trailing)
              UButton(
                v-show="formState.endDate"
                color="white"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click.prevent="clearEndDate"
              )
          template(#panel="{ close }")
            ft-date-picker(
              :model-value="formState.endDate"
              @update:model-value="endDateChanged"
              @close="close"
            )

    UFormGroup(:label="$t('deliveryPriceRules.fields.isActive')" name="isActive")
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
        :disabled="!isFormValid"
      )
</template>

<script lang="ts" setup>
import type { DeliveryMethod } from '@core/entities/order'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  deliveryMethodUuid?: string
  name?: string
  priceInEuros?: number
  minOrderValueInEuros?: number
  maxWeightInKg?: number
  priority?: number
  startDate?: number | null
  endDate?: number | null
  isActive?: boolean
  mode: 'create' | 'edit'
  isLoading?: boolean
  isSaving?: boolean
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    data: {
      deliveryMethodUuid: string
      name: string
      priceInEuros: number
      minOrderValueInEuros: number
      maxWeightInKg: number
      priority: number
      startDate: number | null
      endDate: number | null
      isActive: boolean
    }
  ): void
  (e: 'cancel'): void
}>()

const deliveryMethodStore = useDeliveryMethodStore()

const deliveryMethodOptions = computed<Array<DeliveryMethod>>(() => {
  return deliveryMethodStore.items
})

const formState = reactive({
  deliveryMethodUuid: props.deliveryMethodUuid || '',
  name: props.name || '',
  priceInEuros: props.priceInEuros ?? 0,
  minOrderValueInEuros: props.minOrderValueInEuros ?? 0,
  maxWeightInKg: props.maxWeightInKg ?? 5,
  priority: props.priority ?? 0,
  startDate: props.startDate ?? (null as number | null),
  endDate: props.endDate ?? (null as number | null),
  isActive: props.isActive !== undefined ? props.isActive : true
})

watch(
  () => props.deliveryMethodUuid,
  (newVal) => {
    formState.deliveryMethodUuid = newVal || ''
  }
)
watch(
  () => props.name,
  (newVal) => {
    formState.name = newVal || ''
  }
)
watch(
  () => props.priceInEuros,
  (newVal) => {
    formState.priceInEuros = newVal ?? 0
  }
)
watch(
  () => props.minOrderValueInEuros,
  (newVal) => {
    formState.minOrderValueInEuros = newVal ?? 0
  }
)
watch(
  () => props.maxWeightInKg,
  (newVal) => {
    formState.maxWeightInKg = newVal ?? 5
  }
)
watch(
  () => props.priority,
  (newVal) => {
    formState.priority = newVal ?? 0
  }
)
watch(
  () => props.startDate,
  (newVal) => {
    formState.startDate = newVal ?? null
  }
)
watch(
  () => props.endDate,
  (newVal) => {
    formState.endDate = newVal ?? null
  }
)
watch(
  () => props.isActive,
  (newVal) => {
    formState.isActive = newVal !== undefined ? newVal : true
  }
)

const isFormValid = computed(() => {
  return formState.name !== '' && formState.deliveryMethodUuid !== ''
})

const formatDisplayDate = (timestamp: number) => {
  return format(new Date(timestamp), 'd MMMM yyyy', { locale: fr })
}

const startDateChanged = (timestamp: number) => {
  formState.startDate = timestamp
}

const endDateChanged = (timestamp: number) => {
  formState.endDate = timestamp
}

const clearStartDate = () => {
  formState.startDate = null
}

const clearEndDate = () => {
  formState.endDate = null
}

const onSubmit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    deliveryMethodUuid: formState.deliveryMethodUuid,
    name: formState.name,
    priceInEuros: formState.priceInEuros,
    minOrderValueInEuros: formState.minOrderValueInEuros,
    maxWeightInKg: formState.maxWeightInKg,
    priority: formState.priority,
    startDate: formState.startDate,
    endDate: formState.endDate,
    isActive: formState.isActive
  })
}
</script>
