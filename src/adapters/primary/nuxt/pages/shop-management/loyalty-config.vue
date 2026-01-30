<template lang="pug">
.loyalty-config-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management')"
    )

  UCard
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold {{ $t('loyalty.configTitle') }}
        icon(name="i-heroicons-gift" class="text-2xl text-primary")

    template(#default)
      .space-y-6
        UFormGroup(
          :label="$t('loyalty.eurosPerPoint')"
          :help="$t('loyalty.eurosPerPointHelp')"
        )
          UInput(
            v-model.number="eurosPerPoint"
            type="number"
            min="1"
            :placeholder="$t('loyalty.eurosPerPoint')"
          )

        .flex.justify-end
          UButton(
            color="primary"
            :label="$t('loyalty.saveConfig')"
            :loading="isSaving"
            :disabled="!vm.hasChanges"
            @click="saveConfig"
          )
</template>

<script lang="ts" setup>
import { loyaltyConfigVM } from '@adapters/primary/view-models/loyalty/loyalty-config/loyaltyConfigVM'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { updateLoyaltyConfig } from '@core/usecases/loyalty/update-loyalty-config/updateLoyaltyConfig'
import { useLoyaltyGateway } from '../../../../../../gateways/loyaltyGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const loyaltyGateway = useLoyaltyGateway()
const isSaving = ref(false)

const vm = ref(loyaltyConfigVM())

const eurosPerPoint = computed({
  get: () => vm.value.eurosPerPoint,
  set: (value: number) => vm.value.setEurosPerPoint(value)
})

onMounted(async () => {
  await getLoyaltyConfig(loyaltyGateway)
  vm.value = loyaltyConfigVM()
})

const saveConfig = async () => {
  isSaving.value = true
  try {
    await updateLoyaltyConfig(vm.value.getConfigForSave(), loyaltyGateway)

    const toast = useToast()
    toast.add({
      title: t('loyalty.configSaved'),
      color: 'green'
    })

    vm.value = loyaltyConfigVM()
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.loyalty-config-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
