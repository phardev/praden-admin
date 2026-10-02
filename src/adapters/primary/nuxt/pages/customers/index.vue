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
      div.space-y-3.mb-4
        div.flex.flex-wrap.items-center.gap-4
          ft-text-field.flex-grow(
            v-model="search"
            placeholder="Rechercher par nom, email"
            for="search"
            type='text'
            name='search'
            @input="searchChanged"
          ) Rechercher un client
          UButton(
            icon="i-heroicons-funnel"
            :color="showFilters ? 'primary' : 'gray'"
            :variant="showFilters ? 'solid' : 'outline'"
            :aria-label="showFilters ? $t('common.hideFilters') : $t('common.showFilters')"
            @click="toggleFilters"
          )
            span {{ $t('customers.filters.button') }}
            UBadge.ml-2(
              v-if="customersVM.activeFilters.length"
              :label="String(customersVM.activeFilters.length)"
              color="white"
              size="xs"
            )
        p.warning.text-warning(v-if="customersVM.searchError") {{ customersVM.searchError }}
        ft-filter-chips(
          :filters="customersVM.activeFilters"
          @remove="removeFilter"
          @clear-all="clearAllFilters"
        )
        div.grid.grid-cols-1.gap-4.rounded-lg.border.border-gray-200.p-4(
          v-show="showFilters"
          class="md:grid-cols-3"
        )
          UFormGroup(:label="$t('customers.filters.lastOrderStartDate')" name="lastOrderStartDate")
            UPopover(:popper="{ placement: 'bottom-start' }")
              UButton.w-full(
                icon="i-heroicons-calendar-days-20-solid"
                color="gray"
                variant="outline"
                :label="lastOrderStartDate ? format(lastOrderStartDate, 'd MMMM yyy', { locale: fr }) : $t('common.period.selectDate')"
              )
                template(#trailing)
                  UButton(
                    v-show="lastOrderStartDate"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    :padded="false"
                    :aria-label="$t('customers.filters.clearLastOrderStartDate')"
                    @click.prevent="clearLastOrderStartDate"
                  )
              template(#panel="{ close }")
                ft-date-picker(
                  v-model="lastOrderStartDate"
                  @update:model-value="lastOrderStartDateChanged"
                  @close="close"
                )
          UFormGroup(:label="$t('customers.filters.lastOrderEndDate')" name="lastOrderEndDate")
            UPopover(:popper="{ placement: 'bottom-start' }")
              UButton.w-full(
                icon="i-heroicons-calendar-days-20-solid"
                color="gray"
                variant="outline"
                :label="lastOrderEndDate ? format(lastOrderEndDate, 'd MMMM yyy', { locale: fr }) : $t('common.period.selectDate')"
              )
                template(#trailing)
                  UButton(
                    v-show="lastOrderEndDate"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    :padded="false"
                    :aria-label="$t('customers.filters.clearLastOrderEndDate')"
                    @click.prevent="clearLastOrderEndDate"
                  )
              template(#panel="{ close }")
                ft-date-picker(
                  v-model="lastOrderEndDate"
                  :is-end-date="true"
                  @update:model-value="lastOrderEndDateChanged"
                  @close="close"
                )
          UFormGroup(:label="$t('customers.filters.newsletter')" name="newsletterSubscribed")
            USelect(
              :model-value="newsletterOption"
              :options="newsletterOptions"
              value-attribute="value"
              option-attribute="label"
              @update:model-value="newsletterChanged"
            )
          UFormGroup(:label="$t('customers.filters.minOrdersCount')" name="minOrdersCount")
            UInput(
              :model-value="minOrdersCount"
              type="number"
              min="0"
              step="1"
              @update:model-value="minOrdersCountChanged"
            )
          UFormGroup(:label="$t('customers.filters.maxOrdersCount')" name="maxOrdersCount")
            UInput(
              :model-value="maxOrdersCount"
              type="number"
              min="0"
              step="1"
              @update:model-value="maxOrdersCountChanged"
            )
    template(#newsletterSubscription="{ item }")
      .flex.items-center.justify-center
        UToggle(
          size="xl"
          :model-value="item.newsletterSubscription"
          @update:model-value="toggleNewsletterSubscription(item)"
          @click.stop
        )
    template(#infinite)
      InfiniteLoading(:identifier="infiniteIdentifier" @infinite="load")
        template(#complete)
          div

</template>

<script lang="ts" setup>
import {
  type GetCustomersItemVM,
  getCustomersVM
} from '@adapters/primary/view-models/customers/get-customers/getCustomersVM'
import type { ActiveFilterVM } from '@adapters/primary/view-models/shared/filters'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import {
  type SearchCustomersDTO,
  searchCustomers
} from '@core/usecases/customers/customer-searching/searchCustomer'
import { useSearchStore } from '@store/searchStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import InfiniteLoading from 'v3-infinite-loading'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import 'v3-infinite-loading/lib/style.css'
import { subscribeToNewsletter } from '@core/usecases/newsletter-subscriptions/subscribe-to-newsletter/subscribeToNewsletter'
import { unsubscribeFromNewsletter } from '@core/usecases/newsletter-subscriptions/unsubscribe-from-newsletter/unsubscribe-from-newsletter'
import { useNewsletterGateway } from '../../../../../../gateways/newsletterGateway'

definePageMeta({ layout: 'main' })

interface InfiniteLoadingState {
  loaded: () => void
  complete: () => void
}

type NewsletterOption = 'all' | 'subscribed' | 'notSubscribed'

const limit = 100
const minimumQueryLength = 3
const debounceDelay = 300
let offset = 0
let searchOffset = 0
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const infiniteIdentifier = ref(0)

const { t } = useI18n()
const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')
const searchStore = useSearchStore()

const customersVM = computed(() => {
  return getCustomersVM(routeName)
})

const currentSearch = customersVM.value.currentSearch
const search = ref<string | undefined>(currentSearch?.query || undefined)
const lastOrderStartDate = ref<number | undefined>(
  currentSearch?.lastOrderStartDate
)
const lastOrderEndDate = ref<number | undefined>(
  currentSearch?.lastOrderEndDate
)
const minOrdersCount = ref<number | undefined>(currentSearch?.minOrdersCount)
const maxOrdersCount = ref<number | undefined>(currentSearch?.maxOrdersCount)
const newsletterSubscribed = ref<boolean | undefined>(
  currentSearch?.newsletterSubscribed
)
const showFilters = ref(false)

const newsletterOptions = computed(
  (): Array<{ value: NewsletterOption; label: string }> => [
    { value: 'all', label: t('customers.filters.newsletterAll') },
    { value: 'subscribed', label: t('customers.filters.newsletterSubscribed') },
    {
      value: 'notSubscribed',
      label: t('customers.filters.newsletterNotSubscribed')
    }
  ]
)

const newsletterOption = computed((): NewsletterOption => {
  if (newsletterSubscribed.value === undefined) return 'all'
  return newsletterSubscribed.value ? 'subscribed' : 'notSubscribed'
})

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const isSearchMode = () => {
  return Boolean(
    search.value ||
      lastOrderStartDate.value !== undefined ||
      lastOrderEndDate.value !== undefined ||
      minOrdersCount.value !== undefined ||
      maxOrdersCount.value !== undefined ||
      newsletterSubscribed.value !== undefined
  )
}

const dto = (from: number): SearchCustomersDTO => {
  return {
    query: search.value,
    minimumQueryLength,
    lastOrderStartDate: lastOrderStartDate.value,
    lastOrderEndDate: lastOrderEndDate.value,
    minOrdersCount: minOrdersCount.value,
    maxOrdersCount: maxOrdersCount.value,
    newsletterSubscribed: newsletterSubscribed.value,
    size: limit,
    from
  }
}

const loadList = async ($state: InfiniteLoadingState) => {
  await listCustomers(limit, offset, useCustomerGateway())
  offset += limit
  if (customersVM.value.hasMore) {
    $state.loaded()
  } else {
    $state.complete()
  }
}

const loadSearch = async ($state: InfiniteLoadingState) => {
  if (customersVM.value.isSearchLoading) {
    return
  }
  if (searchOffset > 0 && !customersVM.value.hasMoreSearch) {
    $state.complete()
    return
  }
  await searchCustomers(routeName, dto(searchOffset), useSearchGateway())
  searchOffset += limit
  if (customersVM.value.hasMoreSearch) {
    $state.loaded()
  } else {
    $state.complete()
  }
}

const load = async ($state: InfiniteLoadingState) => {
  if (isSearchMode()) {
    await loadSearch($state)
  } else {
    await loadList($state)
  }
}

const triggerSearch = async () => {
  if (isSearchMode()) {
    searchOffset = limit
    await searchCustomers(routeName, dto(0), useSearchGateway())
  } else {
    searchStore.clear(routeName)
    searchStore.setFilter(routeName, undefined)
    searchStore.setError(routeName, undefined)
    searchOffset = 0
  }
  infiniteIdentifier.value++
}

const triggerSearchDebounced = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(triggerSearch, debounceDelay)
}

const searchChanged = (e: Event) => {
  search.value = (e.target as HTMLInputElement).value || undefined
  triggerSearchDebounced()
}

const lastOrderStartDateChanged = (date: number) => {
  lastOrderStartDate.value = date
  triggerSearch()
}

const clearLastOrderStartDate = () => {
  lastOrderStartDate.value = undefined
  triggerSearch()
}

const lastOrderEndDateChanged = (date: number) => {
  lastOrderEndDate.value = date
  triggerSearch()
}

const clearLastOrderEndDate = () => {
  lastOrderEndDate.value = undefined
  triggerSearch()
}

const toOrdersCount = (value: string | number): number | undefined => {
  const count = Math.floor(Number(value))
  return value === '' || Number.isNaN(count) || count < 0 ? undefined : count
}

const minOrdersCountChanged = (value: string | number) => {
  minOrdersCount.value = toOrdersCount(value)
  triggerSearchDebounced()
}

const maxOrdersCountChanged = (value: string | number) => {
  maxOrdersCount.value = toOrdersCount(value)
  triggerSearchDebounced()
}

const newsletterChanged = (option: NewsletterOption) => {
  newsletterSubscribed.value =
    option === 'all' ? undefined : option === 'subscribed'
  triggerSearch()
}

const removeFilter = (filter: ActiveFilterVM) => {
  if (filter.key === 'query') search.value = undefined
  if (filter.key === 'lastOrderStartDate') lastOrderStartDate.value = undefined
  if (filter.key === 'lastOrderEndDate') lastOrderEndDate.value = undefined
  if (filter.key === 'minOrdersCount') minOrdersCount.value = undefined
  if (filter.key === 'maxOrdersCount') maxOrdersCount.value = undefined
  if (filter.key === 'newsletterSubscribed') {
    newsletterSubscribed.value = undefined
  }
  triggerSearch()
}

const clearAllFilters = () => {
  search.value = undefined
  lastOrderStartDate.value = undefined
  lastOrderEndDate.value = undefined
  minOrdersCount.value = undefined
  maxOrdersCount.value = undefined
  newsletterSubscribed.value = undefined
  triggerSearch()
}

const customerSelected = (uuid: string) => {
  router.push(`/customers/get/${uuid}`)
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
