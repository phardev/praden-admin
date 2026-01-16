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

  .mt-6(v-if="!isLoading")
    UCard
      template(#header)
        h2.text-lg.font-semibold {{ $t('shopManagement.loyaltyPoints.configuration') }}

      .space-y-4
        .flex.items-center.gap-4
          UToggle(
            :model-value="formVM?.get('isActive')?.value"
            @update:model-value="(val) => formVM?.set('isActive', val)"
          )
          span {{ $t('shopManagement.loyaltyPoints.isActive') }}

        .flex.flex-col.gap-2
          label.font-medium {{ $t('shopManagement.loyaltyPoints.pointsPerEuro') }}
          UInput(
            type="number"
            :model-value="formVM?.get('pointsPerEuro')?.value"
            :min="0"
            :max="100"
            step="0.1"
            @update:model-value="(val) => formVM?.set('pointsPerEuro', parseFloat(val))"
          )
          p.text-sm.text-gray-500 {{ $t('shopManagement.loyaltyPoints.pointsPerEuroHint') }}

      template(#footer)
        .flex.justify-end
          ft-button.button-solid(
            :disabled="!canSave"
            @click="handleSave"
          )
            | {{ $t('common.save') }}

  .mt-6(v-else)
    .flex.justify-center
      UIcon.animate-spin.text-2xl(name="i-heroicons-arrow-path")
</template>

<script lang="ts" setup>
import type { LoyaltyConfigFormVM } from '@adapters/primary/view-models/loyalty/loyalty-config-form/loyaltyConfigFormVM'
import { loyaltyConfigFormVM } from '@adapters/primary/view-models/loyalty/loyalty-config-form/loyaltyConfigFormVM'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { updateLoyaltyConfig } from '@core/usecases/loyalty/update-loyalty-config/updateLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { useLoyaltyGateway } from '../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const loyaltyGateway = useLoyaltyGateway()
const loyaltyStore = useLoyaltyStore()

const formVM = ref<LoyaltyConfigFormVM | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  await getLoyaltyConfig(loyaltyGateway)
  formVM.value = loyaltyConfigFormVM('loyalty-config')
  isLoading.value = false
})

const canSave = computed(() => {
  return formVM.value?.getCanValidate() ?? false
})

const handleSave = async () => {
  if (!formVM.value) return
  try {
    const dto = formVM.value.getDto()
    await updateLoyaltyConfig(dto, loyaltyGateway)
    toast.add({
      title: t('shopManagement.loyaltyPoints.saveSuccess'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.loyaltyPoints.saveError'),
      color: 'red'
    })
  }
}
</script>
