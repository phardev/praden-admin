<template lang="pug">
tab-group.border-b.border-gray-200(as="div")
  tab-list.-mb-px.flex.space-x-4
    tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
      v-for="(group, tabIndex) in Object.keys(promotionsVm)"
      v-slot="{ selected }"
      :key="tabIndex"
      as="div"
    )
      div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
        :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
      )
        div {{ group }}
          span.hidden.ml-3.rounded-full.text-xs.font-medium(
            v-if="promotionsVm[group].count"
            :class="[selected ? 'bg-contrast text-colored' : 'bg-light text-contrast', 'py-0.5 px-2.5 md:inline-block']"
          ) {{ promotionsVm[group].count }}
  tab-panels(v-for="(group, index) in Object.values(promotionsVm)" :key="index")
    tab-panel.mt-4
      ft-table(
        :headers="group.table.headers"
        :items="group.table.items"
      )
        template(#startDate="{ item }")
          time(:datetime='item.startDatetime') {{ item.startDate }}
        template(#endDate="{ item }")
          time(:datetime='item.endDatetime') {{ item.endDate }}
</template>

<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { listPromotions } from '@core/usecases/promotions/promotions-listing/listPromotions'
import { usePromotionGateway } from '../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listPromotions(usePromotionGateway())
})

defineProps({
  promotionsVm: {
    type: Object,
    default() {
      return {}
    }
  }
})
</script>
