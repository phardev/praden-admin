<template lang="pug">
.mt-6.space-y-8
  section
    h2.text-lg.font-semibold.text-gray-900.mb-3 {{ $t('welcomeCode.sentNow') }}
    .rounded-lg.border-2.border-green-500.bg-green-50.p-4(v-if="welcomeCodesVm.sentCode")
      .flex.flex-wrap.items-center.gap-x-6.gap-y-2
        span.text-2xl.font-bold.text-gray-900 {{ welcomeCodesVm.sentCode.code }}
        span.text-gray-900 {{ $t(welcomeCodesVm.sentCode.discount.key, welcomeCodesVm.sentCode.discount.params) }}
        span.text-gray-600(v-if="welcomeCodesVm.sentCode.minimumAmount")
          | {{ $t('welcomeCode.fromMinimumAmount', { amount: welcomeCodesVm.sentCode.minimumAmount }) }}
        span.text-gray-600 {{ $t(welcomeCodesVm.sentCode.period.key, welcomeCodesVm.sentCode.period.params) }}
    .rounded-lg.border.border-dashed.border-gray-300.py-6.text-center.text-gray-600(v-else-if="!welcomeCodesVm.isLoading")
      | {{ $t('welcomeCode.noneSent') }}
    .h-16.bg-gray-200.rounded.animate-pulse(v-else)

  section
    h2.text-lg.font-semibold.text-gray-900.mb-3 {{ $t('welcomeCode.allCodes') }}
    ft-table(
      :headers="translatedHeaders"
      :items="welcomeCodesVm.items"
      :is-loading="welcomeCodesVm.isLoading"
      item-key="uuid"
      @clicked="edit"
    )
      template(#discount="{ item }")
        span {{ $t(item.discount.key, item.discount.params) }}
      template(#period="{ item }")
        span {{ $t(item.period.key, item.period.params) }}
      template(#status="{ item }")
        UBadge(:color="item.status.color" variant="subtle") {{ $t(item.status.key) }}
      template(#conversionRate="{ item }")
        span {{ item.conversionRate || $t('welcomeCode.noConversionRate') }}
      template(#actions="{ item }")
        .flex.items-center.gap-2
          UButton(
            color="gray"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            :aria-label="$t('welcomeCode.edit')"
            @click.stop="edit(item.uuid)"
          )
          UButton(
            v-if="item.isActive"
            color="gray"
            variant="outline"
            size="xs"
            :disabled="welcomeCodesVm.isSaving"
            :label="$t('welcomeCode.disable')"
            @click.stop="disable(item.uuid)"
          )
          UButton(
            v-else
            color="primary"
            variant="outline"
            size="xs"
            :disabled="welcomeCodesVm.isSaving"
            :label="$t('welcomeCode.enable')"
            @click.stop="enable(item.uuid)"
          )
</template>

<script lang="ts" setup>
import type { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import type { GetWelcomeCodesVM } from '@adapters/primary/view-models/welcome-codes/get-welcome-codes/getWelcomeCodesVM'

const props = defineProps<{
  welcomeCodesVm: GetWelcomeCodesVM
}>()

const emit = defineEmits<{
  (e: 'edit', uuid: string): void
  (e: 'enable', uuid: string): void
  (e: 'disable', uuid: string): void
}>()

const { t } = useI18n()

const translatedHeaders = computed(
  (): Array<Header> =>
    props.welcomeCodesVm.headers.map((header: Header) => ({
      ...header,
      name: t(header.name)
    }))
)

const edit = (uuid: string) => {
  emit('edit', uuid)
}

const enable = (uuid: string) => {
  emit('enable', uuid)
}

const disable = (uuid: string) => {
  emit('disable', uuid)
}
</script>
