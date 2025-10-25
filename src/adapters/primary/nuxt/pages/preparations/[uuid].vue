<template lang="pug">
invoice.hidden.printme.mx-2
.section.no-printme
  h1.text-4xl.font-semibold.text-default Commande \#{{ preparationVM.reference }}
  ft-scanner(
    ref="mainScanner"
    placeholder="Code produit"
    @scanned="scanProductToPreparation"
  )
  ft-preparation-table.mt-4(
    :vm="preparationVM"
  )
  div.w-full.flex.justify-between.items-center.relative
    div.flex.justify-center.items-center.gap-4
      ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
        variant="outline"
        :loading="preparationVM.isLoading"
        @click="save"
      ) Sauvegarder
      ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
        variant="outline"
        :loading="preparationVM.isLoading"
        @click="openActionDialog"
      ) Actions particulières
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canValidate"
      :loading="preparationVM.isLoading"
      @click="validate"
    ) Valider la commande
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canCancel"
      :loading="preparationVM.isLoading"
      @click="cancel"
    ) Annuler la commande
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canAskHowToFinish"
      :loading="preparationVM.isLoading"
      @click="askHowToFinish"
    ) Envoyer demande au client
  div.w-full.flex.justify-between
    .max-w-lg.flex-shrink-0(v-if="preparationVM.customerMessage")
      h1.text-2xl.font-semibold.text-default.mt-8 Note du client
      div.mt-2 {{ preparationVM.customerMessage }}
    .max-w-lg.flex-grow(v-if="preparationVM.messages.length > 0")
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
    @validate-preparation="validate"
    @cancel-preparation="cancel"
  )
</template>

<script lang="ts" setup>
import { getPreparationVM } from '@adapters/primary/view-models/preparations/get-preparation/getPreparationVM'
import { downloadDeliveryLabel } from '@core/usecases/deliveries/delivery-label-download/downloadDeliveryLabel'
import { askClientHowToFinishPreparation } from '@core/usecases/order/ask-client-how-to-finish-preparation/askClientHowToFinishPreparation'
import { cancelPreparation } from '@core/usecases/order/cancel-preparation/cancelPreparation'
import { changeProductEan13ForPreparation } from '@core/usecases/order/change-product-ean13-for-preparation/changeProductEan13ForPreparation'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import { clearPreparationError } from '@core/usecases/order/preparation-error-clearing/clearPreparationError'
import { savePreparation } from '@core/usecases/order/save-preparation/savePreparation'
import { scanProductToPreparation } from '@core/usecases/order/scan-product-to-preparation/scanProductToPreparation'
import { removeProductFromPreparation } from '@core/usecases/order/scan-product-to-remove-fom-preparation/scanProductToRemoveFromPreparation'
import { setProductQuantityForPreparation } from '@core/usecases/order/set-product-quantity-for-preparation/setProductQuantityForPreparation'
import { validatePreparation } from '@core/usecases/order/validate-preparation/validatePreparation'
import { useDeliveryStore } from '@store/deliveryStore'
import { useDeliveryGateway } from '../../../../../../gateways/deliveryGateway'
import { useInvoiceGateway } from '../../../../../../gateways/invoiceGateway'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'

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
  changeProductEan13ForPreparation(oldReference, newReference)
  closeActionsModal()
}

const router = useRouter()

const validate = async () => {
  closeActionsModal()

  const useManualPrint = false

  if (useManualPrint) {
    const newWindow = window.open('about:blank', '_blank')

    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Génération de l'étiquette...</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>Génération de l'étiquette de livraison en cours...</h2>
            <p>Veuillez patienter pendant la validation de la préparation.</p>
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 20px auto;"></div>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </body>
        </html>
      `)
    }

    try {
      await validatePreparation(useOrderGateway(), useInvoiceGateway())
      await manualPrint(newWindow)

      setTimeout(() => {
        window.print()
      }, 100)
    } catch (error) {
      console.error('Error during validation:', error)
      if (newWindow) {
        newWindow.close()
      }
      return
    }
  } else {
    await validatePreparation(useOrderGateway(), useInvoiceGateway())
    window.print()
  }
  router.push('/preparations')
}

const manualPrint = async (newWindow?: Window | null) => {
  if (preparationVM.value.deliveries.length === 0) {
    console.error('No delivery found for this preparation')
    if (newWindow) newWindow.close()
    return
  }
  if (!preparationVM.value.deliveries[0].trackingNumber) {
    console.error('No tracking number found for this delivery')
    if (newWindow) newWindow.close()
    return
  }

  if (!newWindow) {
    console.error('No window available for PDF display')
    return
  }

  try {
    const usecase = downloadDeliveryLabel({
      deliveryGateway: useDeliveryGateway()
    })
    await usecase(preparationVM.value.deliveries[0].uuid)

    const deliveryStore = useDeliveryStore()
    const blob = deliveryStore.labelBlob
    if (blob) {
      const url = window.URL.createObjectURL(blob)

      newWindow.location.href = url

      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
    } else {
      console.error('No blob found')
      newWindow.close()
    }
  } catch (error) {
    console.error('Error downloading label: ', error)
    newWindow.close()
  }
}

const cancel = async () => {
  closeActionsModal()
  await cancelPreparation(useOrderGateway(), useInvoiceGateway())

  setTimeout(() => {
    window.print()
  }, 100)

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
</script>

<style lang="scss" scoped>
.centered {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
