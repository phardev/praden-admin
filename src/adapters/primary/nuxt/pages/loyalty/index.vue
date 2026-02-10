<template lang="pug">
.loyalty-config-container.p-6
  .mb-4.flex.items-center.justify-between
    h1.text-2xl.font-bold {{ $t('loyalty.title') }}
    UButton(
      color="gray"
      icon="i-heroicons-list-bullet"
      :label="$t('loyalty.multipliers.title')"
      @click="navigateTo('/loyalty/multipliers')"
    )

  UCard
    template(#header)
      h2.text-lg.font-semibold {{ $t('loyalty.config.title') }}

    template(#default)
      div(v-if="isLoading")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      form.space-y-6(v-else @submit.prevent="onSubmit")
        UFormGroup(
          :label="$t('loyalty.config.pointsRatio')"
          :hint="$t('loyalty.config.pointsRatioHelp')"
        )
          UInput(
            v-model.number="formData.pointsRatio"
            type="number"
            min="1"
          )

        .flex.justify-end
          UButton(
            type="submit"
            color="primary"
            :label="$t('loyalty.config.save')"
            :loading="isSaving"
          )
</template>

<script lang="ts" setup>
import { getLoyaltyConfigVM } from '@adapters/primary/view-models/loyalty/loyaltyConfigVM'
import { getLoyaltyConfig } from '@core/usecases/loyalty/getLoyaltyConfig'
import { updateLoyaltyConfig } from '@core/usecases/loyalty/updateLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { useLoyaltyGateway } from '../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const loyaltyStore = useLoyaltyStore()
const loyaltyGateway = useLoyaltyGateway()

const isLoading = computed(() => loyaltyStore.isLoading)
const isSaving = ref(false)

const formData = ref({
  pointsRatio: 10
})

onMounted(async () => {
  loyaltyStore.startLoading()
  await getLoyaltyConfig(loyaltyGateway)
  const vm = getLoyaltyConfigVM()
  if (vm) {
    formData.value.pointsRatio = vm.pointsRatio
  }
  loyaltyStore.stopLoading()
})

const onSubmit = async () => {
  isSaving.value = true

  try {
    await updateLoyaltyConfig(
      { pointsRatio: formData.value.pointsRatio },
      loyaltyGateway
    )

    const toast = useToast()
    toast.add({
      title: t('loyalty.config.updateSuccess'),
      color: 'green'
    })
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
</script>

<style scoped>
.loyalty-config-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
