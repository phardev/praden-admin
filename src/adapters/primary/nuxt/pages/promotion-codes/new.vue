<template lang="pug">
.section
  h1.text-title Créer nouveau code promotion
  promotion-code-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { useDiscountCodeErrorToast } from '@adapters/primary/nuxt/composables/useDiscountCodeErrorToast'
import { promotionCodeFormCreateVM } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormCreateVM'
import { createPromotionCode } from '@core/usecases/promotion-codes/promotion-code-creation/createPromotionCode'
import { usePromotionCodeGateway } from '../../../../../../gateways/promotionCodeGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')
const vm = ref(promotionCodeFormCreateVM(routeName))

const { showDiscountCodeError } = useDiscountCodeErrorToast()

const validate = async () => {
  try {
    await createPromotionCode(vm.value.getDto(), usePromotionCodeGateway())
    router.push('/promotion-codes/')
  } catch (error) {
    showDiscountCodeError(error)
  }
}
</script>
