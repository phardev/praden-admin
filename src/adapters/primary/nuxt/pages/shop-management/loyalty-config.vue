<template lang="pug">
.loyalty-config-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="handleBackClick"
    )

  UAlert.mb-4(
    v-if="!configVM.isLoading && configVM.hasChanges"
    color="amber"
    variant="subtle"
    icon="i-heroicons-exclamation-triangle"
    :title="$t('loyalty.config.unsavedChanges')"
    :description="$t('loyalty.config.unsavedChangesDescription')"
  )
    template(#actions)
      .flex.gap-3
        UButton(
          color="gray"
          variant="ghost"
          :label="$t('common.cancel')"
          @click="handleCancelClick"
        )
        UButton(
          color="primary"
          :label="$t('common.save')"
          :loading="isSaving"
          @click="saveConfig"
        )

  UCard
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold {{ $t('loyalty.config.title') }}

    template(#default)
      .space-y-6(v-if="!configVM.isLoading")
        p.text-gray-600 {{ $t('loyalty.config.description') }}

        UFormGroup(:label="$t('loyalty.config.pointsPerEuro')")
          UInput(
            v-model.number="pointsPerEuro"
            type="number"
            min="0"
            :placeholder="$t('loyalty.config.pointsPerEuroPlaceholder')"
          )

        UFormGroup(:label="$t('loyalty.config.isEnabled')")
          UToggle(v-model="isEnabled")
          span.ml-3.text-sm.text-gray-600
            template(v-if="isEnabled") {{ $t('loyalty.config.systemEnabled') }}
            template(v-else) {{ $t('loyalty.config.systemDisabled') }}

        .flex.justify-end.gap-3
          UButton(
            v-if="configVM.hasChanges"
            color="gray"
            variant="ghost"
            :label="$t('common.reset')"
            @click="configVM.reset"
          )
          UButton(
            color="primary"
            :label="$t('common.save')"
            :loading="isSaving"
            :disabled="!configVM.hasChanges"
            @click="saveConfig"
          )
</template>

<script lang="ts" setup>
import { loyaltyConfigFormVM } from '@adapters/primary/view-models/loyalty-config/loyaltyConfigFormVM'
import { getLoyaltyConfig } from '@core/usecases/loyalty-config/get-loyalty-config/getLoyaltyConfig'
import { updateLoyaltyConfig } from '@core/usecases/loyalty-config/update-loyalty-config/updateLoyaltyConfig'
import { useLoyaltyConfigGateway } from '../../../../../../gateways/loyaltyConfigGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const loyaltyConfigGateway = useLoyaltyConfigGateway()

const configVM = ref(loyaltyConfigFormVM())
const isSaving = ref(false)

const pointsPerEuro = computed({
  get: () => configVM.value.pointsPerEuro,
  set: (value: number) => configVM.value.setPointsPerEuro(value)
})

const isEnabled = computed({
  get: () => configVM.value.isEnabled,
  set: (value: boolean) => configVM.value.setIsEnabled(value)
})

onMounted(async () => {
  await getLoyaltyConfig(loyaltyConfigGateway)
  configVM.value = loyaltyConfigFormVM()
  configVM.value.initForm()
})

const saveConfig = async () => {
  try {
    isSaving.value = true
    await updateLoyaltyConfig(
      configVM.value.getFormData(),
      loyaltyConfigGateway
    )

    const toast = useToast()
    toast.add({
      title: t('loyalty.config.updateSuccess'),
      color: 'green'
    })

    configVM.value = loyaltyConfigFormVM()
    configVM.value.initForm()
  } catch {
    const toast = useToast()
    toast.add({
      title: t('loyalty.config.updateError'),
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}

const handleBackClick = () => {
  if (configVM.value.hasChanges) {
    if (confirm(t('loyalty.config.leavePageConfirm'))) {
      navigateTo('/shop-management')
    }
  } else {
    navigateTo('/shop-management')
  }
}

const handleCancelClick = () => {
  configVM.value.reset()
}

onBeforeRouteLeave((to, from, next) => {
  if (configVM.value.hasChanges) {
    if (confirm(t('loyalty.config.leavePageConfirm'))) {
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
.loyalty-config-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
