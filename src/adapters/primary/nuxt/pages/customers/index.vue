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
        placeholder="Rechercher par référence, client"
        for="search"
        type='text'
        name='search'
        @input="searchChanged"
      ) Rechercher une commande

</template>

<script lang="ts" setup>
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'
import { getCustomersVM } from '@adapters/primary/view-models/customers/get-customers/getCustomersVM'
import { searchCustomers } from '@core/usecases/customers/customer-searching/searchCustomer'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCustomers(useCustomerGateway())
})
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
