<template lang="pug">
.emergency-pharmacy-form-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management/emergency-pharmacies')"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('shopManagement.emergencyPharmacies.create') }}

    template(#default)
      EmergencyPharmacyForm(
        mode="create"
        :is-saving="isSaving"
        @submit="onSubmit"
        @cancel="navigateTo('/shop-management/emergency-pharmacies')"
      )
</template>

<script lang="ts" setup>
import EmergencyPharmacyForm from '@adapters/primary/nuxt/components/organisms/EmergencyPharmacyForm.vue'
import { createEmergencyPharmacy } from '@core/usecases/emergency-pharmacies/createEmergencyPharmacy'
import { useEmergencyPharmacyGateway } from '../../../../../../../gateways/emergencyPharmacyGateway'
import { useUuidGenerator } from '../../../../../../../gateways/uuidGenerator'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const isSaving = ref(false)
const emergencyPharmacyGateway = useEmergencyPharmacyGateway()
const uuidGenerator = useUuidGenerator()

const onSubmit = async (data: {
  name: string
  address: string
  phone: string
  date: number
  isActive: boolean
}) => {
  isSaving.value = true

  try {
    await createEmergencyPharmacy(data, emergencyPharmacyGateway)

    const toast = useToast()
    toast.add({
      title: t('shopManagement.emergencyPharmacies.createSuccess'),
      color: 'green'
    })

    navigateTo('/shop-management/emergency-pharmacies')
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
.emergency-pharmacy-form-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
