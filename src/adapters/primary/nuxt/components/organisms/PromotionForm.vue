<template lang="pug">
div(v-if="currentVM")
  pre {{ currentVM }}
  div.flex.gap-6.mb-4
    ft-button.text-2xl.flex-1.h-24(
      v-for="(typeChoice, index) in currentVM.getAvailableTypeChoices()"
      :key="index"
      :disabled="!currentVM.getType().canEdit"
      :class="typeChoice.type === currentVM.getType().value ? 'button-solid' : 'button-default'"
      @click="currentVM.setType(typeChoice.type)"
    )
      div.flex.flex-col.items-center.justify-center
        icon.icon-xl.mr-2(:name="getIcon(typeChoice.type)")
        span {{ typeChoice.text }}
  ft-text-field(
    :model-value="currentVM.getName().value"
    :disabled="!currentVM.getName().canEdit"
    label="Nom"
    @update:model-value="nameChanged"
  )
  ft-currency-input(
    v-if="currentVM.getType().value === ReductionType.Fixed"
    v-model="currentVM.getAmount().value"
    label="Valeur de la réduction (€)"
    :disabled="!currentVM.getAmount().canEdit"
    @update:model-value="amountChanged"
  )
  pre {{ currentVM.getAmount() }}
  ft-percentage-input(
    v-if="currentVM.getType().value === ReductionType.Percentage"
    v-model="currentVM.getAmount().value"
    label="Valeur de la réduction (%)"
    :disabled="!currentVM.getAmount().canEdit"
    @update:model-value="amountChanged"
  )
  div.flex.mb-4
    ft-date-picker-input.flex-1(
      :model-value="currentVM.getStartDate().value"
      :start-time="startTime"
      :disabled="!currentVM.getStartDate().canEdit"
      for="startDate"
      @date-changed="startDateChanged"
    ) Date de début
    ft-date-picker-input.flex-1(
      :model-value="currentVM.getEndDate().value"
      :disabled="!currentVM.getEndDate().canEdit"
      :start-time="endTime"
      for="endDate"
      @date-changed="endDateChanged"
    ) Date de fin
  ft-input(
    v-if="currentVM.getProducts().canEdit"
    v-model="search"
    placeholder="Rechercher par nom, référence, catégorie, laboratoire"
    for="search"
    type='text'
    name='search'
    @input="searchChanged"
  ) Rechercher un produit
  div.flex.gap-12.mt-4
    div.flex-1(
      v-if="currentVM.getProducts().canEdit"
    )
      ft-table(
        :headers="currentVM.getProductsHeaders()"
        :items="currentVM.getAvailableProducts().value"
        :selectable="true"
        :selection="availableProductSelector.get()"
        item-key="reference"
        @item-selected="availableProductSelector.toggleSelect"
        @select-all="availableProductSelector.toggleSelectAll"
      )
        template(#title) Tous les produits
    div.flex.flex-col.justify-center.gap-6.mt-20(
      v-if="currentVM.getProducts().canEdit"
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
        item-key="reference"
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
import { ReductionType } from '@core/entities/promotion'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useSelection } from '@adapters/primary/nuxt/composables/useSelection'
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
const routeName = router.currentRoute.value.name
const availableProductSelector = useSelection()
const addedProductSelector = useSelection()
const search = ref('')
const startTime = ref({ hours: 0, minutes: 0 })
const endTime = ref({ hours: 23, minutes: 59, seconds: 59 })

const nameChanged = (name: string) => {
  currentVM.value.setName(name)
}

const amountChanged = (amount: string) => {
  console.log('amount: ', amount)
  currentVM.value.setAmount(amount)
}

const searchChanged = (e: any) => {
  searchProducts(routeName, e.target.value, useSearchGateway())
}

const startDateChanged = (date: number) => {
  currentVM.value.setStartDate(date)
}

const endDateChanged = (date: number) => {
  currentVM.value.setEndDate(date)
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
