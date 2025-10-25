<template lang="pug">
.emergency-pharmacies-container.p-6
  .mb-4.flex.items-center.justify-between
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management')"
    )
    UButton(
      color="primary"
      icon="i-heroicons-plus"
      :label="$t('shopManagement.emergencyPharmacies.create')"
      @click="navigateTo('/shop-management/emergency-pharmacies/new')"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('shopManagement.emergencyPharmacies.title') }}

    template(#default)
      div(v-if="listVM.isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else-if="listVM.pharmaciesGroupedByDate.length === 0")
        .text-center.py-12.text-gray-500
          icon.mb-4(name="i-heroicons-map-pin" class="text-6xl")
          p {{ $t('shopManagement.emergencyPharmacies.noPharmacies') }}

      EmergencyPharmaciesList(
        v-else
        :pharmacies-grouped-by-date="listVM.pharmaciesGroupedByDate"
        :format-date="listVM.formatDate"
        @edit="(uuid) => navigateTo(`/shop-management/emergency-pharmacies/edit/${uuid}`)"
        @delete="openDeleteModal"
      )

  UModal(v-model="isDeleteModalOpen")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('shopManagement.emergencyPharmacies.delete') }}
      template(#default)
        p {{ $t('shopManagement.emergencyPharmacies.deleteConfirm') }}
        p.mt-2.font-semibold(v-if="pharmacyToDelete") {{ pharmacyToDelete.name }}
      template(#footer)
        .flex.justify-end.space-x-2
          UButton(
            color="gray"
            :label="$t('common.cancel')"
            @click="closeDeleteModal"
          )
          UButton(
            color="red"
            :label="$t('common.delete')"
            :loading="listVM.isDeleting"
            @click="deletePharmacy"
          )
</template>

<script lang="ts" setup>
import EmergencyPharmaciesList from '@adapters/primary/nuxt/components/organisms/EmergencyPharmaciesList.vue'
import { emergencyPharmaciesListVM } from '@adapters/primary/view-models/emergency-pharmacies/emergency-pharmacies-list/emergencyPharmaciesListVM'
import { deleteEmergencyPharmacy } from '@core/usecases/emergency-pharmacies/deleteEmergencyPharmacy'
import { listEmergencyPharmacies } from '@core/usecases/emergency-pharmacies/listEmergencyPharmacies'
import { useEmergencyPharmacyGateway } from '../../../../../../../gateways/emergencyPharmacyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const isDeleteModalOpen = ref(false)
const pharmacyToDelete = ref(null)
const emergencyPharmacyGateway = useEmergencyPharmacyGateway()

onMounted(async () => {
  await listEmergencyPharmacies(emergencyPharmacyGateway)
})

const listVM = computed(() => emergencyPharmaciesListVM())

const openDeleteModal = (pharmacy) => {
  pharmacyToDelete.value = pharmacy
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  pharmacyToDelete.value = null
}

const deletePharmacy = async () => {
  if (!pharmacyToDelete.value) return

  try {
    await deleteEmergencyPharmacy(
      pharmacyToDelete.value.uuid,
      emergencyPharmacyGateway
    )

    const toast = useToast()
    toast.add({
      title: t('shopManagement.emergencyPharmacies.deleteSuccess'),
      color: 'green'
    })

    closeDeleteModal()
  } catch {
    const toast = useToast()
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
  }
}
</script>

<style scoped>
.emergency-pharmacies-container {
  max-width: 900px;
  margin: 0 auto;
}

.pharmacy-item {
  transition: all 0.2s ease;
}

.pharmacy-item:hover {
  transform: translateX(4px);
}
</style>
