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

  h1.text-page-title {{ $t('shopManagement.loyaltyPoints.title') }}
  p.text-gray-600.mb-6 {{ $t('shopManagement.loyaltyPoints.description') }}

  UCard.max-w-xl
    UForm(:state="formState" @submit="handleSubmit")
      UFormGroup.mb-4(
        :label="$t('shopManagement.loyaltyPoints.pointsPerEuro')"
        :help="$t('shopManagement.loyaltyPoints.pointsPerEuroHelp')"
        name="pointsPerEuro"
      )
        UInput(
          v-model="formState.pointsPerEuro"
          type="number"
          :min="0"
        )

      UFormGroup.mb-4(
        :label="$t('shopManagement.loyaltyPoints.minimumOrderAmount')"
        :help="$t('shopManagement.loyaltyPoints.minimumOrderAmountHelp')"
        name="minimumOrderAmount"
      )
        UInput(
          v-model="formState.minimumOrderAmount"
          type="number"
          :min="0"
        )

      UFormGroup.mb-6(
        :label="$t('shopManagement.loyaltyPoints.isActive')"
        :help="$t('shopManagement.loyaltyPoints.isActiveHelp')"
        name="isActive"
      )
        UToggle(v-model="formState.isActive")
        span.ml-2.text-sm(
          :class="formState.isActive ? 'text-green-600' : 'text-gray-500'"
        )
          | {{ formState.isActive ? $t('shopManagement.loyaltyPoints.active') : $t('shopManagement.loyaltyPoints.inactive') }}

      UButton(
        type="submit"
        color="primary"
        :loading="isLoading"
      )
        | {{ $t('shopManagement.loyaltyPoints.save') }}
</template>

<script lang="ts" setup>
import { getLoyaltyPointsConfig } from '@core/usecases/loyalty-points-config/get-loyalty-points-config/getLoyaltyPointsConfig'
import { updateLoyaltyPointsConfig } from '@core/usecases/loyalty-points-config/update-loyalty-points-config/updateLoyaltyPointsConfig'
import { useLoyaltyPointsConfigStore } from '@store/loyaltyPointsConfigStore'
import { useLoyaltyPointsConfigGateway } from '../../../../../../gateways/loyaltyPointsConfigGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const loyaltyPointsConfigGateway = useLoyaltyPointsConfigGateway()
const loyaltyPointsConfigStore = useLoyaltyPointsConfigStore()

const isLoading = ref(false)

const formState = reactive({
  pointsPerEuro: 1,
  minimumOrderAmount: 0,
  isActive: true
})

onMounted(async () => {
  await getLoyaltyPointsConfig(loyaltyPointsConfigGateway)
  const config = loyaltyPointsConfigStore.config
  if (config) {
    formState.pointsPerEuro = config.pointsPerEuro
    formState.minimumOrderAmount = config.minimumOrderAmount
    formState.isActive = config.isActive
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await updateLoyaltyPointsConfig(
      {
        pointsPerEuro: Number(formState.pointsPerEuro),
        minimumOrderAmount: Number(formState.minimumOrderAmount),
        isActive: formState.isActive
      },
      loyaltyPointsConfigGateway
    )
    toast.add({
      title: t('shopManagement.loyaltyPoints.updateSuccess'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.loyaltyPoints.updateError'),
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
