<template lang="pug">
.section
  .mb-6.flex.items-center.justify-between.gap-4
    .flex.items-center.gap-4
      .h-8.w-1.rounded-full.bg-customPrimary-500
      h1.text-page-title {{ $t('assistance.title') }}
    ft-button.button-solid(icon="i-heroicons-lifebuoy" @click="open") {{ $t('assistance.report') }}

  .mb-4.flex.items-center.gap-4(v-if="hasLoadFailed")
    UAlert.flex-1(color="red" variant="soft" :description="$t('assistance.empty.loadFailed')")
    ft-button(variant="outline" color="primary" @click="reload") {{ $t('assistance.empty.retry') }}

  TabGroup.border-b.border-gray-200(as="div")
    TabList.-mb-px.flex.space-x-4
      Tab.rounded-md.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
        v-for="tab in tabs"
        v-slot="{ selected }"
        :key="tab.key"
        as="div"
      )
        div.whitespace-nowrap.flex.items-center.py-4.px-1.border-b-2.font-medium.text-sm(
          :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
        )
          div {{ $t(tab.labelKey) }}
          span.ml-3.rounded-full.text-xs.font-medium(
            :class="[selected ? 'bg-contrast text-colored' : 'bg-light text-contrast', 'py-0.5 px-2.5']"
          ) {{ tab.count }}
    TabPanels
      TabPanel.mt-4(v-for="tab in tabs" :key="tab.key")
        ft-table(
          v-if="vm.isLoading || tab.items.length > 0"
          :headers="headers"
          :items="tab.items"
          :is-loading="vm.isLoading"
          item-key="id"
          @clicked="openRequest"
        )
          template(#reference="{ item }")
            span.font-mono.text-gray-500 {{ item.reference }}
          template(#subject="{ item }")
            span.inline-flex.items-center.font-medium(class="gap-1.5")
              | {{ $t(`assistance.categoryShort.${item.category.toLowerCase()}`) }}
              span(v-if="item.subjectLabel") · {{ item.subjectLabel }}
              NuxtLink.text-gray-400(
                v-if="item.subjectPageUrl"
                :to="item.subjectPageUrl"
                class="hover:text-colored"
                @click.stop
              )
                UIcon.h-4.w-4(name="i-heroicons-arrow-top-right-on-square")
          template(#problem="{ item }")
            span.block.max-w-md.truncate(:title="item.title") {{ item.title }}
          template(#author="{ item }")
            span.text-gray-500 {{ item.author }}
          template(#status="{ item }")
            ft-assistance-status-badge(:status="item.status")
          template(#lastActivity="{ item }")
            span.whitespace-nowrap.text-gray-500 {{ $t(item.lastActivity.key, item.lastActivity.params) }}
        p.py-10.text-center.text-sm.text-gray-500(v-else-if="!hasLoadFailed") {{ $t(tab.emptyKey) }}
</template>

<script lang="ts" setup>
import { useAssistancePanel } from '@adapters/primary/nuxt/composables/useAssistancePanel'
import { listAssistanceRequestsVM } from '@adapters/primary/view-models/assistance/assistance-requests-list/listAssistanceRequestsVM'
import { listAssistanceRequests } from '@core/usecases/assistance/assistance-requests-listing/listAssistanceRequests'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { useAssistanceRequestGateway } from '../../../../../../gateways/assistanceRequestGateway'
import { useDateProvider } from '../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

const NOW_REFRESH_INTERVAL_MS = 60 * 1000

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const { open } = useAssistancePanel()
const dateProvider = useDateProvider()

const now = ref(dateProvider.now())
const hasLoadFailed = ref(false)
let refreshTimer: ReturnType<typeof setInterval> | undefined

const vm = computed(() => listAssistanceRequestsVM(now.value))

const headers = computed(() =>
  vm.value.headers.map((header) => ({ ...header, name: t(header.name) }))
)

const tabs = computed(() => [
  {
    key: 'open',
    labelKey: 'assistance.tabs.open',
    emptyKey: 'assistance.empty.open',
    ...vm.value.open
  },
  {
    key: 'resolved',
    labelKey: 'assistance.tabs.resolved',
    emptyKey: 'assistance.empty.resolved',
    ...vm.value.resolved
  }
])

const reload = async () => {
  hasLoadFailed.value = false
  try {
    await listAssistanceRequests(useAssistanceRequestGateway())
  } catch {
    hasLoadFailed.value = true
    toast.add({ title: t('assistance.empty.loadFailed'), color: 'red' })
  }
}

const openRequest = (id: string) => {
  router.push(`/assistance/${id}`)
}

const refreshNow = () => {
  now.value = dateProvider.now()
}

onMounted(() => {
  reload()
  refreshTimer = setInterval(refreshNow, NOW_REFRESH_INTERVAL_MS)
})

onUnmounted(() => {
  clearInterval(refreshTimer)
})
</script>
