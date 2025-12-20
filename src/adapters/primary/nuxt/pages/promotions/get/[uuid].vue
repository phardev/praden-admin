<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer promotion
  h1.text-title Voir promotion
  promotion-form(
    :vm="vm"
  )

  .mt-12
    .flex.justify-between.items-center.mb-6
      h2.text-2xl.font-semibold {{ $t('promotion.stats.title') }}
      ft-button.button-outline(@click="exportPDF" :disabled="isExportingPDF")
        span(v-if="isExportingPDF") {{ $t('common.loading') }}
        span(v-else) {{ $t('promotion.stats.exportPdf') }}

    .mb-6
      promotion-stats-cards(:stats-vm="statsVM")

    .mb-6(v-if="statsVM")
      .h-96
        promotion-stats-pie-chart(:stats-vm="statsVM")

    promotion-stats-table(:stats-vm="statsVM")
</template>

<script lang="ts" setup>
import { promotionFormGetVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormGetVM'
import { promotionStatsVM } from '@adapters/primary/view-models/promotions/promotion-stats/promotionStatsVM'
import { exportPromotionStatsPDF } from '@core/usecases/promotions/export-promotion-stats-pdf/exportPromotionStatsPDF'
import { getPromotionStats } from '@core/usecases/promotions/get-promotion-stats/getPromotionStats'
import { getPromotion } from '@core/usecases/promotions/promotion-get/getPromotion'
import { useDateProvider } from '../../../../../../../gateways/dateProvider'
import { useFileDownloadService } from '../../../../../../../gateways/fileDownloadService'
import { usePromotionGateway } from '../../../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const statsVM = ref()
const isExportingPDF = ref(false)
const route = useRoute()
const promotionUuid = route.params.uuid as string
const router = useRouter()
const routeName = String(router.currentRoute.value.name)
const promotionGateway = usePromotionGateway()
const fileDownloadService = useFileDownloadService()
const dateProvider = useDateProvider()

onMounted(async () => {
  await Promise.all([
    getPromotion(promotionUuid, promotionGateway),
    getPromotionStats(promotionUuid, promotionGateway)
  ])

  vm.value = promotionFormGetVM(routeName)
  statsVM.value = promotionStatsVM()
})

const edit = () => {
  router.push(`/promotions/edit/${promotionUuid}`)
}

const exportPDF = async () => {
  isExportingPDF.value = true
  try {
    await exportPromotionStatsPDF(
      promotionUuid,
      promotionGateway,
      fileDownloadService,
      dateProvider
    )
  } catch (error) {
    console.error('Failed to export PDF:', error)
  } finally {
    isExportingPDF.value = false
  }
}
</script>
