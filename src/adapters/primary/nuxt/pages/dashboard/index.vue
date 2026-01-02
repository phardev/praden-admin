<template lang="pug">
div(v-if="permissions.canAccessDashboard")
  .dashboard-container.p-4.mx-auto
    .flex.flex-col.justify-between.items-start.gap-4.mb-4(class="md:flex-row md:items-center")
      h2.text-xl.font-bold.text-primary-700 {{ $t('dashboard.title') }}
      UButton.ml-auto(class="md:hidden" color="gray" variant="ghost" icon="i-heroicons-adjustments-horizontal" @click="toggleFilters")
        | {{ showFilters ? $t('common.hideFilters') : $t('common.showFilters') }}

    UCard.mb-6.shadow-sm.bg-gray-50(v-show="showFilters || isLargeScreen")
      .p-3
        UForm
          .grid.grid-cols-1.gap-3(class="md:grid-cols-2 lg:grid-cols-4")
          UFormGroup(label="Catégorie" name="category")
            FtAutocomplete(
              v-model="category"
              :options="categoriesVM.items"
              option-attribute="name"
              value-key="uuid"
              :search="categorySearch"
              placeholder="Toutes les catégories"
              class="w-full"
              @clear="clearCategory"
            )
          UFormGroup(label="Laboratoire" name="laboratory")
            FtAutocomplete(
              v-model="laboratory"
              :options="laboratoriesVM.items"
              option-attribute="name"
              value-key="uuid"
              :search="laboratorySearch"
              placeholder="Tous les laboratoires"
              class="w-full"
              @clear="clearLaboratory"
            )

          .col-span-1(class="md:col-span-2")
            .grid.grid-cols-1.gap-3(class="sm:grid-cols-2")
              UFormGroup(label="Date de début" name="startDate")
                UPopover(:popper="{ placement: 'bottom-start' }")
                  UButton(
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="startDate ? format(startDate, 'd MMM yyyy', { locale: fr }) : $t('dashboard.selectDateRange')"
                    class="w-full flex justify-between text-sm"
                    color="primary"
                    variant="soft"
                    size="sm"
                  )
                    template(#trailing)
                      UButton(
                        v-show="startDate"
                        color="primary"
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
              UFormGroup(label="Date de fin" name="endDate")
                UPopover(:popper="{ placement: 'bottom-start' }")
                  UButton(
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="endDate ? format(endDate, 'd MMM yyyy', { locale: fr }) : $t('dashboard.selectDateRange')"
                    class="w-full flex justify-between text-sm"
                    color="primary"
                    variant="soft"
                    size="sm"
                  )
                    template(#trailing)
                      UButton(
                        v-show="endDate"
                        color="primary"
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
          UFormGroup(:label="$t('dashboard.productLimit')" name="productLimit")
            UInput(
              v-model.number="productLimit"
              type="number"
              :min="1"
              :max="100"
              class="w-full"
            )
          UFormGroup(label="Filtres" name="filters")
            .flex.items-center
              UCheckbox(v-model="promotionOnly" color="primary" name="promotionOnly")
              span.ml-2.text-sm {{ $t('dashboard.promotionOnly') }}
        .flex.justify-end.mt-3
          UButton(
            color="gray"
            variant="soft"
            icon="i-heroicons-x-mark"
            class="mr-2"
            size="sm"
            @click="resetFilters"
          )
            | {{ $t('common.reset') }}
          UButton(
            color="primary"
            icon="i-heroicons-arrow-path"
            :loading="isLoading"
            size="sm"
            @click="fetchFilteredDashboardData"
          )
            | {{ $t('dashboard.refresh') }}
  .flex.justify-center.items-center.h-64(v-if="isLoading")
    icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
  .dashboard-content(v-else)
    .grid.grid-cols-1.gap-4.mb-8(class="md:grid-cols-5")
      UCard(v-for="(stat, index) in statsCards" :key="index")
        template(#header)
          .text-center
            h3.text-lg.font-medium {{ stat.title }}
        template(#default)
          .flex.justify-center.gap-6(v-if="stat.showDualYear")
            .text-center
              p.text-xs.text-gray-500.mb-1.font-medium {{ previousYear }}
              p.text-xl.font-bold {{ stat.isApplicableWithProductFilters ? stat.previousYearValue : areProductFiltersApplied ? 'N/A' : stat.previousYearValue }}
            .border-l.border-gray-200
            .text-center
              p.text-xs.text-gray-500.mb-1.font-medium {{ currentYear }}
              p.text-xl.font-bold {{ stat.isApplicableWithProductFilters ? stat.value : areProductFiltersApplied ? 'N/A' : stat.value }}
          .text-center(v-else)
            p.text-2xl.font-bold {{ stat.isApplicableWithProductFilters ? stat.value : areProductFiltersApplied ? 'N/A' : stat.value }}
          p.text-sm.text-gray-500.text-center.mt-2 {{ stat.description }}

    .grid.grid-cols-1.gap-6.mb-8(class="lg:grid-cols-2")
      UCard
        template(#header)
          h3.text-lg.font-medium {{ $t('dashboard.monthlySales') }}
        template(#default)
          .h-80
            MonthlySalesChart(:data="dashboard.previousYearMonthlySales" :next-year-data="dashboard.monthlySales")
      UCard
        template(#header)
          h3.text-lg.font-medium {{ $t('dashboard.monthlyTurnover') }}
        template(#default)
          .h-80
            MonthlyTurnoverChart(:data="dashboard.previousYearMonthlySales" :next-year-data="dashboard.monthlySales")

    UCard.mb-8(v-if="dashboard.previousYearMonthlySales.length > 0")
      template(#header)
        h3.text-lg.font-medium {{ $t('dashboard.evolution.title') }} (
          span.text-primary {{ $t('dashboard.evolution.titleSuffix') }}
          | )
      template(#default)
        MonthlyEvolutionChart(:current-year-data="dashboard.monthlySales" :previous-year-data="dashboard.previousYearMonthlySales")

    .grid.grid-cols-1.gap-6.mb-8(class="lg:grid-cols-2")
      UCard()
        template(#header)
          h3.text-lg.font-medium {{ $t('dashboard.categoriesDistribution') }}
        template(#default)
          .h-80
            CategoriesPieChart(:data="dashboard.productQuantitiesByCategory" @select-category="onSelectCategory" @navigate-to-parent="navigateToParentCategory")
      UCard()
        template(#header)
          h3.text-lg.font-medium {{ $t('dashboard.laboratoriesDistribution') }}
        template(#default)
          .h-80
            LaboratoriesPieChart(:data="dashboard.ordersByLaboratory")
      UCard(v-if="!areProductFiltersApplied")
        template(#header)
          h3.text-lg.font-medium {{ $t('dashboard.deliveryMethodsDistribution') }}
        template(#default)
          .h-80
            DeliveryMethodsPieChart(:data="dashboard.ordersByDeliveryMethod")
      UCard(v-if="!areProductFiltersApplied")
        template(#header)
          h3.text-lg.font-medium {{ $t('dashboard.monthlyDeliveryPrice') }}
        template(#default)
          .h-80
            MonthlyDeliveryPriceChart(:data="dashboard.previousYearMonthlySales" :next-year-data="dashboard.monthlySales")
      UCard(v-if="!areDateFiltersApplied")
        template(#header)
          h3.text-lg.font-medium {{ $t('dashboard.productStockDistribution') }}
        template(#default)
          .h-80
            ProductStockPieChart(:data="dashboard.productStockStats")
      UCard
        template(#header)
          h3.text-lg.font-medium {{ $t('dashboard.monthlyCanceledTurnover') }}
        template(#default)
          .h-80
            MonthlyCanceledTurnoverChart(:data="dashboard.previousYearMonthlySales" :next-year-data="dashboard.monthlySales")

    UCard.mt-16
      template(#header)
        h3.text-lg.font-medium {{ $t('dashboard.topProducts.title') }}
      template(#default)
        UTable(:columns="topProductsColumns" :rows="dashboard.topProducts")
          template(#categories-data="{ row }")
            div(v-if="row.categories && row.categories.length")
              div.mb-1(v-for="categoryItem in row.categories" :key="categoryItem.uuid")
                UBadge(variant="subtle" :label="categoryItem.name")
            div(v-else)
              span.text-gray-400 -
          template(#laboratory-data="{ row }")
            span {{ row.laboratory ? row.laboratory.name : '' }}

div.p-8.text-center(v-else)
  h2.text-2xl.font-bold.text-red-600.mb-4 Accès refusé
  p.text-gray-600 Vous n'avez pas l'autorisation d'accéder au tableau de bord.
</template>

<script lang="ts" setup>
import { useUserProfileStore } from '@store/userProfileStore'
import { formatCurrency } from '@utils/formatters'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { useLaboratoryGateway } from '../../../../../../gateways/laboratoryGateway'
import { listCategories } from '../../../../../core/usecases/categories/list-categories/listCategories'
import { listLaboratories } from '../../../../../core/usecases/laboratories/laboratory-listing/listLaboratories'
import { getCategoriesVM } from '../../../view-models/categories/get-categories/getCategoriesVM'
import { getLaboratoriesVM } from '../../../view-models/laboratories/get-laboratories/getLaboratoriesVM'
import { getPermissionsVM } from '../../../view-models/permissions/getPermissionsVM'
import CategoriesPieChart from '../../components/molecules/CategoriesPieChart.vue'
import DeliveryMethodsPieChart from '../../components/molecules/DeliveryMethodsPieChart.vue'
import LaboratoriesPieChart from '../../components/molecules/LaboratoriesPieChart.vue'
import ProductStockPieChart from '../../components/molecules/ProductStockPieChart.vue'
import { useDashboardData } from '../../composables/useDashboardData'

definePageMeta({ layout: 'main' })

const { t } = useI18n()

const { isLoading, dashboard, fetchDashboardData } = useDashboardData()

const permissions = computed(() => getPermissionsVM())
const userProfileStore = useUserProfileStore()

const productLimit = ref(50)
const startDate = ref<number | null>(null)
const endDate = ref<number | null>(null)

interface CategoryItem {
  uuid: string
  name: string
  [key: string]: any
}

interface LaboratoryItem {
  uuid: string
  name: string
  [key: string]: any
}

const laboratory = ref<string | LaboratoryItem | null>(null)
const category = ref<string | CategoryItem | null>(null)
const promotionOnly = ref(false)
const showFilters = ref(false)
const isLargeScreen = ref(false)

const laboratoriesVM = computed(() => {
  return getLaboratoriesVM()
})

const categoriesVM = computed(() => {
  return getCategoriesVM()
})

const areProductFiltersApplied = ref(false)
const areDateFiltersApplied = ref(false)

const currentYear = computed(() => {
  if (endDate.value) {
    return new Date(endDate.value).getFullYear().toString()
  }
  return new Date().getFullYear().toString()
})

const previousYear = computed(() => {
  if (endDate.value) {
    return (new Date(endDate.value).getFullYear() - 1).toString()
  }
  return (new Date().getFullYear() - 1).toString()
})

const statsCards = computed(() => [
  {
    title: t('dashboard.totalSales'),
    value: dashboard.value.totalSales.count.toLocaleString(),
    previousYearValue:
      dashboard.value.previousYearTotalSales.count.toLocaleString(),
    description: t('dashboard.orders'),
    isApplicableWithProductFilters: true,
    showDualYear: true
  },
  {
    title: t('dashboard.totalTurnover'),
    value: formatCurrency(dashboard.value.totalSales.turnover),
    previousYearValue: formatCurrency(
      dashboard.value.previousYearTotalSales.turnover
    ),
    description: t('dashboard.revenue'),
    isApplicableWithProductFilters: true,
    showDualYear: true
  },
  {
    title: t('dashboard.canceledTurnover'),
    value: formatCurrency(dashboard.value.totalSales.canceledTurnover),
    previousYearValue: formatCurrency(
      dashboard.value.previousYearTotalSales.canceledTurnover
    ),
    description: t('dashboard.canceledRevenue'),
    isApplicableWithProductFilters: true,
    showDualYear: false
  },
  {
    title: t('dashboard.deliveryPrice'),
    value: formatCurrency(dashboard.value.totalSales.deliveryPrice),
    previousYearValue: formatCurrency(
      dashboard.value.previousYearTotalSales.deliveryPrice
    ),
    description: t('dashboard.deliveryRevenue'),
    isApplicableWithProductFilters: false,
    showDualYear: false
  },
  {
    title: t('dashboard.averageBasket'),
    value: formatCurrency(dashboard.value.totalSales.averageBasketValue),
    previousYearValue: formatCurrency(
      dashboard.value.previousYearTotalSales.averageBasketValue
    ),
    description: t('dashboard.perOrder'),
    isApplicableWithProductFilters: false,
    showDualYear: false
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
    params.laboratoryUuid =
      typeof laboratory.value === 'string'
        ? laboratory.value
        : laboratory.value.uuid
  }

  if (category.value) {
    params.categoryUuid =
      typeof category.value === 'string' ? category.value : category.value.uuid
  }

  if (promotionOnly.value) {
    params.promotionOnly = promotionOnly.value
  }

  await fetchDashboardData(params)

  areProductFiltersApplied.value =
    !!laboratory.value || !!category.value || promotionOnly.value
  areDateFiltersApplied.value = !!startDate.value || !!endDate.value
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const resetFilters = () => {
  productLimit.value = 50
  startDate.value = null
  endDate.value = null
  laboratory.value = null
  category.value = null
  promotionOnly.value = false
  fetchFilteredDashboardData()
}

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 768
}

onMounted(() => {
  listLaboratories(useLaboratoryGateway())
  listCategories(useCategoryGateway())

  const stopWatch = watch(
    () => userProfileStore.current,
    (profile) => {
      if (profile && permissions.value.canAccessDashboard) {
        fetchFilteredDashboardData()
        stopWatch()
      }
    },
    { immediate: true }
  )

  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
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

const clearCategory = () => {
  category.value = null
}

const onSelectCategory = (categoryItem: CategoryItem) => {
  category.value = {
    uuid: categoryItem.uuid,
    name: categoryItem.name
  }
  fetchFilteredDashboardData()
}

const navigateToParentCategory = async () => {
  if (!category.value) {
    return
  }
  const categoryGateway = useCategoryGateway()
  const categoryUuid =
    typeof category.value === 'string' ? category.value : category.value.uuid
  const currentCategory = await categoryGateway.getByUuid(categoryUuid)
  if (currentCategory && currentCategory.parentUuid) {
    const parentCategory = await categoryGateway.getByUuid(
      currentCategory.parentUuid
    )
    category.value = parentCategory
  } else {
    category.value = null
  }
  fetchFilteredDashboardData()
}

const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const categorySearch = (query: string) => {
  if (!query || !categoriesVM.value.items) {
    return categoriesVM.value.items || []
  }

  const normalizedQuery = normalizeText(query)

  return categoriesVM.value.items.filter((option: { name: string }) => {
    const optionName = option.name || ''
    const normalizedName = normalizeText(optionName)
    return normalizedName.includes(normalizedQuery)
  })
}

const laboratorySearch = (query: string) => {
  if (!query || !laboratoriesVM.value.items) {
    return laboratoriesVM.value.items || []
  }

  const normalizedQuery = normalizeText(query)

  return laboratoriesVM.value.items.filter((option: { name: string }) => {
    const optionName = option.name || ''
    const normalizedName = normalizeText(optionName)
    return normalizedName.includes(normalizedQuery)
  })
}
</script>
