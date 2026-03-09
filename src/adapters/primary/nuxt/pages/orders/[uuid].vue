<template lang="pug">
.section
  h1.text-4xl.font-semibold.text-default Commande \#{{ orderVM.reference }}
  div.flex.items-start.justify-between.mt-8
    div
      h3.text-subtitle.mb-4 Nom
      div {{ orderVM.deliveryAddress.name }}
      h3.text-subtitle.my-4 Adresse
      div {{ orderVM.deliveryAddress.address }}
      div {{ orderVM.deliveryAddress.zip }}
      div {{ orderVM.deliveryAddress.city }}
      h3.text-subtitle.my-4 Contact
      div {{ orderVM.deliveryAddress.phone }}
      div {{ orderVM.customer.email }}
    div.flex.flex-col.justify-around.items-start.space-y-4
      div.flex.items-center
        p Statut de commande :
        ft-order-status-badge.ml-2(:status="orderVM.orderStatus")
      div.flex.items-center
        p Statut de livraison
        ft-delivery-status-badge.ml-2(:status="orderVM.deliveryStatus")
      div.flex.items-center
        p Statut du paiement :
        ft-payment-status-badge.ml-2(:status="orderVM.paymentStatus")
  ft-preparation-table(:vm="preparationVM")
  div.flex.flex-row-reverse.gap-4
    div(v-if="orderVM.invoiceNumber")
      ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
        variant="outline"
        @click="getInvoice"
      ) Voir facture
  div.w-full.flex.justify-between
    .max-w-lg.flex-shrink-0(v-if="preparationVM.customerMessage")
      h1.text-2xl.font-semibold.text-default.mt-8 Note du client
      div.mt-2 {{ preparationVM.customerMessage }}
    .max-w-lg.flex-grow(v-if="preparationVM.messages.length > 0")
      h1.text-2xl.font-semibold.text-default.mt-8 Messages
      ft-messages(
        :messages="preparationVM.messages"
      )
  ft-deliveries-table.mt-8(
    v-if="orderVM.deliveries.length"
    :headers="orderVM.deliveriesHeaders"
    :is-loading="orderVM.isLoading"
    :items="orderVM.deliveries"
  )
    template(#title) Livraison
    template(#actions="{ item }")
      div.flex.items-center.gap-4
        nuxt-link(
          v-if="item.followUrl"
          :to="item.followUrl"
          target="_blank"
        )
          ft-button.button-default.py-4.px-4(variant="outline" @click.stop) Suivre le colis
        ft-button.button-default.py-4.px-4(
          v-if="item.canMarkAsDelivered"
          variant="outline"
          @click="markAsDelivered(item)"
        ) Marquer comme livré
        ft-button.button-default.py-4.px-4(
          v-if="item.followUrl"
          variant="outline"
          @click="printLabel(item)"
        ) Etiquette
        ft-button.button-default.py-4.px-4(
          v-if="item.followUrl"
          variant="outline"
          @click="downloadLabel(item)"
        ) Télécharger
  h2.text-subtitle.mt-8 {{ $t('orders.supportTickets') }}
  order-tickets-list(:order-uuid="orderUuid")

</template>

<script lang="ts" setup>
import { getOrderVM } from '@adapters/primary/view-models/orders/get-order/getOrderVM'
import { getPreparationVM } from '@adapters/primary/view-models/preparations/get-preparation/getPreparationVM'
import { downloadDeliveryLabel } from '@core/usecases/deliveries/delivery-label-download/downloadDeliveryLabel'
import { printDeliveryLabel } from '@core/usecases/deliveries/delivery-label-printing/printDeliveryLabel'
import { markDeliveryAsDelivered } from '@core/usecases/deliveries/mark-delivery-as-delivered/markDeliveryAsDelivered'
import { getOrder } from '@core/usecases/order/get-order/getOrder'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import { getOrderTickets } from '@core/usecases/support/getOrderTickets'
import { useDeliveryStore } from '@store/deliveryStore'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'
import { useDeliveryGateway } from '../../../../../../gateways/deliveryGateway'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { useTicketGateway } from '../../../../../../gateways/ticketGateway'

definePageMeta({ layout: 'main' })

const route = useRoute()
const orderUuid = String(route.params.uuid)
const router = useRouter()
const deliveryStore = useDeliveryStore()

onMounted(() => {
  getPreparation(orderUuid, useOrderGateway())
  getOrder(orderUuid, useOrderGateway(), useCustomerGateway())
  getOrderTickets(orderUuid, useTicketGateway())
})

const preparationVM = computed(() => {
  return getPreparationVM()
})

const orderVM = computed(() => {
  return getOrderVM()
})

const printLabel = (delivery: { uuid: string }) => {
  printDeliveryLabel(delivery.uuid, useDeliveryGateway())
}

const downloadLabel = async (delivery: { uuid: string }) => {
  const newWindow = window.open('about:blank', '_blank')

  if (!newWindow) {
    return
  }

  try {
    const usecase = downloadDeliveryLabel({
      deliveryGateway: useDeliveryGateway()
    })
    await usecase(delivery.uuid)

    const blob = deliveryStore.labelBlob
    if (blob) {
      const url = window.URL.createObjectURL(blob)

      newWindow.location.href = url

      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
    } else {
      newWindow.close()
    }
  } catch (error) {
    console.error('Error downloading label: ', error)
    newWindow.close()
  }
}

const markAsDelivered = async (delivery: { uuid: string }) => {
  await markDeliveryAsDelivered(delivery.uuid, useDeliveryGateway())
  router.push('/orders/')
}

const getInvoice = () => {
  const encodedInvoiceNumber = encodeURIComponent(orderVM.value.invoiceNumber!)
  router.push(`/invoices/${encodedInvoiceNumber}`)
}
</script>

<style lang="scss" scoped>
.centered {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
