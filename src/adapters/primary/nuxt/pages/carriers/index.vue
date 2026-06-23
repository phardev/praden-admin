<template lang="pug">
.carriers-page(class="max-w-6xl mx-auto p-6")
  header.mb-6
    h1.text-2xl.font-bold(class="text-gray12") {{ $t('carriers.title') }}
    p.mt-1(class="text-gray10") {{ $t('carriers.subtitle') }}

  div(
    v-if="isLoading"
    class="flex flex-col items-center justify-center py-20 text-gray10"
  )
    icon.animate-spin(
      name="i-heroicons-arrow-path"
      class="h-7 w-7 text-customPrimary-500"
    )
    span.mt-3 {{ $t('carriers.loading') }}

  div(
    v-else-if="listVM.length === 0"
    class="flex flex-col items-center justify-center py-20 text-gray10"
  )
    icon(name="i-heroicons-truck" class="h-12 w-12 mb-3 text-gray7")
    p {{ $t('carriers.empty') }}

  .space-y-5(v-else)
    article(
      v-for="carrier in listVM"
      :key="carrier.uuid"
      class="bg-white rounded-2xl border border-gray5 shadow-sm overflow-hidden"
    )
      .flex.items-center.gap-4(class="px-5 py-4 bg-gray2 border-b border-gray5")
        span(
          class="flex items-center justify-center h-11 w-11 rounded-xl shrink-0"
          :class="carrier.type === 'NONE' ? 'bg-customPrimary-50 text-customPrimary-600' : 'bg-customBlue-50 text-customBlue-600'"
        )
          icon(
            :name="carrier.type === 'NONE' ? 'i-heroicons-building-storefront' : 'i-heroicons-truck'"
            class="h-6 w-6"
          )
        .min-w-0.flex-1
          h2.font-semibold.truncate(class="text-gray12") {{ carrier.name }}
          p.text-sm(class="text-gray10")
            | {{ carrier.deliveryMethods.length }}&nbsp;
            | {{ carrier.deliveryMethods.length > 1 ? $t('carriers.methodsLabelPlural') : $t('carriers.methodsLabelSingular') }}
        span(
          class="text-xs font-medium px-2.5 py-1 rounded-full bg-gray3 text-gray11 shrink-0"
        ) {{ $t(`carriers.types.${carrier.type}`) }}

      .p-5.space-y-6
        section(v-for="method in carrier.deliveryMethods" :key="method.uuid")
          .flex.items-center.justify-between.gap-3.mb-3
            h3.font-medium(class="text-gray12") {{ method.name }}
            span(
              v-if="method.delay"
              class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-customPrimary-50 text-customPrimary-700 shrink-0"
            )
              icon(name="i-heroicons-clock" class="h-3.5 w-3.5")
              | {{ method.delay }}

          .flex.items-center.gap-2(
            v-if="!method.hasPriceRanges"
            class="text-sm text-gray10 bg-gray2 border border-gray5 rounded-lg px-4 py-3"
          )
            icon(name="i-heroicons-information-circle" class="h-4 w-4 text-gray8")
            | {{ $t('carriers.noPriceRanges') }}

          .overflow-x-auto.rounded-lg(v-else class="border border-gray5")
            table.w-full.text-sm
              thead
                tr(class="bg-gray2 text-gray11")
                  th(
                    class="text-left font-medium px-4 py-2.5 text-xs uppercase tracking-wide"
                  ) {{ $t('carriers.fields.weightRange') }}
                  th(
                    v-for="country in method.countries"
                    :key="country"
                    class="text-right font-medium px-4 py-2.5 text-xs uppercase tracking-wide"
                  ) {{ country }}
              tbody
                tr(
                  v-for="row in method.rows"
                  :key="row.weightRange"
                  class="border-t border-gray4 hover:bg-gray2"
                )
                  td(
                    class="px-4 py-2 font-medium text-gray11 whitespace-nowrap"
                  ) {{ row.weightRange }}
                  td(
                    v-for="country in method.countries"
                    :key="country"
                    class="px-4 py-2 text-right font-mono text-gray12 whitespace-nowrap"
                  ) {{ row.prices[country] }}
</template>

<script lang="ts" setup>
import { getCarrierListVM } from '@adapters/primary/view-models/carriers/carrier-list/carrierListVM'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useDeliveryMethodGateway } from '../../../../../../gateways/deliveryMethodGateway'

definePageMeta({ layout: 'main' })

const deliveryMethodGateway = useDeliveryMethodGateway()
const store = useDeliveryMethodStore()

const isLoading = computed(() => store.isLoading)

onMounted(async () => {
  await listDeliveryMethods(deliveryMethodGateway)
})

const listVM = computed(() => getCarrierListVM())
</script>

<style scoped>
.carriers-page {
  margin: 0 auto;
}
</style>
