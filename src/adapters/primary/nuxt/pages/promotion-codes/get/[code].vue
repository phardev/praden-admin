<template lang="pug">
  .section(v-if="vm")
    .flex.flex-row-reverse
      ft-button.button-solid.text-xl.px-6(@click="edit") {{ $t('promotionCode.editButton') }}
    h1.text-title {{ $t('promotionCode.viewTitle') }}
    promotion-code-form(
      :vm="vm"
    )
    .stats-section.mt-8(v-if="statsVM")
      h2.text-subtitle.mb-4 {{ $t('promotionCode.stats.title') }}
      .stats-grid.grid.gap-4.mb-6(class="grid-cols-1 md:grid-cols-3")
        .stat-item.p-4.bg-gray-50.rounded
          .label.text-sm.text-gray-600.mb-1 {{ $t('promotionCode.stats.usageCount') }}
          .value.text-2xl.font-bold {{ statsVM.usageCount }}
        .stat-item.p-4.bg-gray-50.rounded
          .label.text-sm.text-gray-600.mb-1 {{ $t('promotionCode.stats.totalSales') }}
          .value.text-2xl.font-bold {{ statsVM.totalSales }}
        .stat-item.p-4.bg-gray-50.rounded
          .label.text-sm.text-gray-600.mb-1 {{ $t('promotionCode.stats.totalDiscountGiven') }}
          .value.text-2xl.font-bold {{ statsVM.totalDiscountGiven }}
      .chart-section.mt-8.bg-white.border.border-gray-200.rounded-lg.p-6(v-if="chartData.length > 0")
        h3.text-lg.font-semibold.mb-4 {{ $t('promotionCode.stats.salesDistribution') }}
        .h-64
          pie-chart(:data="chartData" :config="chartConfig" :customColors="chartColors")
      .email-usages.mt-8(v-if="statsVM.emailUsages.length > 0")
        h3.text-lg.font-semibold.mb-4 {{ $t('promotionCode.stats.emailUsages') }}
        .grid.grid-cols-1.gap-3(class="md:grid-cols-2 lg:grid-cols-3")
          .email-usage-card(
            v-for="usage in statsVM.emailUsages"
            :key="usage.email"
            class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          )
            .flex.items-center.justify-between
              .email-info.flex-1(class="min-w-0")
                .email.text-sm.font-medium.text-gray-900.truncate {{ usage.email }}
              .usage-badge.ml-3(class="flex-shrink-0")
                .px-3.py-1.rounded-full.text-sm.font-semibold.whitespace-nowrap(class="bg-customPrimary-100 text-customPrimary-800")
                  | {{ usage.usageCount }}
                  span.text-xs.font-normal(class="ml-0.5") {{ usage.usageCount > 1 ? $t('promotionCode.stats.usagePlural') : $t('promotionCode.stats.usageSingular') }}
</template>

<script lang="ts" setup>
import { promotionCodeFormGetVM } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormGetVM'
import { promotionCodeStatsVM } from '@adapters/primary/view-models/promotion-codes/promotion-code-stats/promotionCodeStatsVM'
import { getPromotionCode } from '@core/usecases/promotion-codes/get-promotion-code/getPromotionCode'
import { getPromotionCodeStats } from '@core/usecases/promotion-codes/get-promotion-code-stats/getPromotionCodeStats'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import { usePromotionCodeGateway } from '../../../../../../../gateways/promotionCodeGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const vm = ref()
const statsVM = ref()
const route = useRoute()
const code = route.params.code as string
const router = useRouter()
const routeName = router.currentRoute.value.name as string

const chartData = computed(() => {
  if (!statsVM.value) return []

  if (statsVM.value.totalSalesRaw === 0) return []

  const netSales =
    statsVM.value.totalSalesRaw - statsVM.value.totalDiscountGivenRaw

  return [
    {
      id: 'netSales',
      name: t('promotionCode.stats.netSales'),
      count: netSales
    },
    {
      id: 'discount',
      name: t('promotionCode.stats.discount'),
      count: statsVM.value.totalDiscountGivenRaw
    }
  ]
})

const chartConfig = computed(() => ({
  idField: 'id',
  nameField: 'name',
  countField: 'count',
  tooltipLabel: t('promotionCode.stats.tooltipLabel'),
  innerRadius: 0
}))

const chartColors = {
  netSales: '#0F9D58',
  discount: '#DB4437'
}

onMounted(async () => {
  await Promise.all([
    getPromotionCode(code, usePromotionCodeGateway()),
    getPromotionCodeStats(code, usePromotionCodeGateway())
  ])
  vm.value = promotionCodeFormGetVM(routeName)
  statsVM.value = promotionCodeStatsVM()
})

const edit = () => {
  router.push(`/promotion-codes/edit/${code}`)
}
</script>
