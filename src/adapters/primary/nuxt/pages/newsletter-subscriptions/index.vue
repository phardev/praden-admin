<template lang="pug">
.section
  a.flex.flex-row-reverse(href="https://ecommerce-backend-production.admin-a5f.workers.dev/api/newsletters" target="_blank" rel="noopener noreferrer")
    ft-button.button-solid.text-xl.px-6 {{ $t('newsletter.exportButton') }}
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
import { getNewsletterSubscriptionsVM } from '@adapters/primary/view-models/newsletters/get-newsletter-subscriptions-vm/getNewsletterSubscriptionsVM'
import { listNewsletterSubscriptions } from '@core/usecases/newsletter-subscriptions/newsletter-subscription-listing/listNewsletterSubscriptions'
import { useNewsletterGateway } from '../../../../../../gateways/newsletterGateway'

definePageMeta({ layout: 'main' })

const newsletterGateway = useNewsletterGateway()
onMounted(() => {
  listNewsletterSubscriptions(newsletterGateway)
})

const newsletterSubscriptionsVM = computed(() => {
  return getNewsletterSubscriptionsVM()
})
</script>
