<template lang="pug">
div(v-if="currentVM")
  div.flex.gap-6.mb-4
    ft-button.text-2xl.flex-1.h-24(
      v-for="(typeChoice, index) in currentVM.getAvailableTypeChoices()"
      :key="index"
      :disabled="!currentVM.get('type').canEdit"
      :variant="typeChoice.type === currentVM.get('type').value ? 'solid' : 'outline'"
      @click="currentVM.set('type', typeChoice.type)"
    )
      div.flex.flex-col.items-center.justify-center
        icon.icon-xl.mr-2(:name="getIcon(typeChoice.type)")
        span {{ typeChoice.text }}
  UFormGroup.pb-4(label="Nom" name="name")
    ft-text-field(
      :model-value="currentVM.get('name').value"
      :disabled="!currentVM.get('name').canEdit"
      label="Nom"
      @update:model-value="nameChanged"
    )
  UFormGroup.pb-4(label="Montant" name="amount")
    ft-currency-input(
      v-if="currentVM.get('type').value === ReductionType.Fixed"
      v-model="currentVM.get('amount').value"
      label="Valeur de la réduction (€)"
      :disabled="!currentVM.get('amount').canEdit"
      @update:model-value="amountChanged"
    )
    ft-percentage-input(
      v-if="currentVM.get('type').value === ReductionType.Percentage"
      v-model="currentVM.get('amount').value"
      label="Valeur de la réduction (%)"
      :disabled="!currentVM.get('amount').canEdit"
      @update:model-value="amountChanged"
    )
  div.flex.mb-4.gap-8
    UFormGroup.pb-4(label="Date de début" name="startDate")
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton(
          icon="i-heroicons-calendar-days-20-solid"
          :disabled="!currentVM.get('startDate').canEdit"
          :label="currentVM.get('startDate').value ? format(currentVM.get('startDate').value, 'd MMMM yyy', { locale: fr }) : 'Choisissez une date'"
        )
          template(#trailing)
            UButton(
              v-show="currentVM.get('startDate').canEdit && currentVM.get('startDate').value"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click.prevent="clearStartDate"
            )
        template(#panel="{ close }")
          ft-date-picker(
            v-model="currentVM.get('startDate').value"
            @update:model-value="startDateChanged"
            @close="close"
          )
    UFormGroup.pb-4(label="Date de fin" name="endDate")
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton(
          icon="i-heroicons-calendar-days-20-solid"
          :disabled="!currentVM.get('endDate').canEdit"
          :label="currentVM.get('endDate').value ? format(currentVM.get('endDate').value, 'd MMMM yyy', { locale: fr }) : 'Choisissez une date'"
        )
          template(#trailing)
            UButton(
              v-show="currentVM.get('endDate').canEdit && currentVM.get('endDate').value"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click.prevent="clearEndDate"
            )
        template(#panel="{ close }")
          ft-date-picker(
            v-model="currentVM.get('endDate').value"
            :is-end-date="true"
            @update:model-value="endDateChanged"
            @close="close"
          )
  div.flex.items-center.gap-4.mb-4(v-if="currentVM.get('products').canEdit")
    ft-button.button-solid(
      :disabled="isImporting"
      :loading="isImporting"
      @click="triggerFileInput"
    )
      icon.icon-md.mr-2(v-if="!isImporting" name="ic:baseline-upload-file")
      | {{ isImporting ? 'Import en cours...' : 'Importer depuis CSV' }}
    input.hidden(
      ref="csvFileInput"
      type="file"
      accept=".csv"
      @change="handleCSVImport"
    )
  div.flex.flex-col.gap-2.mb-4(v-if="importFeedback")
    UAlert(
      v-if="importFeedback.addedCount > 0"
      :title="`${importFeedback.addedCount} produit(s) ajouté(s)`"
      color="green"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid' }"
      @close="clearImportFeedback"
    )
    UAlert(
      v-if="importFeedback.ineligibleCount > 0"
      :title="`${importFeedback.ineligibleCount} produit(s) non éligible(s) aux promotions`"
      color="orange"
    )
    UAlert(
      v-if="importFeedback.notFoundCodes.length > 0"
      :title="`${importFeedback.notFoundCodes.length} code(s) EAN13 non trouvé(s)`"
      color="orange"
    )
      template(#description)
        div.max-h-32.overflow-y-auto.text-sm.font-mono
          | {{ importFeedback.notFoundCodes.join(', ') }}
    UAlert(
      v-if="importFeedback.error"
      :title="importFeedback.error"
      color="red"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid' }"
      @close="clearImportFeedback"
    )
  ft-text-field(
    v-if="currentVM.get('products').canEdit"
    v-model="search"
    placeholder="Rechercher par nom, référence, catégorie, laboratoire"
    for="search"
    type='text'
    name='search'
    @input="searchChanged"
  ) Rechercher un produit
  div.flex.gap-12.mt-4
    div.flex-1(
      v-if="currentVM.get('products').canEdit"
    )
      ft-table(
        :headers="currentVM.getProductsHeaders()"
        :items="currentVM.getAvailableProducts().value"
        :selectable="true"
        :selection="availableProductSelector.get()"
        @item-selected="availableProductSelector.toggleSelect"
        @select-all="availableProductSelector.toggleSelectAll"
      )
        template(#title) Tous les produits
    div.flex.flex-col.justify-center.gap-6.mt-20(
      v-if="currentVM.get('products').canEdit"
    )
      ft-button.button-solid(
        @click="addProducts"
      )
        icon.icon-lg(name="ic:baseline-keyboard-arrow-right")
      ft-button.button-default(
        @click="removeProducts"
      )
        icon.icon-lg.rotate-180(name="ic:baseline-keyboard-arrow-right")
    div.flex-1
      ft-table(
        :headers="currentVM.getProductsHeaders()"
        :items="currentVM.getProducts().value"
        :selectable="currentVM.getProducts().canEdit"
        :selection="addedProductSelector.get()"
        @item-selected="addedProductSelector.toggleSelect"
        @select-all="addedProductSelector.toggleSelectAll"
      )
        template(#title) Produits de la promotion
  div.flex.flex-row-reverse.mt-4
    ft-button.button-solid.px-6.text-xl(
      v-if="currentVM.getDisplayValidate()"
      :disabled="!currentVM.getCanValidate()"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
import { useSelection } from '@adapters/primary/nuxt/composables/useSelection'
import { ReductionType } from '@core/entities/promotion'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { importPromotionProductsCSV } from '@core/usecases/promotions/import-promotion-products-csv/importPromotionProductsCSV'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

definePageMeta({ layout: 'main' })

const props = defineProps({
  vm: {
    type: Object,
    default() {
      return undefined
    }
  }
})

const currentVM = toRef(props, 'vm')
const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')
const availableProductSelector = useSelection()
const addedProductSelector = useSelection()
const search = ref('')
const csvFileInput = ref<HTMLInputElement>()
const isImporting = ref(false)

interface ImportFeedback {
  addedCount: number
  ineligibleCount: number
  notFoundCodes: Array<string>
  error?: string
}

const importFeedback = ref<ImportFeedback>()

const triggerFileInput = () => {
  csvFileInput.value?.click()
}

const handleCSVImport = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isImporting.value = true
  try {
    const result = await importPromotionProductsCSV(
      file,
      useProductGateway(),
      (uuids) => currentVM.value.addProducts(uuids)
    )
    importFeedback.value = {
      addedCount: result.addedCount,
      ineligibleCount: result.ineligibleCount,
      notFoundCodes: result.notFoundCodes
    }
  } catch {
    importFeedback.value = {
      addedCount: 0,
      ineligibleCount: 0,
      notFoundCodes: [],
      error: "Une erreur est survenue lors de l'import"
    }
  } finally {
    isImporting.value = false
    target.value = ''
  }
}

const clearImportFeedback = () => {
  importFeedback.value = undefined
}

const nameChanged = (name: string) => {
  currentVM.value.set('name', name)
}

const amountChanged = (amount: string) => {
  if (currentVM?.value?.get('amount').canEdit)
    currentVM.value.set('amount', amount)
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
const minimumQueryLength = 3

const searchChanged = (e: Event) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const target = e.target as HTMLInputElement
    const filters = {
      query: target.value,
      minimumQueryLength
    }
    searchProducts(routeName, filters, useSearchGateway())
  }, 300)
}

const startDateChanged = (date: number) => {
  currentVM.value.set('startDate', date)
}

const clearStartDate = () => {
  currentVM.value.set('startDate', undefined)
}

const endDateChanged = (date: number) => {
  currentVM.value.set('endDate', date)
}

const clearEndDate = () => {
  currentVM.value.set('endDate', undefined)
}

const getIcon = (type: ReductionType) => {
  return type === ReductionType.Fixed ? 'solar:euro-bold' : 'ic:twotone-percent'
}

const addProducts = () => {
  currentVM.value.addProducts(availableProductSelector.get())
  availableProductSelector.clear()
}

const removeProducts = () => {
  currentVM.value.removeProducts(addedProductSelector.get())
  addedProductSelector.clear()
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
