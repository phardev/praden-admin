<template lang="pug">
div(v-if="!currentVM || currentVM.isLoading()")
  .space-y-6
    .pb-4
      .h-20.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-20.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-8.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
UForm(v-else :state="currentVM")
  UAccordion(
    multiple
    size="xl"
    :items="items"
  )
    template(#informations)
      div.flex.gap-6.mb-4
        ft-button.text-xl.flex-1.h-20(
          v-for="(scopeChoice, index) in currentVM.getAvailableScopeChoices()"
          :key="index"
          :disabled="!currentVM.get('scope').canEdit"
          :variant="scopeChoice.scope === currentVM.get('scope').value ? 'solid' : 'outline'"
          @click="currentVM.set('scope', scopeChoice.scope)"
        )
          div.flex.flex-col.items-center.justify-center
            icon.icon-xl.mr-2(:name="getScopeIcon(scopeChoice.scope)")
            span {{ scopeChoice.text }}
      div.flex.gap-6.mb-4
        ft-button.text-xl.flex-1.h-20(
          v-for="(typeChoice, index) in currentVM.getAvailableTypeChoices()"
          :key="index"
          :disabled="!currentVM.get('reductionType').canEdit"
          :variant="typeChoice.type === currentVM.get('reductionType').value ? 'solid' : 'outline'"
          @click="currentVM.set('reductionType', typeChoice.type)"
        )
          div.flex.flex-col.items-center.justify-center
            icon.icon-xl.mr-2(:name="getReductionTypeIcon(typeChoice.type)")
            span {{ typeChoice.text }}
      UFormGroup.pb-4(label="Code" name="code")
        ft-text-field(
          :model-value="currentVM.get('code').value"
          :disabled="!currentVM.get('code').canEdit"
          label="Code"
          @update:model-value="codeChanged"
        )
      UFormGroup.pb-4(label="Montant" name="amount")
        ft-currency-input(
          v-if="currentVM.get('reductionType').value === ReductionType.Fixed"
          v-model="currentVM.get('amount').value"
          label="Valeur de la réduction (€)"
          :disabled="!currentVM.get('amount').canEdit"
          @update:model-value="amountChanged"
        )
        ft-percentage-input(
          v-if="currentVM.get('reductionType').value === ReductionType.Percentage"
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
    template(#conditions)
      UFormGroup.pb-4(label="Nombre d'utilisations maximum" name="maximumUsage")
        ft-text-field(
          :model-value="currentVM.get('maximumUsage').value"
          :disabled="!currentVM.get('maximumUsage').canEdit"
          @update:model-value="maximumUsageChanged"
        )
      UFormGroup.pb-4(label="Montant minimum total de la commande (hors médicaments et produits non-eligible aux promotions)(€)" name="minimumAmount")
        ft-currency-input(
          v-model="currentVM.get('minimumAmount').value"
          :disabled="!currentVM.get('minimumAmount').canEdit"
          @update:model-value="minimumAmountChanged"
        )
      UFormGroup.pb-4(label="Methode de livraison" name="deliveryMethod")
        ft-autocomplete(
          :model-value="currentVM.get('deliveryMethodUuid').value"
          :disabled="!currentVM.get('deliveryMethodUuid').canEdit"
          :options="currentVM.getAvailableDeliveryMethods()"
          placeholder="Rechercher un methode de livraison"
          by="uuid"
          option-attribute="name"
          value-attribute="uuid"
          @update:model-value="deliveryMethodChanged"
          @clear="clearDeliveryMethod"
        )
          template(#option="{ option: laboratory }")
            span {{ laboratory.name }}
      UFormGroup.pb-4(
        v-if="currentVM.get('scope').value === PromotionScope.Delivery"
        label="Poids maximum de la commande (kg)"
        name="maxWeight"
      )
        ft-text-field(
          :model-value="currentVM.get('maxWeight').value"
          :disabled="!currentVM.get('maxWeight').canEdit"
          type="number"
          @update:model-value="maxWeightChanged"
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
        template(#title) Produits requis dans le panier

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
import { PromotionScope } from '@core/entities/promotionCode'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDeliveryMethodGateway } from '../../../../../../gateways/deliveryMethodGateway'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

definePageMeta({ layout: 'main' })

const search = ref('')
const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')
const availableProductSelector = useSelection()
const addedProductSelector = useSelection()

onMounted(() => {
  listDeliveryMethods(useDeliveryMethodGateway())
})

const items = [
  {
    label: '1. Informations',
    defaultOpen: true,
    slot: 'informations'
  },
  {
    label: '2. Conditions',
    defaultOpen: true,
    slot: 'conditions'
  }
]

const props = defineProps({
  vm: {
    type: Object,
    default() {
      return undefined
    }
  }
})

const currentVM = toRef(props, 'vm')

const codeChanged = (code: string) => {
  currentVM.value?.set('code', code)
}

const amountChanged = (amount: string) => {
  if (currentVM?.value?.get('amount').canEdit)
    currentVM.value?.set('amount', amount)
}

const startDateChanged = (date: number) => {
  currentVM.value?.set('startDate', date)
}

const clearStartDate = () => {
  currentVM.value?.set('startDate', undefined)
}

const endDateChanged = (date: number) => {
  currentVM.value?.set('endDate', date)
}

const clearEndDate = () => {
  currentVM.value?.set('endDate', undefined)
}

const maximumUsageChanged = (value: string) => {
  currentVM.value?.set('maximumUsage', value)
}

const minimumAmountChanged = (value: string) => {
  if (currentVM?.value?.get('minimumAmount').canEdit)
    currentVM.value?.set('minimumAmount', value)
}

const deliveryMethodChanged = (uuid: string) => {
  currentVM.value?.set('deliveryMethodUuid', uuid)
}

const clearDeliveryMethod = () => {
  currentVM.value?.set('deliveryMethodUuid', undefined)
}

const maxWeightChanged = (value: string) => {
  currentVM.value?.set('maxWeight', value)
}

const getReductionTypeIcon = (type: ReductionType) => {
  return type === ReductionType.Fixed ? 'solar:euro-bold' : 'ic:twotone-percent'
}

const getScopeIcon = (scope: PromotionScope) => {
  return scope === PromotionScope.Products
    ? 'fluent-mdl2:product-catalog'
    : 'material-symbols-light:delivery-truck-speed-outline'
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

const addProducts = () => {
  currentVM.value?.addProducts(availableProductSelector.get())
  availableProductSelector.clear()
}

const removeProducts = () => {
  currentVM.value?.removeProducts(addedProductSelector.get())
  addedProductSelector.clear()
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
