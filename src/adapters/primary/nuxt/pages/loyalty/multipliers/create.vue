<template lang="pug">
.multiplier-form-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/loyalty/multipliers')"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('loyalty.multipliers.form.title.create') }}

    template(#default)
      form.space-y-6(@submit.prevent="onSubmit")
        UFormGroup(
          :label="$t('loyalty.multipliers.name')"
        )
          UInput(
            v-model="formData.name"
            :placeholder="$t('loyalty.multipliers.form.namePlaceholder')"
          )

        UFormGroup(
          :label="$t('loyalty.multipliers.multiplierValue')"
          :hint="$t('loyalty.multipliers.form.multiplierValueHelp')"
        )
          UInput(
            v-model.number="formData.multiplierValue"
            type="number"
            min="1"
            step="0.5"
          )

        UFormGroup(
          :label="$t('loyalty.multipliers.startDate')"
        )
          FtDatePicker(
            v-model="formData.startDate"
          )

        UFormGroup(
          :label="$t('loyalty.multipliers.endDate')"
        )
          FtDatePicker(
            v-model="formData.endDate"
          )

        .flex.justify-end.space-x-2
          UButton(
            color="gray"
            :label="$t('common.cancel')"
            @click="navigateTo('/loyalty/multipliers')"
          )
          UButton(
            type="submit"
            color="primary"
            :label="$t('common.create')"
            :loading="isSaving"
            :disabled="!isValid"
          )
</template>

<script lang="ts" setup>
import { createMultiplier } from '@core/usecases/loyalty/createMultiplier'
import { useLoyaltyGateway } from '../../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const loyaltyGateway = useLoyaltyGateway()

const isSaving = ref(false)

const formData = ref({
  name: '',
  multiplierValue: 2,
  startDate: null as number | null,
  endDate: null as number | null
})

const isValid = computed(() => {
  return (
    formData.value.name.trim().length > 0 &&
    formData.value.multiplierValue > 0 &&
    formData.value.startDate !== null &&
    formData.value.endDate !== null
  )
})

const onSubmit = async () => {
  if (!isValid.value) return

  isSaving.value = true

  try {
    await createMultiplier(
      {
        name: formData.value.name,
        multiplierValue: formData.value.multiplierValue,
        startDate: formData.value.startDate!,
        endDate: formData.value.endDate!
      },
      loyaltyGateway
    )

    const toast = useToast()
    toast.add({
      title: t('loyalty.multipliers.createSuccess'),
      color: 'green'
    })

    navigateTo('/loyalty/multipliers')
  } catch {
    const toast = useToast()
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.multiplier-form-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
