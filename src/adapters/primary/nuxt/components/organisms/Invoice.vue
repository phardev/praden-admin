<template lang="pug">
.invoice
  div.flex.flex-row-reverse
    div.text-right
      div.text-xl Facture
      time.text-contrast(:datetime="invoiceVM.createdDatetime") {{ invoiceVM.createdDate }}
      div.text-contrast \#{{ invoiceVM.invoiceNumber }}
  div.flex.items-end.justify-between.mt-4
    div.shrink.w-72
      div {{ invoiceVM.supplierAddress.name }}
      div {{ invoiceVM.supplierAddress.address }}
      div {{ invoiceVM.supplierAddress.zip }}
      div {{ invoiceVM.supplierAddress.city }}
      div {{ invoiceVM.supplierAddress.phone }}
    div
      div.text-lg.mb-2 Adresse de livraison
      div {{ invoiceVM.deliveryAddress.name }}
      div {{ invoiceVM.deliveryAddress.address }}
      div {{ invoiceVM.deliveryAddress.zip }}
      div {{ invoiceVM.deliveryAddress.city }}
      div {{ invoiceVM.deliveryAddress.phone }}
    div
      div.text-lg.mb-2 Adresse de facturation
      div {{ invoiceVM.billingAddress.name }}
      div {{ invoiceVM.billingAddress.address }}
      div {{ invoiceVM.billingAddress.zip }}
      div {{ invoiceVM.billingAddress.city }}
      div {{ invoiceVM.billingAddress.phone }}
  ft-table(
    :headers="invoiceVM.summaryTable.headers"
    :items="invoiceVM.summaryTable.items"
  )
  ft-table(
    v-if="invoiceVM.orderLinesTable.items.length"
    :headers="invoiceVM.orderLinesTable.headers"
    :items="invoiceVM.orderLinesTable.items"
  )
  ft-table(
    v-if="invoiceVM.refundOrderLinesTable.items.length"
    :headers="invoiceVM.refundOrderLinesTable.headers"
    :items="invoiceVM.refundOrderLinesTable.items"
  )
  div.flex.items-top.justify-between.mt-4
    ft-table(
      class="w-1/2"
      :headers="invoiceVM.taxDetailsTable.headers"
      :items="invoiceVM.taxDetailsTable.items"
    )
    div(class="w-1/2").border.border-light.ml-8
      div.flex.items-center.justify-around.m-2
        div(class="w-1/2") Total Produits
        div.text-right(class="w-1/2") {{ invoiceVM.totals.linesTotal }}
      div.flex.items-center.justify-around.p-2.border-t.border-light
        div(class="w-1/2") Total (HT)
        div.text-right(class="w-1/2") {{ invoiceVM.totals.totalWithoutTax }}
      div.flex.items-center.justify-around.p-2.border-t.border-light
        div(class="w-1/2") Total taxes
        div.text-right(class="w-1/2") {{ invoiceVM.totals.totalTax }}
      div.flex.items-center.justify-around.p-2.border-t.border-light(v-if="invoiceVM.refundOrderLinesTable.items.length")
        div(class="w-1/2") Total remboursé (TTC)
        div.text-right(class="w-1/2") {{ invoiceVM.totals.totalRefund }}
      div.flex.items-center.justify-around.p-2.border-t.border-light
        div(class="w-1/2") Total (TTC)
        div.text-right(class="w-1/2") {{ invoiceVM.totals.totalWithTax }}
</template>

<script lang="ts" setup>
import { getInvoiceVM } from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'

const invoiceVM = computed(() => {
  return getInvoiceVM()
})
</script>
