<template lang="pug">
  .section
    ft-table(
      :headers="newsletterSubscriptionsVM.headers"
      :items="newsletterSubscriptionsVM.items"
      :is-loading="newsletterSubscriptionsVM.isLoading"
    )
      template(#title) Membres de la newsletter
      template(#name="{ item }")
        .font-medium.text-default {{ item.name }}
  </template>

<script lang="ts" setup>
import { useNewsletterGateway } from '../../../../../../gateways/newsletterGateway'
import { listNewsletterSubscriptions } from '@core/usecases/newsletter-subscriptions/newsletter-subscription-listing/listNewsletterSubscriptions'
import { getNewsletterSubscriptionsVM } from '@adapters/primary/view-models/newsletters/get-newsletter-subscriptions-vm/getNewsletterSubscriptionsVM'

definePageMeta({ layout: 'main' })

const newsletterGateway = useNewsletterGateway()
onMounted(() => {
  listNewsletterSubscriptions(newsletterGateway)
})

const newsletterSubscriptionsVM = computed(() => {
  return getNewsletterSubscriptionsVM()
})
</script>
