<template lang="pug">
invoice.hidden.printme.mx-2
.section.no-printme
  h1.text-4xl.font-semibold.text-default Commande \#{{ preparationVM.reference }}
  ft-scanner(
    ref="mainScanner"
    placeholder="Code produit"
    @scanned="scanProductToPreparation"
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
    div.flex.justify-center.items-center.gap-4
      ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
        variant="outline"
        @click="save"
      ) Sauvegarder
      ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
        variant="outline"
        @click="openActionDialog"
      ) Actions particulières
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
  ft-preparation-error-modal(
    v-model="isErrorModalOpened"
    :error="errorMessage"
    @close="closeErrorModal"
  )
  ft-preparation-actions-modal(
    v-model="isActionModalOpened"
    :products="products"
    @close="closeActionsModal"
    @remove-product="removeProduct"
    @change-quantity="changeProductQuantity"
    @change-reference="changeProductReference"
  )
</template>

<script lang="ts" setup>
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import {
  getPreparationVM,
  PreparationStatus
} from '@adapters/primary/view-models/preparations/get-preparation/getPreparationVM'
import { scanProductToPreparation } from '@core/usecases/order/scan-product-to-preparation/scanProductToPreparation'
import { validatePreparation } from '@core/usecases/order/validate-preparation/validatePreparation'
import { useInvoiceGateway } from '../../../../../../gateways/invoiceGateway'
import { savePreparation } from '@core/usecases/order/save-preparation/savePreparation'
import { cancelPreparation } from '@core/usecases/order/cancel-preparation/cancelPreparation'
import { askClientHowToFinishPreparation } from '@core/usecases/order/ask-client-how-to-finish-preparation/askClientHowToFinishPreparation'
import { removeProductFromPreparation } from '@core/usecases/order/scan-product-to-remove-fom-preparation/scanProductToRemoveFromPreparation'
import { setProductQuantityForPreparation } from '@core/usecases/order/set-product-quantity-for-preparation/setProductQuantityForPreparation'
import { changeProductCip13ForPreparation } from '@core/usecases/order/change-product-cip13-for-preparation/changeProductCip13ForPreparation'
import { clearPreparationError } from '@core/usecases/order/preparation-error-clearing/clearPreparationError'

definePageMeta({ layout: 'main' })

const route = useRoute()
const preparationUuid = route.params.uuid

onMounted(() => {
  getPreparation(preparationUuid, useOrderGateway())
})

const mainScanner = ref(null)

const closeActionsModal = () => {
  isActionModalOpened.value = false
  setFocusOnMainScanner()
}

const closeErrorModal = () => {
  clearPreparationError()
  setFocusOnMainScanner()
}

const setFocusOnMainScanner = () => {
  nextTick(() => {
    setTimeout(() => {
      setFocus(mainScanner.value)
    }, 300)
  })
}

const setFocus = (el: any) => {
  const input = el.$el.querySelector('input')
  input.focus()
}

const products = computed(() => {
  return preparationVM.value.lines.map((l) => l)
})

const isActionModalOpened = ref(false)

const openActionDialog = (e: any) => {
  e.preventDefault()
  isActionModalOpened.value = true
}

const removeProduct = (cip13: string) => {
  removeProductFromPreparation(cip13)
  closeActionsModal()
}

const changeProductQuantity = (cip13: string, quantity: number) => {
  setProductQuantityForPreparation(cip13, quantity)
  closeActionsModal()
}

const changeProductReference = (oldReference: string, newReference: string) => {
  console.log(oldReference, ' => ', newReference)
  changeProductCip13ForPreparation(oldReference, newReference)
  closeActionsModal()
}

const router = useRouter()

const validate = async () => {
  await validatePreparation(useOrderGateway(), useInvoiceGateway())
  // window.print()
  router.push('/preparations')
}

const cancel = async () => {
  await cancelPreparation(useOrderGateway(), useInvoiceGateway())
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

const isErrorModalOpened = ref(false)
const errorMessage = ref('')

watch(
  () => preparationVM.value.error,
  (newValue) => {
    if (newValue) {
      errorMessage.value = `Le produit ${newValue.value} n'est pas attendu dans cette préparation`
    }
    isErrorModalOpened.value = !!newValue
  },
  { immediate: true }
)
// const isErrorModalOpened = computed(() => {
//   console.log('plop')
//   return preparationVM.value.error
// })
</script>

<style lang="scss" scoped>
.centered {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
