<template lang="pug">
.section
  h1.text-4xl.font-semibold.text-default Commande \#{{ preparationVM.reference }}
  input.mt-8.w-full.rounded-full.border-opposite(
    ref="scanner"
    type='text'
    placeholder='Code produit'
    :value="scan"
    @keyup.enter="addProduct"
  )
  fv-table(
    :headers="preparationVM.headers"
    :items="preparationVM.lines"
  )
    template(#preparedQuantity="{ item }")
      input.rounded-full.w-24(
        type="number"
        :value="item.preparedQuantity"
        @input="setQuantity($event, item)"
        @keyup.enter="scanner.focus()"
      )
    template(#status="{ item }")
      icon.icon-lg.text-yellow-400(v-if="item.status === PreparationStatus.NotPrepared" name="bx:bxs-error")
      icon.icon-lg.text-grass9(v-if="item.status === PreparationStatus.Prepared" name="material-symbols:check-circle")
      icon.icon-lg.text-tomato8(v-if="item.status > PreparationStatus.Prepared" name="fluent-mdl2:status-error-full")
  div.w-full.flex.flex-row-reverse
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canValidate"
      @click="validate"
    ) Valider la commande
</template>

<script lang="ts" setup>
import { definePageMeta } from '../../../../../../.nuxt/imports'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import {
  getPreparationVM,
  PreparationStatus
} from '@adapters/primary/view-models/get-preparation/getPreparationVM'
import { addProductToPreparation } from '@core/usecases/order/add-product-to-preparation/addProductToPreparation'
import { validatePreparation } from '@core/usecases/order/validate-preparation/validatePreparation'
import { useInvoiceGateway } from '../../../../../../gateways/invoiceGateway'

definePageMeta({ layout: 'main' })

const route = useRoute()
const preparationUuid = route.params.uuid

onMounted(() => {
  getPreparation(preparationUuid, useOrderGateway())
  scanner.value.focus()
})

const scanner = ref(null)
const scan = ref('')

const addProduct = (e: any) => {
  addProductToPreparation(e.target.value)
  scan.value = ''
}

const setQuantity = (e: any, item: any) => {
  const newQuantity = +e.target.value
  const quantityToAdd = newQuantity - item.preparedQuantity
  addProductToPreparation(item.reference, quantityToAdd)
}

const router = useRouter()

const validate = async () => {
  await validatePreparation(useOrderGateway(), useInvoiceGateway())
  router.push('/preparations')
}

const preparationVM = computed(() => {
  return getPreparationVM()
})
</script>
