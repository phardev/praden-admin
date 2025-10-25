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
      h1.text-2xl.font-bold {{ $t('shopManagement.emergencyPharmacies.edit') }}

    template(#default)
      div(v-if="isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      EmergencyPharmacyForm(
        v-else
        mode="edit"
        :name="formData.name"
        :address="formData.address"
        :phone="formData.phone"
        :date="formData.date"
        :is-active="formData.isActive"
        :is-saving="isSaving"
        @submit="onSubmit"
        @cancel="navigateTo('/shop-management/emergency-pharmacies')"
      )
</template>

<script lang="ts" setup>
import EmergencyPharmacyForm from '@adapters/primary/nuxt/components/organisms/EmergencyPharmacyForm.vue'
import { editEmergencyPharmacy } from '@core/usecases/emergency-pharmacies/editEmergencyPharmacy'
import { getEmergencyPharmacy } from '@core/usecases/emergency-pharmacies/getEmergencyPharmacy'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { useEmergencyPharmacyGateway } from '../../../../../../../../gateways/emergencyPharmacyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const route = useRoute()
const uuid = route.params.uuid as string

const isLoading = ref(true)
const isSaving = ref(false)
const emergencyPharmacyGateway = useEmergencyPharmacyGateway()

const formData = reactive({
  name: '',
  address: '',
  phone: '',
  date: 0,
  isActive: true
})

onMounted(async () => {
  await getEmergencyPharmacy(uuid, emergencyPharmacyGateway)
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  const pharmacy = emergencyPharmacyStore.current

  if (pharmacy) {
    formData.name = pharmacy.name
    formData.address = pharmacy.address
    formData.phone = pharmacy.phone
    formData.date = pharmacy.date
    formData.isActive = pharmacy.isActive
  }

  isLoading.value = false
})

const onSubmit = async (data: {
  name: string
  address: string
  phone: string
  date: number
  isActive: boolean
}) => {
  isSaving.value = true

  try {
    await editEmergencyPharmacy(uuid, data, emergencyPharmacyGateway)

    const toast = useToast()
    toast.add({
      title: t('shopManagement.emergencyPharmacies.updateSuccess'),
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
