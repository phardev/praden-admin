<template lang="pug">
.pharmacist-selection-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="handleBackClick"
    )

  UAlert.mb-4(
    v-if="!selectionVM.isLoading && selectionVM.hasChanges"
    color="amber"
    variant="subtle"
    icon="i-heroicons-exclamation-triangle"
    :title="$t('shopManagement.pharmacistSelection.unsavedChanges')"
    :description="$t('shopManagement.pharmacistSelection.unsavedChangesDescription')"
  )

  UCard
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold {{ $t('shopManagement.pharmacistSelection.title') }}
        .flex.items-center.gap-3
          UButton(
            v-if="selectionVM.hasChanges"
            color="gray"
            variant="ghost"
            :label="$t('common.cancel')"
            @click="handleCancelClick"
          )
          UButton(
            v-if="selectionVM.hasChanges"
            color="primary"
            :label="$t('shopManagement.pharmacistSelection.save')"
            :loading="selectionVM.isSaving"
            @click="saveSelection"
          )
          UButton(
            v-else
            color="primary"
            icon="i-heroicons-plus"
            :label="$t('shopManagement.pharmacistSelection.addProduct')"
            @click="openProductModal"
          )

    template(#default)
      div(v-if="selectionVM.isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      div(v-else)
        .mb-6
          p.text-gray-600 {{ $t('shopManagement.pharmacistSelection.description') }}
          .flex.items-center.gap-2.mt-2.text-sm
            span.font-medium.text-gray-900 {{ selectionVM.selectedProducts.length }} {{ $t('shopManagement.pharmacistSelection.productsSelected') }}

        PharmacistSelectionManager(ref="managerRef" :selection-v-m="selectionVM")

  UModal(v-model="showCancelModal")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('shopManagement.pharmacistSelection.cancelChanges') }}
      template(#default)
        p.text-gray-600 {{ $t('shopManagement.pharmacistSelection.cancelChangesConfirm') }}
      template(#footer)
        .flex.justify-end.gap-3
          UButton(
            color="gray"
            variant="ghost"
            :label="$t('common.cancel')"
            @click="showCancelModal = false"
          )
          UButton(
            color="red"
            :label="$t('common.cancel')"
            @click="confirmCancel"
          )
</template>

<script lang="ts" setup>
import PharmacistSelectionManager from '@adapters/primary/nuxt/components/organisms/PharmacistSelectionManager.vue'
import { pharmacistSelectionFormVM } from '@adapters/primary/view-models/pharmacist-selection/pharmacist-selection-form/pharmacistSelectionFormVM'
import { getPharmacistSelection } from '@core/usecases/pharmacist-selection/getPharmacistSelection'
import { updatePharmacistSelection } from '@core/usecases/pharmacist-selection/updatePharmacistSelection'
import { usePharmacistSelectionGateway } from '../../../../../../gateways/pharmacistSelectionGateway'
import { useProductGateway } from '../../../../../../gateways/productGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const pharmacistSelectionGateway = usePharmacistSelectionGateway()
const productGateway = useProductGateway()

const selectionVM = ref(pharmacistSelectionFormVM())
const showCancelModal = ref(false)
const managerRef = ref<InstanceType<typeof PharmacistSelectionManager>>()

onMounted(async () => {
  await getPharmacistSelection(pharmacistSelectionGateway, productGateway)
  selectionVM.value = pharmacistSelectionFormVM()
})

const openProductModal = () => {
  const manager = managerRef.value as any
  if (manager) {
    manager.openModal()
  }
}

const saveSelection = async () => {
  try {
    await updatePharmacistSelection(
      selectionVM.value.getProductUuids(),
      pharmacistSelectionGateway
    )

    const toast = useToast()
    toast.add({
      title: t('shopManagement.pharmacistSelection.updateSuccess'),
      color: 'green'
    })

    navigateTo('/shop-management')
  } catch {
    const toast = useToast()
    toast.add({
      title: t('shopManagement.pharmacistSelection.updateError'),
      color: 'red'
    })
  }
}

const handleBackClick = () => {
  if (selectionVM.value.hasChanges) {
    if (confirm(t('shopManagement.pharmacistSelection.leavePageConfirm'))) {
      navigateTo('/shop-management')
    }
  } else {
    navigateTo('/shop-management')
  }
}

const handleCancelClick = () => {
  showCancelModal.value = true
}

const confirmCancel = () => {
  selectionVM.value.reset()
  showCancelModal.value = false
}

onBeforeRouteLeave((to, from, next) => {
  if (selectionVM.value.hasChanges) {
    if (confirm(t('shopManagement.pharmacistSelection.leavePageConfirm'))) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>

<style scoped>
.pharmacist-selection-container {
  max-width: 900px;
  margin: 0 auto;
}

.product-item {
  transition: all 0.2s ease;
}

.product-item:hover {
  transform: translateX(4px);
}
</style>
