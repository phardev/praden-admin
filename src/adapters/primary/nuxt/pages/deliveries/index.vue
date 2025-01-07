<template lang="pug">
div.hidden.printme.mx-2
  ft-table.mx-2(
    :headers="toPrint.headers"
    :is-loading="toPrint.isLoading"
    :items="toPrint.items"
  )
  div.flex.flex-row-reverse
    div
      p.mb-4 Nombre de colis {{ toPrint.count }}
      time(:datetime='new Date(now)') Le {{ timestampToLocaleString(now, 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      p.mr-0 Signature
      canvas.w-64.h-24.border.border-opposite

.section.no-printme
  ft-table(
    :headers="deliveriesVM.headers"
    :is-loading="deliveriesVM.isLoading"
    :items="deliveriesVM.items"
    :selectable="true"
    :selection="selection.get()"
    @item-selected="selection.toggleSelect"
    @select-all="selection.toggleSelectAll"
  )
    template(#title) Livraisons
    template(#status="{ item }")
      ft-delivery-status-badge(:status="item.status")
  div.flex.flex-row-reverse.gap-4
    ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
      variant="outline"
      @click="validateShipping"
    ) Valider l'expedition
    ft-button.button-default.mt-4.mr-0.py-4.px-4.text-xl(
      variant="outline"
      @click="printResume"
    ) Imprimer récapitulatif
</template>

<script lang="ts" setup>
import { listDeliveries } from '@core/usecases/deliveries/delivery-listing/listDeliveries'
import { useDeliveryGateway } from '../../../../../../gateways/deliveryGateway'
import { getDeliveriesVM } from '@adapters/primary/view-models/deliveries/get-deliveries-vm/getDeliveriesVM'
import { useSelection } from '@adapters/primary/nuxt/composables/useSelection'
import { shipDeliveries } from '@core/usecases/deliveries/delivery-shipping/shipDeliveries'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { timestampToLocaleString } from '@utils/formatters'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listDeliveries(useDeliveryGateway())
})

const now = useDateProvider().now()

const deliveriesVM = computed(() => {
  return getDeliveriesVM()
})

const toPrintHeader = [
  {
    name: 'Numéro de suivi',
    value: 'trackingNumber'
  },
  {
    name: 'Client',
    value: 'client'
  },
  {
    name: 'Poids (kg)',
    value: 'weight'
  }
]

const toPrint = computed(() => {
  const items = deliveriesVM.value.items.filter((item) =>
    selection.get().includes(item.uuid)
  )
  return {
    headers: toPrintHeader,
    items,
    count: items.length
  }
})

const selection = useSelection()

const printResume = () => {
  window.print()
}

const validateShipping = async () => {
  await shipDeliveries(selection.get(), useDeliveryGateway())
  selection.clear()
}
</script>
