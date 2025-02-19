<template lang="pug">
.invoice-component
  .page-footer.hidden.printme
    .footer.text-center.w-full.text-xs.font-light
      div {{ invoiceVM.supplierAddress.name }} - {{ invoiceVM.supplierAddress.address }}
        br
        | {{ invoiceVM.supplierAddress.zip }} - {{ invoiceVM.supplierAddress.city }} - France
        br
        | Pour toute assistance, merci de nous contacter :
        br
        | Tél : {{ invoiceVM.supplierAddress.phone }}
        br
        | Numéro de Siret: 494 972 664 00028
  table
    tbody
      tr
        td
          .invoice
            div.flex.flex-row-reverse
              div.text-right
                div.text-xl Facture
                time.text-contrast(:datetime="invoiceVM.createdDatetime") {{ invoiceVM.createdDate }}
                div.text-contrast {{ invoiceVM.invoiceNumber }}
            div.flex.items-end.justify-between
              div.shrink.w-72
                div {{ invoiceVM.supplierAddress.name }}
                div {{ invoiceVM.supplierAddress.address }}
                div {{ invoiceVM.supplierAddress.zip }}
                div {{ invoiceVM.supplierAddress.city }}
                div {{ invoiceVM.supplierAddress.phone }}
                div {{ invoiceVM.customer.email }}
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
            ft-table.mt-4(
              :headers="invoiceVM.summaryTable.headers"
              :items="invoiceVM.summaryTable.items"
            )
            ft-table.mt-4(
              v-if="invoiceVM.orderLinesTable.items.length"
              :headers="invoiceVM.orderLinesTable.headers"
              :items="invoiceVM.orderLinesTable.items"
            )
            ft-table.mt-4(
              v-if="invoiceVM.refundOrderLinesTable.items.length"
              :headers="invoiceVM.refundOrderLinesTable.headers"
              :items="invoiceVM.refundOrderLinesTable.items"
            )
            div.flex.items-top.justify-between.mt-4
              div(class="w-1/2")
                ft-table(
                  :headers="invoiceVM.taxDetailsTable.headers"
                  :items="invoiceVM.taxDetailsTable.items"
                )
                div
                  div.flex.justify-between.items-center
                    div.bg-contrast.px-2.py-2(class="w-1/2") Moyen de paiement
                    div {{ invoiceVM.payment.type }} {{ invoiceVM.totals.totalWithTax }}
                  div.flex.justify-between.items-center
                    div.bg-contrast.px-2.py-2(class="w-1/2") Transporteur
                    div {{ invoiceVM.deliveryMethod.name }}
              div.invoice-summary(class="w-1/2").border.border-light.ml-8
                div.flex.items-center.justify-around.m-2
                  div(class="w-1/2") Total Produits
                  div.text-right(class="w-1/2") {{ invoiceVM.totals.linesTotal }}
                div.flex.items-center.justify-around.p-2.border-t.border-light
                  div(class="w-1/2") Total (HT)
                  div.text-right(class="w-1/2") {{ invoiceVM.totals.totalWithoutTax }}
                div.flex.items-center.justify-around.p-2.border-t.border-light
                  div(class="w-1/2") Total taxes
                  div.text-right(class="w-1/2") {{ invoiceVM.totals.totalTax }}
                div.flex.items-center.justify-around.p-2.border-t.border-light
                  div(class="w-1/2") Livraison
                  div.text-right(class="w-1/2") {{ invoiceVM.totals.deliveryPrice }}
                div.flex.items-center.justify-around.p-2.border-t.border-light(v-if="invoiceVM.refundOrderLinesTable.items.length")
                  div(class="w-1/2") Total remboursé (TTC)
                  div.text-right(class="w-1/2") {{ invoiceVM.totals.totalRefund }}
                div.flex.items-center.justify-around.p-2.border-t.border-light
                  div(class="w-1/2") Total (TTC)
                  div.text-right(class="w-1/2") {{ invoiceVM.totals.totalWithTax }}
    tfoot
      tr
        td
          .page-footer-space
</template>

<script lang="ts" setup>
import { getInvoiceVM } from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'

const invoiceVM = computed(() => {
  return getInvoiceVM()
})
</script>

<style scoped>
.page-footer,
.page-footer-space {
  height: 135px;
}

.page-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.invoice-summary {
  page-break-inside: avoid;
  margin-bottom: 6rem;
}

@page {
  margin: 2mm 5mm;
}

@media print {
  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  button {
    display: none;
  }

  body {
    margin: 0;
  }
}
</style>
