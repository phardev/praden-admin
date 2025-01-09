<template lang="pug">
  .section(v-if="vm")
    .flex.flex-row-reverse
      ft-button.button-solid.text-xl.px-6(@click="edit") Editer code promotion
    h1.text-title Voir code promotion
    promotion-code-form(
      :vm="vm"
    )
</template>

<script lang="ts" setup>
import { promotionCodeFormGetVM } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormGetVM'
import { getPromotionCode } from '@core/usecases/promotion-codes/get-promotion-code/getPromotionCode'
import { usePromotionCodeGateway } from '../../../../../../../gateways/promotionCodeGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const code = route.params.code
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  await getPromotionCode(code, usePromotionCodeGateway())
  vm.value = promotionCodeFormGetVM(routeName)
})

const edit = () => {
  // router.push(`/promotions/edit/${promotionUuid}`)
}
</script>
