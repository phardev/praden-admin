<template lang="pug">
.section
  invoice
</template>

<script lang="ts" setup>
import { getInvoice } from '@core/usecases/invoices/get-invoice/getInvoice'
import { useInvoiceGateway } from '../../../../../../../gateways/invoiceGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  const route = useRoute()
  const invoiceNumber = route.params.invoiceNumber
  getInvoice(invoiceNumber, useInvoiceGateway())
})
</script>
