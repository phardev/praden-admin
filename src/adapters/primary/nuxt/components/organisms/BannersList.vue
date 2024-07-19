<template lang="pug">
tab-group.border-b.border-gray-200(as="div")
  tab-list.-mb-px.flex.space-x-4
    tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
      v-for="(group, tabIndex) in Object.keys(bannersVm)"
      v-slot="{ selected }"
      :key="tabIndex"
      as="div"
    )
      div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
        :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
      )
        div {{ group }}
  tab-panels(v-for="(group, index) in Object.values(bannersVm)" :key="index")
    tab-panel.mt-4
      div(v-if="index === 0")
        draggable(
          v-model="banners"
          item-key="uuid"
        )
          template(#item="{ element }")
            BannerListItem(
              v-if="element.isInProgress"
              :banner="element"
            )
      div(v-else-if="index === 1")
        draggable(
          v-model="banners"
          item-key="uuid"
        )
          template(#item="{ element }")
            BannerListItem(
              v-if="element.isFuture"
              :banner="element"
            )
      draggable(
        v-else
        v-model="banners"
        item-key="uuid"
      )
        template(#item="{ element }")
          BannerListItem(:banner="element")
</template>

<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import draggable from 'vuedraggable'
import { reorderBanners } from '@core/usecases/banners/banners-reorder/reorderBanners'
import { useBannerGateway } from '../../../../../../gateways/bannerGateway'
import BannerListItem from '@adapters/primary/nuxt/components/molecules/BannerListItem.vue'

definePageMeta({ layout: 'main' })

const props = defineProps({
  bannersVm: {
    type: Object,
    default() {
      return {}
    }
  }
})

const allBanners = ref([])

watch(
  () => props.bannersVm,
  () => {
    allBanners.value = props.bannersVm?.Tous?.items || []
  },
  { immediate: true }
)

const banners = computed({
  get: () => allBanners.value,
  set: (v) => {
    reorderBanners(
      v.map((b) => b.uuid),
      useBannerGateway()
    )
  }
})
</script>
