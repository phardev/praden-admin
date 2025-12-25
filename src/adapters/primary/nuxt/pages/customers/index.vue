<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/customers/new")
      ft-button.button-solid.text-xl.px-6 Créer client
  ft-table(
    :headers="customersVM.headers"
    :items="customersVM.items"
    @clicked="customerSelected"
  )
    template(#title) Clients
        span.ml-4.text-sm.text-colored (Affichage par défaut top CA)
    template(#search)
      ft-text-field.flex-grow.mb-4(
        v-model="search"
        placeholder="Rechercher par nom, email"
        for="search"
        type='text'
        name='search'
        @input="searchChanged"
      ) Rechercher un client
      p.warning.text-warning(v-if="customersVM.searchError") {{ customersVM.searchError }}
    template(#newsletterSubscription="{ item }")
      .flex.items-center.justify-center
        UToggle(
          size="xl"
          :model-value="item.newsletterSubscription"
          @update:model-value="toggleNewsletterSubscription(item)"
          @click.stop
        )
  InfiniteLoading(@infinite="load")
    template(#complete)
      div

</template>

<script lang="ts" setup>
import {
  type GetCustomersItemVM,
  getCustomersVM
} from '@adapters/primary/view-models/customers/get-customers/getCustomersVM'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { searchCustomers } from '@core/usecases/customers/customer-searching/searchCustomer'
import { useSearchStore } from '@store/searchStore'
import InfiniteLoading from 'v3-infinite-loading'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import 'v3-infinite-loading/lib/style.css'
import { subscribeToNewsletter } from '@core/usecases/newsletter-subscriptions/subscribe-to-newsletter/subscribeToNewsletter'
import { unsubscribeFromNewsletter } from '@core/usecases/newsletter-subscriptions/unsubscribe-from-newsletter/unsubscribe-from-newsletter'
import { useNewsletterGateway } from '../../../../../../gateways/newsletterGateway'

definePageMeta({ layout: 'main' })
const limit = 100
let offset = 0

interface InfiniteLoadingState {
  loaded: () => void
  complete: () => void
}

const load = async ($state: InfiniteLoadingState) => {
  if (!search.value) {
    await listCustomers(limit, offset, useCustomerGateway())
    offset += limit
    if (customersVM.value.hasMore) {
      $state.loaded()
    } else {
      $state.complete()
    }
  } else {
    $state.complete()
  }
}
const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')

const customersVM = computed(() => {
  return getCustomersVM(routeName)
})

const customerSelected = (uuid: string) => {
  router.push(`/customers/get/${uuid}`)
}

const search = ref(customersVM.value?.currentSearch?.query || '')

const minimumQueryLength = 3
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const searchChanged = (e: Event) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    const target = e.target as HTMLInputElement
    const query = target.value
    if (!query) {
      const searchStore = useSearchStore()
      searchStore.set(routeName, [])
      searchStore.setFilter(routeName, undefined)
      searchStore.setError(routeName, undefined)
    } else {
      searchCustomers(
        routeName,
        { query, minimumQueryLength },
        useSearchGateway()
      )
    }
  }, 300)
}

const toggleNewsletterSubscription = (item: GetCustomersItemVM) => {
  const newsletterGateway = useNewsletterGateway()
  const customerGateway = useCustomerGateway()
  if (item.newsletterSubscription) {
    unsubscribeFromNewsletter(item.email, newsletterGateway, customerGateway)
  } else {
    subscribeToNewsletter(
      { email: item.email, customerUuid: item.uuid },
      newsletterGateway,
      customerGateway
    )
  }
}
</script>
