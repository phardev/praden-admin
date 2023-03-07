<template lang="pug">
invoice.hidden.printme.mx-2
.section.no-printme
  h1.text-4xl.font-semibold.text-default Commande \#{{ preparationVM.reference }}
  input.mt-8.w-full.rounded-full.border-opposite(
    ref="scanner"
    type='text'
    placeholder='Code produit'
    :value="scan"
    @keyup.enter="addProduct"
  )
  ft-table(
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
  div.w-full.flex.justify-between
    ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
      @click="save"
    ) Sauvegarder
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canValidate"
      @click="validate"
    ) Valider la commande
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canCancel"
      @click="cancel"
    ) Annuler la commande
  .max-w-lg.ml-auto(v-if="preparationVM.messages.length > 0")
    h1.text-2xl.font-semibold.text-default.mt-8 Messages
    ft-messages(
      :messages="preparationVM.messages"
    )
</template>

<script lang="ts" setup>
import { definePageMeta } from '../../../../../../.nuxt/imports'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import {
  getPreparationVM,
  PreparationStatus
} from '@adapters/primary/view-models/get-preparation/getPreparationVM'
import { scanProductToPreparation } from '@core/usecases/order/scan-product-to-preparation/scanProductToPreparation'
import { validatePreparation } from '@core/usecases/order/validate-preparation/validatePreparation'
import { useInvoiceGateway } from '../../../../../../gateways/invoiceGateway'
import { setProductQuantityForPreparation } from '@core/usecases/order/set-product-quantity-for-preparation/setProductQuantityForPreparation'
import { savePreparation } from '@core/usecases/order/save-preparation/savePreparation'
import { cancelPreparation } from '@core/usecases/order/cancel-preparation/cancelPreparation'

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
  scanProductToPreparation(e.target.value)
  scan.value = ''
}

const setQuantity = (e: any, item: any) => {
  const newQuantity = +e.target.value
  setProductQuantityForPreparation(item.reference, newQuantity)
}

const router = useRouter()

const validate = async () => {
  await validatePreparation(useOrderGateway(), useInvoiceGateway())
  window.print()
  router.push('/preparations')
}

const cancel = async () => {
  await cancelPreparation(useOrderGateway(), useInvoiceGateway())
  window.print()
  // router.push('/preparations')
}

const save = async () => {
  await savePreparation(useOrderGateway())
  router.push('/preparations')
}

const preparationVM = computed(() => {
  return getPreparationVM()
})
</script>
