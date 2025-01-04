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
    template(#search)
      ft-text-field.flex-grow(
        v-model="search"
        placeholder="Rechercher par nom, email"
        for="search"
        type='text'
        name='search'
        @input="searchChanged"
      ) Rechercher un client
      p.warning.text-warning(v-if="customersVM.searchError") {{ customersVM.searchError }}
  InfiniteLoading(@infinite="load")
    template(#complete)
      div

</template>

<script lang="ts" setup>
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'
import { getCustomersVM } from '@adapters/primary/view-models/customers/get-customers/getCustomersVM'
import { searchCustomers } from '@core/usecases/customers/customer-searching/searchCustomer'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'

definePageMeta({ layout: 'main' })
const limit = 25
let offset = 0

const load = async ($state) => {
  if (!search.value) {
    await listCustomers(limit, offset, useCustomerGateway())
    offset += limit
    if (customersVM.hasMore) {
      $state.loaded()
    } else {
      $state.complete()
    }
  } else {
    $state.complete()
  }
}
const router = useRouter()
const routeName = router.currentRoute.value.name

const customersVM = computed(() => {
  return getCustomersVM(routeName)
})

const customerSelected = (uuid: string) => {
  router.push(`/customers/get/${uuid}`)
}

const search = ref(customersVM.value?.currentSearch?.query || '')

let debounceTimer

const searchChanged = (e: any) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchCustomers(routeName, { query: e.target.value }, useSearchGateway())
  }, 300)
}
</script>
