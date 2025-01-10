<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer code promotion
  promotion-code-form(
    :vm="vm"
    @validate="edit"
  )
</template>

<script lang="ts" setup>
import { getPromotionCode } from '@core/usecases/promotion-codes/get-promotion-code/getPromotionCode'
import { usePromotionCodeGateway } from '../../../../../../../gateways/promotionCodeGateway'
import { promotionCodeFormEditVM } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormEditVM'
import { editPromotionCode } from '@core/usecases/promotion-codes/promotion-code-edition/editPromotionCode'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const code = route.params.code
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  await getPromotionCode(code, usePromotionCodeGateway())
  vm.value = promotionCodeFormEditVM(routeName)
})

const edit = async () => {
  await editPromotionCode(code, vm.value.getDto(), usePromotionCodeGateway())
  router.push('/promotion-codes')
}
</script>
