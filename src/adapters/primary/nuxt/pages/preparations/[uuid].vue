<template lang="pug">
invoice.hidden.printme.mx-2
.section.no-printme
  h1.text-4xl.font-semibold.text-default Commande \#{{ preparationVM.reference }}
  ft-scanner(
    placeholder="Code produit"
    @scanned="scanProductToPreparation"
    @scanner-mounted="mainScannerMounted"
  )
  ft-table(
    :headers="preparationVM.headers"
    :items="preparationVM.lines"
  )
    template(#status="{ item }")
      icon.icon-lg.text-yellow-400(v-if="item.status === PreparationStatus.NotPrepared" name="bx:bxs-error")
      icon.icon-lg.text-grass9(v-if="item.status === PreparationStatus.Prepared" name="material-symbols:check-circle")
      icon.icon-lg.text-tomato8(v-if="item.status > PreparationStatus.Prepared" name="fluent-mdl2:status-error-full")
  div.w-full.flex.justify-between.items-center.relative
    ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
      @click="save"
    ) Sauvegarder
    div.centered
      ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
        @click="errorDialog.open()"
      ) Problème
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canValidate"
      @click="validate"
    ) Valider la commande
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canCancel"
      @click="cancel"
    ) Annuler la commande
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canAskHowToFinish"
      @click="askHowToFinish"
    ) Envoyer demande au client
  .max-w-lg.ml-auto(v-if="preparationVM.messages.length > 0")
    h1.text-2xl.font-semibold.text-default.mt-8 Messages
    ft-messages(
      :messages="preparationVM.messages"
    )
  ft-dialog(
    :is-opened="errorDialog.isOpened()"
    @close="closeErrorDialog"
  )
    div.grid.grid-cols-1.gap-4.mx-10.my-10(class="md:grid-cols-2")
      ft-button.button-solid.h-24.col-span-2(@click="removeAProduct") Retirer un produit
      ft-button.button-solid.h-24.col-span-2 Inserer un produit
  ft-dialog(
    :is-opened="removeProductDialog.isOpened()"
    @close="closeRemoveProductDialog"
  )
    div.centered.w-full.px-10
      ft-scanner(
        placeholder="Code produit à retirer"
        @scanned="removeProduct"
        @scanner-mounted="removeScannerMounted"
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
import { savePreparation } from '@core/usecases/order/save-preparation/savePreparation'
import { cancelPreparation } from '@core/usecases/order/cancel-preparation/cancelPreparation'
import { askClientHowToFinishPreparation } from '@core/usecases/order/ask-client-how-to-finish-preparation/askClientHowToFinishPreparation'
import { removeProductFromPreparation } from '@core/usecases/order/scan-product-to-remove-fom-preparation/scanProductToRemoveFromPreparation'
import { useDialog } from '@adapters/primary/nuxt/composables/useDialog'
import FtScanner from '@adapters/primary/nuxt/components/FtScanner.vue'

definePageMeta({ layout: 'main' })

const route = useRoute()
const preparationUuid = route.params.uuid

onMounted(() => {
  getPreparation(preparationUuid, useOrderGateway())
})

const errorDialog = useDialog()
const removeProductDialog = useDialog()

const mainScanner = ref(null)

const closeErrorDialog = () => {
  errorDialog.close()
  setFocusOnMainScanner()
}

const closeRemoveProductDialog = () => {
  removeProductDialog.close()
  setFocusOnMainScanner()
}

const setFocusOnMainScanner = () => {
  setFocus(mainScanner.value)
}

const removeScannerMounted = (input: any) => {
  setFocus(input)
}

const setFocus = (el: any) => {
  setTimeout(() => {
    el.focus()
  }, 300)
}

const mainScannerMounted = (input: any) => {
  input.focus()
  mainScanner.value = input
}

const removeAProduct = () => {
  openRemoveProduct()
}

const openRemoveProduct = async () => {
  errorDialog.close()
  removeProductDialog.open()
}

const removeProduct = (cip13: string) => {
  removeProductFromPreparation(cip13)
  closeRemoveProductDialog()
  closeErrorDialog()
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
  router.push('/preparations')
}

const askHowToFinish = async () => {
  await savePreparation(useOrderGateway())
  await askClientHowToFinishPreparation(useOrderGateway())
  router.push('/preparations')
}

const save = async () => {
  await savePreparation(useOrderGateway())
  router.push('/preparations')
}

const preparationVM = computed(() => {
  return getPreparationVM()
})
</script>

<style lang="css">
.centered {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
