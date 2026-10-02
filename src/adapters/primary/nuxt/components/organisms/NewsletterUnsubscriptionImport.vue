<template lang="pug">
div
  ft-button.text-xl.px-6(
    variant="outline"
    color="primary"
    icon="i-heroicons-arrow-up-tray"
    @click="openFilePicker"
  ) {{ $t('newsletter.unsubscriptionImport.button') }}
  input.hidden(
    ref="fileInput"
    type="file"
    accept=".csv,.txt,text/csv,text/plain"
    @change="fileChosen"
  )
  ft-modal(
    :model-value="importVM.isStarted"
    :prevent-close="importVM.isUnsubscribing"
    @update:model-value="close"
    @close="close"
  )
    .flex.flex-col.gap-6.p-2
      h3.text-lg.font-semibold {{ $t('newsletter.unsubscriptionImport.title') }}
      p.text-gray-600(v-if="importVM.hasNoEmail") {{ $t('newsletter.unsubscriptionImport.noEmail') }}
      div(v-else-if="importVM.result")
        .text-5xl.font-semibold.tabular-nums(v-if="importVM.result.unsubscribedCount > 0") {{ formatCount(importVM.result.unsubscribedCount) }}
        p.text-lg {{ $t('newsletter.unsubscriptionImport.unsubscribed', importVM.result.unsubscribedCount) }}
        p.text-sm.text-gray-500.mt-2(v-if="importVM.result.notSubscribedCount > 0") {{ $t('newsletter.unsubscriptionImport.notSubscribed', { count: formatCount(importVM.result.notSubscribedCount) }, importVM.result.notSubscribedCount) }}
      template(v-else)
        div
          .text-5xl.font-semibold.tabular-nums {{ formatCount(importVM.emailsCount) }}
          p.text-lg.break-words {{ $t('newsletter.unsubscriptionImport.found', { fileName: importVM.fileName }, importVM.emailsCount) }}
          p.text-sm.text-gray-500.mt-2.break-words {{ emailsSummary }}
        UFormGroup(
          v-if="importVM.canChooseColumn"
          :label="$t('newsletter.unsubscriptionImport.columnLabel')"
        )
          USelect(
            :model-value="importVM.selectedPosition"
            :options="columnOptions"
            value-attribute="value"
            option-attribute="label"
            :disabled="importVM.isUnsubscribing"
            @update:model-value="columnChanged"
          )
        div(v-if="importVM.isUnsubscribing")
          UProgress(:value="importVM.processedCount" :max="importVM.emailsCount")
          p.text-sm.text-gray-500.mt-2.tabular-nums {{ $t('newsletter.unsubscriptionImport.progress', { processed: formatCount(importVM.processedCount), total: formatCount(importVM.emailsCount) }) }}
        UAlert(
          v-if="hasFailed"
          :title="$t('newsletter.unsubscriptionImport.error')"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
        )
      .flex.justify-end.gap-3
        ft-button.button-solid(
          v-if="importVM.result || importVM.hasNoEmail"
          @click="close"
        ) {{ $t('newsletter.unsubscriptionImport.done') }}
        template(v-else)
          ft-button(
            variant="outline"
            color="primary"
            :disabled="importVM.isUnsubscribing"
            @click="close"
          ) {{ $t('newsletter.unsubscriptionImport.cancel') }}
          ft-button.button-solid(
            :disabled="!importVM.canUnsubscribe"
            :loading="importVM.isUnsubscribing"
            @click="confirm"
          ) {{ $t('newsletter.unsubscriptionImport.confirm', { count: formatCount(importVM.emailsCount) }, importVM.emailsCount) }}
</template>

<script lang="ts" setup>
import { getNewsletterUnsubscriptionImportVM } from '@adapters/primary/view-models/newsletters/get-newsletter-unsubscription-import-vm/getNewsletterUnsubscriptionImportVM'
import { closeNewsletterUnsubscriptionImport } from '@core/usecases/newsletter-subscriptions/newsletter-unsubscription-import/closeNewsletterUnsubscriptionImport'
import { selectNewsletterUnsubscriptionColumn } from '@core/usecases/newsletter-subscriptions/newsletter-unsubscription-import/selectNewsletterUnsubscriptionColumn'
import { startNewsletterUnsubscriptionImport } from '@core/usecases/newsletter-subscriptions/newsletter-unsubscription-import/startNewsletterUnsubscriptionImport'
import { unsubscribeManyFromNewsletter } from '@core/usecases/newsletter-subscriptions/newsletter-unsubscription-import/unsubscribeManyFromNewsletter'
import { useNewsletterGateway } from '../../../../../../gateways/newsletterGateway'

const { t } = useI18n()
const fileInput = ref<HTMLInputElement>()
const hasFailed = ref(false)

const importVM = computed(() => getNewsletterUnsubscriptionImportVM())

const formatCount = (count: number) => count.toLocaleString('fr-FR')

const emailsSummary = computed(() => {
  const sample = importVM.value.emailsSample.join(', ')
  const othersCount = importVM.value.otherEmailsCount
  if (othersCount === 0) return sample
  return `${sample} ${t('newsletter.unsubscriptionImport.others', { count: formatCount(othersCount) }, othersCount)}`
})

const columnOptions = computed(() =>
  importVM.value.columns.map((column) => ({
    value: column.position,
    label: t('newsletter.unsubscriptionImport.columnOption', {
      name:
        column.name ??
        t('newsletter.unsubscriptionImport.columnWithoutName', {
          position: column.position
        }),
      count: formatCount(column.emailsCount)
    })
  }))
)

const openFilePicker = () => {
  fileInput.value?.click()
}

const fileChosen = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  hasFailed.value = false
  await startNewsletterUnsubscriptionImport(file)
  target.value = ''
}

const columnChanged = (position: number | string) => {
  selectNewsletterUnsubscriptionColumn(Number(position))
}

const confirm = async () => {
  hasFailed.value = false
  try {
    await unsubscribeManyFromNewsletter(useNewsletterGateway())
  } catch {
    hasFailed.value = true
  }
}

const close = () => {
  if (importVM.value.isUnsubscribing) return
  hasFailed.value = false
  closeNewsletterUnsubscriptionImport()
}

onUnmounted(closeNewsletterUnsubscriptionImport)
</script>
