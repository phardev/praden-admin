<template lang="pug">
ft-table(
  :headers="vm.headers"
  :items="vm.items"
  :is-loading="vm.isLoading"
  item-key="reference"
  @clicked="clicked"
)
  template(#reference="{ item }")
    nuxt-link.font-medium.text-link(:href="item.href") {{ item.reference }}
  template(#createdDate="{ item }")
    time(:datetime='item.createdDatetime') {{ item.createdDate }}
  template(#status="{ item }")
    ft-order-status-badge(:status="item.status")
  template(#deliveryStatus="{ item }")
    ft-delivery-status-badge(:status="item.deliveryStatus")
  template(#paymentStatus="{ item }")
    ft-payment-status-badge(:status="item.paymentStatus")
  template(#search)
    div.flex.items-center.justify-center.space-x-4
      ft-text-field.flex-grow(
        v-model="search"
        placeholder="Rechercher par référence, client, email"
        for="search"
        type='text'
        name='search'
        @input="searchChanged"
      ) Rechercher une commande
      UFormGroup.pb-4(label="Date de début" name="startDate")
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton(
            icon="i-heroicons-calendar-days-20-solid"
            :label="startDate ? format(startDate, 'd MMMM yyy', { locale: fr }) : ''"
          )
            template(#trailing)
              UButton(
                v-show="startDate"
                color="white"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click.prevent="clearStartDate"
              )
          template(#panel="{ close }")
            ft-date-picker(
              v-model="startDate"
              @update:model-value="startDateChanged"
              @close="close"
            )
      UFormGroup.pb-4(label="Date de fin" name="endDate")
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton(
            icon="i-heroicons-calendar-days-20-solid"
            :label="endDate ? format(endDate, 'd MMMM yyy', { locale: fr }) : ''"
          )
            template(#trailing)
              UButton(
                v-show="endDate"
                color="white"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click.prevent="clearEndDate"
              )
          template(#panel="{ close }")
            ft-date-picker(
              v-model="endDate"
              :is-end-date="true"
              @update:model-value="endDateChanged"
              @close="close"
            )
      UFormGroup.pb-4(label="Statut" name="orderStatus")
        ft-order-status-select(
          v-model="orderStatus"
          @update:model-value="orderStatusChanged"
          @clear="clearOrderStatus"
        )
      UFormGroup.pb-4(label="Statut de livraison" name="deliveryStatus")
        ft-delivery-status-select(
          v-model="deliveryStatus"
          @update:model-value="deliveryStatusChanged"
          @clear="clearDeliveryStatus"
        )
      UFormGroup.pb-4(label="Statut de paiement" name="paymentStatus")
        ft-payment-status-select(
          v-model="paymentStatus"
          @update:model-value="paymentStatusChanged"
          @clear="clearPaymentStatus"
        )
  template(#infinite)
    InfiniteLoading(@infinite="load")
      template(#complete)
        div
</template>

<script lang="ts" setup>
import FtTable from '@adapters/primary/nuxt/components/molecules/FtTable.vue'
import { listOrders } from '@core/usecases/order/list-orders/listOrders'
import { searchOrders } from '@core/usecases/order/orders-searching/searchOrders'
import { useOrderStore } from '@store/orderStore'
import { useSearchStore } from '@store/searchStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import InfiniteLoading from 'v3-infinite-loading'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import 'v3-infinite-loading/lib/style.css'

interface InfiniteLoadingState {
  loaded: () => void
  complete: () => void
}

definePageMeta({ layout: 'main' })

const props = defineProps({
  vm: {
    type: Object,
    default() {
      return {}
    }
  },
  searchKey: {
    type: String,
    default() {
      return 'default-key'
    }
  },
  initialFilters: {
    type: Object,
    default() {
      return {}
    }
  }
})

const limit = 25
let offset = 0
let searchOffset = 0
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const debounceDelay = 300

const orderStore = useOrderStore()
const searchStore = useSearchStore()

onMounted(() => {
  orderStore.items = []
  orderStore.hasMore = true
  searchStore.clear(props.searchKey)
  offset = 0
  searchOffset = 0
})

const search = ref(props.vm.value?.currentSearch?.query || undefined)
const startDate = ref(props.vm.value?.currentSearch?.startDate || undefined)
const endDate = ref(props.vm.value?.currentSearch?.endDate || undefined)
const orderStatus = ref(props.vm.value?.currentSearch?.orderStatus || undefined)
const deliveryStatus = ref(
  props.vm.value?.currentSearch?.deliveryStatus || undefined
)
const paymentStatus = ref(
  props.vm.value?.currentSearch?.paymentStatus || undefined
)

watch(
  () => props.vm,
  (newVm) => {
    search.value = newVm.currentSearch?.query || undefined
    startDate.value = newVm.currentSearch?.startDate || undefined
    endDate.value = newVm.currentSearch?.endDate || undefined
    orderStatus.value = newVm.currentSearch?.orderStatus ?? undefined
    deliveryStatus.value = newVm.currentSearch?.deliveryStatus ?? undefined
    paymentStatus.value = newVm.currentSearch?.paymentStatus ?? undefined
  },
  { immediate: true, deep: true }
)
const isSearchMode = () => {
  return Boolean(
    search.value ||
      startDate.value ||
      endDate.value ||
      orderStatus.value !== undefined ||
      deliveryStatus.value !== undefined ||
      paymentStatus.value !== undefined ||
      props.initialFilters?.customerUuid
  )
}

const dto = (partial: Record<string, any>) => {
  return {
    ...props.initialFilters,
    query: search.value,
    startDate: startDate.value,
    endDate: endDate.value,
    orderStatus: orderStatus.value,
    deliveryStatus: deliveryStatus.value,
    paymentStatus: paymentStatus.value,
    size: limit,
    from: 0,
    ...partial
  }
}

const load = async ($state: InfiniteLoadingState) => {
  if (!isSearchMode()) {
    await listOrders(limit, offset, useOrderGateway())
    offset += limit
    if (orderStore.hasMore) {
      $state.loaded()
    } else {
      $state.complete()
    }
    return
  }
  if (searchStore.isLoading(props.searchKey)) {
    return
  }
  if (!searchStore.hasMoreSearch(props.searchKey)) {
    $state.complete()
    return
  }
  await searchOrders(
    props.searchKey,
    dto({ from: searchOffset }),
    useSearchGateway()
  )
  searchOffset += limit
  if (searchStore.hasMoreSearch(props.searchKey)) {
    $state.loaded()
  } else {
    $state.complete()
  }
}

const triggerSearch = () => {
  searchStore.clear(props.searchKey)
  searchOffset = limit
  searchOrders(props.searchKey, dto({ from: 0 }), useSearchGateway())
}

const searchChanged = (e: any) => {
  search.value = e.target.value
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(triggerSearch, debounceDelay)
}

const startDateChanged = (date: number) => {
  startDate.value = date
  triggerSearch()
}

const clearStartDate = () => {
  startDate.value = undefined
  triggerSearch()
}

const endDateChanged = (date: number) => {
  endDate.value = date
  triggerSearch()
}

const clearEndDate = () => {
  endDate.value = undefined
  triggerSearch()
}

const deliveryStatusChanged = (stringStatus: string) => {
  deliveryStatus.value = +stringStatus
  triggerSearch()
}

const clearDeliveryStatus = () => {
  deliveryStatus.value = undefined
  triggerSearch()
}

const orderStatusChanged = (stringStatus: string) => {
  orderStatus.value = +stringStatus
  triggerSearch()
}

const clearOrderStatus = () => {
  orderStatus.value = undefined
  triggerSearch()
}

const paymentStatusChanged = (stringStatus: string) => {
  paymentStatus.value = +stringStatus
  triggerSearch()
}

const clearPaymentStatus = () => {
  paymentStatus.value = undefined
  triggerSearch()
}

const clicked = (reference: string) => {
  const router = useRouter()
  router.push(`/orders/${reference}`)
}
</script>
