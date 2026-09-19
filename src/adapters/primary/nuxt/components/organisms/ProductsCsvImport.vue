<template lang="pug">
div
  div.flex.items-center.gap-4.mb-4
    ft-button.button-solid(
      :disabled="isImporting"
      :loading="isImporting"
      @click="triggerFileInput"
    )
      icon.icon-md.mr-2(v-if="!isImporting" name="ic:baseline-upload-file")
      | {{ isImporting ? $t('products.csvImport.loading') : $t('products.csvImport.button') }}
    input.hidden(
      ref="csvFileInput"
      type="file"
      accept=".csv"
      @change="handleCSVImport"
    )
  div.flex.flex-col.gap-2.mb-4(v-if="feedback")
    UAlert(
      v-if="feedback.addedCount > 0"
      :title="$t('products.csvImport.added', { count: feedback.addedCount })"
      color="green"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid' }"
      @close="clearFeedback"
    )
    UAlert(
      v-if="feedback.ineligibleCount > 0"
      :title="$t('products.csvImport.ineligible', { count: feedback.ineligibleCount })"
      color="orange"
    )
    UAlert(
      v-if="feedback.notFoundCodes.length > 0"
      :title="$t('products.csvImport.notFound', { count: feedback.notFoundCodes.length })"
      color="orange"
    )
      template(#description)
        div.max-h-32.overflow-y-auto.text-sm.font-mono
          | {{ feedback.notFoundCodes.join(', ') }}
    UAlert(
      v-if="feedback.error"
      :title="feedback.error"
      color="red"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid' }"
      @close="clearFeedback"
    )
</template>

<script lang="ts" setup>
import type { Ean13ResolutionScope } from '@core/gateways/productGateway'
import type { UUID } from '@core/types/types'
import { importProductsFromCSV } from '@core/usecases/product/import-products-csv/importProductsFromCSV'
import { useProductGateway } from '../../../../../../gateways/productGateway'

interface ImportFeedback {
  addedCount: number
  ineligibleCount: number
  notFoundCodes: Array<string>
  error?: string
}

const props = defineProps<{
  scope: Ean13ResolutionScope
}>()

const emit = defineEmits<{
  (e: 'imported', uuids: Array<UUID>): void
}>()

const { t } = useI18n()
const csvFileInput = ref<HTMLInputElement>()
const isImporting = ref(false)
const feedback = ref<ImportFeedback>()

const triggerFileInput = () => {
  csvFileInput.value?.click()
}

const handleCSVImport = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isImporting.value = true
  try {
    const result = await importProductsFromCSV(
      file,
      props.scope,
      useProductGateway(),
      (uuids) => emit('imported', uuids)
    )
    feedback.value = {
      addedCount: result.addedCount,
      ineligibleCount: result.ineligibleCount,
      notFoundCodes: result.notFoundCodes
    }
  } catch {
    feedback.value = {
      addedCount: 0,
      ineligibleCount: 0,
      notFoundCodes: [],
      error: t('products.csvImport.error')
    }
  } finally {
    isImporting.value = false
    target.value = ''
  }
}

const clearFeedback = () => {
  feedback.value = undefined
}
</script>
