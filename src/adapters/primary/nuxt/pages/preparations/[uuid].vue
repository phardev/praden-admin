<template lang="pug">
invoice.hidden.printme.mx-2
.section.no-printme
  pre {{ test }}
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
    template(#status="{ item }")
      icon.icon-lg.text-yellow-400(v-if="item.status === PreparationStatus.NotPrepared" name="bx:bxs-error")
      icon.icon-lg.text-grass9(v-if="item.status === PreparationStatus.Prepared" name="material-symbols:check-circle")
      icon.icon-lg.text-tomato8(v-if="item.status > PreparationStatus.Prepared" name="fluent-mdl2:status-error-full")
  div.w-full.flex.justify-between.items-center.relative
    ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
      @click="save"
    ) Sauvegarder
    div.centered
      ft-button.button-error.mt-4.mr-0.py-4.px-4.text-xl(
        @click="errorDialog.open()"
      ) Erreur
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
  TransitionRoot(:show="errorDialog.isOpened()")
    Dialog.fixed.inset-0.z-40(
      as="div"
      @close="errorDialog.close()"
    )
      TransitionChild(
        as="template"
        enter="transition ease-in-out duration-200 transform"
        enter-from="-translate-x-full"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-200 transform"
        leave-from="translate-x-0"
        leave-to="-translate-x-full"
      )
        div.flex.flex-col.relative.z-10.bg-light.border-r.border-neutral-light.centered(class="w-1/2 h-1/2")
          button.absolute.top-2.right-2.flex.items-center.justify-center.w-10.h-10.rounded-full(
            type="button"
            value="closeSidebar"
            class="focus:outline-none focus:ring-2 focus:ring-neutral"
            @click="errorDialog.close()"
          )
            icon.icon-sm(name="heroicons:x-mark")
          div.grid.grid-cols-1.gap-4.mx-10.my-10(class="md:grid-cols-2")
            ft-button.button-default.h-24.col-span-2(@click="removeAProduct") Retirer un produit
      TransitionChild(
        as="template"
        enter="transition-opacity ease-linear duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      )
        DialogOverlay.fixed.inset-0.bg-backdrop
  TransitionRoot(:show="removeProductDialog.isOpened()")
    Dialog.fixed.inset-0.z-40(
      as="div"
      @close="removeProductDialog.close()"
    )
      TransitionChild(
        as="template"
        enter="transition ease-in-out duration-200 transform"
        enter-from="-translate-x-full"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-200 transform"
        leave-from="translate-x-0"
        leave-to="-translate-x-full"
      )
        div.flex.flex-col.relative.z-10.bg-light.border-r.border-neutral-light.centered(class="w-1/2 h-1/2")
          button.absolute.top-2.right-2.flex.items-center.justify-center.w-10.h-10.rounded-full(
            type="button"
            value="closeSidebar"
            class="focus:outline-none focus:ring-2 focus:ring-neutral"
            @click="removeProductDialog.close()"
          )
            icon.icon-sm(name="heroicons:x-mark")
          div.centered.w-full.px-10
            input.w-full.rounded-full.border-opposite(
              ref="removeScanner"
              type='text'
              placeholder='Code produit à retirer'
              :value="removeScan"
              @keyup.enter="removeProduct"
            )
      TransitionChild(
        as="template"
        enter="transition-opacity ease-linear duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      )
        DialogOverlay.fixed.inset-0.bg-backdrop

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
import { useMessageGateway } from '../../../../../../gateways/messageGateway'
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { removeProductFromPreparation } from '@core/usecases/order/scan-product-to-remove-fom-preparation/scanProductToRemoveFromPreparation'
import { useDialog } from '@adapters/primary/nuxt/composables/useDialog'

definePageMeta({ layout: 'main' })

const route = useRoute()
const preparationUuid = route.params.uuid

onMounted(() => {
  getPreparation(preparationUuid, useOrderGateway())
  scanner.value.focus()
})

const scanner = ref(null)
const removeScanner = ref(null)
const scan = ref('')
const removeScan = ref('')

const errorDialog = useDialog()

const removeAProduct = () => {
  errorDialog.close()
  openRemoveProduct()
}

const removeProductDialog = useDialog()

const openRemoveProduct = async () => {
  removeProductDialog.open()
  await nextTick()
  removeScanner.value.focus()
}

const addProduct = (e: any) => {
  scanProductToPreparation(e.target.value)
  scan.value = ''
}

const removeProduct = (e: any) => {
  removeProductFromPreparation(e.target.value)
  removeScan.value = ''
  closeRemoveProduct()
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
  await askClientHowToFinishPreparation(useOrderGateway(), useMessageGateway())
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
