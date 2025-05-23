<template lang="pug">
.dashboard-container.p-4.mx-auto
  UCard.mb-4
    template(#header)
      .flex.justify-between.items-center
        h2.text-xl.font-bold {{ $t('dashboard.title') }}
        UForm.flex.gap-4
          UFormGroup.pb-4(label="Laboratoire" name="laboratory")
            FtAutocomplete(
              v-model="laboratory"
              :options="laboratoriesVM.items"
              option-attribute="name"
              value-key="uuid"
              :search="accentInsensitiveSearch"
              @clear="clearLaboratory"
            )
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
                  :is-end-date="true"
                  @close="close"
                )

          UFormGroup.pb-4(:label="$t('dashboard.productLimit')" name="productLimit")
            UInput(v-model.number='productLimit' type='number' :min='1' :max='100')
          FtButton(icon='i-heroicons-arrow-path' :loading='isLoading' @click='fetchFilteredDashboardData')
            | {{ $t('dashboard.refresh') }}
    template(#default)
      div(v-if='isLoading')
        .flex.justify-center.items-center.h-64
          icon.animate-spin.h-8.w-8(name='i-heroicons-arrow-path')
      div(v-else)
        .grid.grid-cols-1.gap-4.mb-8(class='md:grid-cols-5')
          UCard(v-for='(stat, index) in statsCards' :key='index')
            template(#header)
              .text-center
                h3.text-lg.font-medium {{ stat.title }}
            template(#default)
              .text-center
                p.text-3xl.font-bold {{ stat.value }}
                p.text-sm.text-gray-500 {{ stat.description }}
        .grid.grid-cols-1.gap-6.mb-8(class='lg:grid-cols-2')
          UCard
            template(#header)
              h3.text-lg.font-medium
                | {{ $t('dashboard.monthlySales') }}
            template(#default)
              .h-80
                MonthlySalesChart(:data='dashboard.monthlySales')
          UCard
            template(#header)
              h3.text-lg.font-medium
                | {{ $t('dashboard.monthlyTurnover') }}
            template(#default)
              .h-80
                MonthlyTurnoverChart(:data='dashboard.monthlySales')
          UCard
            template(#header)
              h3.text-lg.font-medium
                | {{ $t('dashboard.monthlyCanceledTurnover') }}
            template(#default)
              .h-80
                MonthlyCanceledTurnoverChart(:data='dashboard.monthlySales')
          UCard
            template(#header)
              h3.text-lg.font-medium
                | {{ $t('dashboard.monthlyDeliveryPrice') }}
            template(#default)
              .h-80
                MonthlyDeliveryPriceChart(:data='dashboard.monthlySales')
        UCard.mt-16
          template(#header)
            h3.text-lg.font-medium
              | {{ $t('dashboard.topProducts.title') }}
          template(#default)
            UTable(:columns='topProductsColumns' :rows='dashboard.topProducts')
              template(#categories-data="{ row }")
                div(v-if="row.categories && row.categories.length")
                  div.mb-1(v-for="category in row.categories" :key="category.uuid")
                    UBadge(variant="subtle" :label="category.name")
                div(v-else)
              template(#laboratory-data="{ row }")
                span {{ row.laboratory ? row.laboratory.name : '' }}
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { formatCurrency } from '@/src/utils/formatters'
import { useDashboardData } from '../../composables/useDashboardData'
import { listLaboratories } from '@core/usecases/laboratories/laboratory-listing/listLaboratories'
import { getLaboratoriesVM } from '@/src/adapters/primary/view-models/laboratories/get-laboratories/getLaboratoriesVM'
import { useLaboratoryGateway } from '@/gateways/laboratoryGateway'
import { fr } from 'date-fns/locale'

definePageMeta({ layout: 'main' })

const { t } = useI18n()

const { isLoading, dashboard, fetchDashboardData } = useDashboardData()

const productLimit = ref(50)
const startDate = ref<number | null>(null)
const endDate = ref<number | null>(null)
const laboratory = ref<string | null>(null)

const laboratoriesVM = computed(() => {
  return getLaboratoriesVM()
})

const statsCards = computed(() => [
  {
    title: t('dashboard.totalSales'),
    value: dashboard.value.totalSales.count.toLocaleString(),
    description: t('dashboard.orders')
  },
  {
    title: t('dashboard.totalTurnover'),
    value: formatCurrency(dashboard.value.totalSales.turnover),
    description: t('dashboard.revenue')
  },
  {
    title: t('dashboard.canceledTurnover'),
    value: formatCurrency(dashboard.value.totalSales.canceledTurnover),
    description: t('dashboard.canceledRevenue')
  },
  {
    title: t('dashboard.deliveryPrice'),
    value: formatCurrency(dashboard.value.totalSales.deliveryPrice),
    description: t('dashboard.deliveryRevenue')
  },
  {
    title: t('dashboard.averageBasket'),
    value: formatCurrency(dashboard.value.totalSales.averageBasketValue),
    description: t('dashboard.perOrder')
  }
])

const topProductsColumns = [
  {
    key: 'name',
    label: t('dashboard.topProducts.productName')
  },
  {
    key: 'categories',
    label: t('dashboard.topProducts.categories')
  },
  {
    key: 'laboratory',
    label: t('dashboard.topProducts.laboratory')
  },
  {
    key: 'count',
    label: t('dashboard.topProducts.orderCount')
  }
]

const fetchFilteredDashboardData = async () => {
  const params: Record<string, any> = {}

  if (productLimit.value) {
    params.productLimit = productLimit.value
  }

  if (startDate.value) {
    params.startDate = new Date(startDate.value)
  }

  if (endDate.value) {
    params.endDate = new Date(endDate.value)
  }

  if (laboratory.value) {
    params.laboratoryUuid = laboratory.value ? laboratory.value.uuid : null
  }

  await fetchDashboardData(params)
}

onMounted(() => {
  listLaboratories(useLaboratoryGateway())
  fetchFilteredDashboardData()
})

const clearStartDate = () => {
  startDate.value = null
}

const clearEndDate = () => {
  endDate.value = null
}

const clearLaboratory = () => {
  laboratory.value = null
}

const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const accentInsensitiveSearch = (query: string) => {
  if (!query || !laboratoriesVM.value.items) {
    return laboratoriesVM.value.items || []
  }

  const normalizedQuery = normalizeText(query)

  return laboratoriesVM.value.items.filter((option) => {
    const optionName = option.name || ''
    const normalizedName = normalizeText(optionName)
    return normalizedName.includes(normalizedQuery)
  })
}
</script>
