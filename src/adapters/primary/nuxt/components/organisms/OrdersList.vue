<template lang="pug">
ft-table(
  :headers="vm.headers"
  :items="vm.items"
  :is-loading="vm.isLoading"
  item-key="reference"
)
  template(#reference="{ item }")
    nuxt-link.font-medium.text-link(:href="item.href") {{ item.reference }}
  template(#createdDate="{ item }")
    time(:datetime='item.createdDatetime') {{ item.createdDate }}
  template(#status="{ item }")
    ft-delivery-status-badge(:status="item.deliveryStatus")
  template(#paymentStatus="{ item }")
    ft-payment-status-badge(:status="item.paymentStatus")
  template(#search)
    div.flex.items-center.justify-center.space-x-4
      ft-text-field.flex-grow(
        v-model="search"
        placeholder="Rechercher par référence, client"
        for="search"
        type='text'
        name='search'
        @input="searchChanged"
      ) Rechercher une commande
      UFormGroup.pb-4(label="Date de début" name="startDate")
        UPopover(:popper="{ placement: 'bottom-start' }")
          UButton(
            icon="i-heroicons-calendar-days-20-solid"
            :label="startDate ? format(startDate, 'd MMMM yyy', { locale: fr }) : 'Choisissez une date'"
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
            :label="endDate ? format(endDate, 'd MMMM yyy', { locale: fr }) : 'Choisissez une date'"
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
              @update:model-value="endDateChanged"
              @close="close"
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
</template>

<script lang="ts" setup>
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { listOrders } from '@core/usecases/order/list-orders/listOrders'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import { searchOrders } from '@core/usecases/order/orders-searching/searchOrders'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import FtDeliveryStatusSelect from '@adapters/primary/nuxt/components/molecules/FtDeliveryStatusSelect.vue'
import FtTable from '@adapters/primary/nuxt/components/molecules/FtTable.vue'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listOrders(useOrderGateway())
})

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

const search = ref(props.vm.value?.currentSearch?.query || undefined)
const startDate = ref(props.vm.value?.currentSearch?.startDate || undefined)
const endDate = ref(props.vm.value?.currentSearch?.endDate || undefined)
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
    deliveryStatus.value = newVm.currentSearch?.deliveryStatus ?? undefined
    paymentStatus.value = newVm.currentSearch?.paymentStatus ?? undefined
  },
  { immediate: true, deep: true }
)
const dto = (partial) => {
  return {
    ...props.initialFilters,
    query: search.value,
    startDate: startDate.value,
    endDate: endDate.value,
    deliveryStatus: deliveryStatus.value,
    paymentStatus: paymentStatus.value,
    ...partial
  }
}

const searchChanged = (e: any) => {
  searchOrders(
    props.searchKey,
    dto({ query: e.target.value }),
    useSearchGateway()
  )
}

const startDateChanged = (date: number) => {
  searchOrders(props.searchKey, dto({ startDate: date }), useSearchGateway())
}

const clearStartDate = () => {
  startDate.value = undefined
  searchOrders(
    props.searchKey,
    dto({ startDate: undefined }),
    useSearchGateway()
  )
}

const endDateChanged = (date: number) => {
  searchOrders(props.searchKey, dto({ endDate: date }), useSearchGateway())
}

const clearEndDate = () => {
  endDate.value = undefined
  searchOrders(props.searchKey, dto({ endDate: undefined }), useSearchGateway())
}

const deliveryStatusChanged = (stringStatus: string) => {
  const status = +stringStatus
  deliveryStatus.value = status
  searchOrders(
    props.searchKey,
    dto({ deliveryStatus: status }),
    useSearchGateway()
  )
}

const clearDeliveryStatus = () => {
  deliveryStatus.value = undefined
  searchOrders(
    props.searchKey,
    dto({ deliveryStatus: undefined }),
    useSearchGateway()
  )
}

const paymentStatusChanged = (stringStatus: string) => {
  const status = +stringStatus
  paymentStatus.value = status
  searchOrders(
    props.searchKey,
    dto({ paymentStatus: status }),
    useSearchGateway()
  )
}

const clearPaymentStatus = () => {
  paymentStatus.value = undefined
  searchOrders(
    props.searchKey,
    dto({ paymentStatus: undefined }),
    useSearchGateway()
  )
}
</script>
