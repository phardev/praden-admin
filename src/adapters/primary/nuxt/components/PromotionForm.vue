<template lang="pug">
div(v-if="currentVM")
  div.flex.gap-6
    ft-button.text-2xl.flex-1.h-24(
      v-for="(typeChoice, index) in currentVM.availableTypeChoices"
      :key="index"
      :class="typeChoice.type === currentVM.type.value ? 'selectedChoice' : 'unSelectedChoice'"
      @click="currentVM.setType(typeChoice.type)"
    )
      div.flex.flex-col.items-center.justify-center
        icon.icon-xl.mr-2(:name="getIcon(typeChoice.type)")
        span {{ typeChoice.text }}
  ft-input(
    :value="currentVM.name.value"
    for="name"
    required
    type='text'
    name='name'
    @input="nameChanged"
  ) Nom
  ft-currency-input(
    v-if="currentVM.type.value === ReductionType.Fixed"
    :value="currentVM.amount.value"
    required
    @input="amountChanged"
  ) Valeur de la réduction
  ft-percentage-input(
    v-if="currentVM.type.value === ReductionType.Percentage"
    :value="currentVM.amount.value"
    required
    @input="amountChanged"
  ) Valeur de la réduction
  div.flex.mb-4
    ft-date-picker-input.flex-1(
      :model-value="currentVM.startDate.value"
      :start-time="startTime"
      for="startDate"
      @date-changed="startDateChanged"
    ) Date de début
    ft-date-picker-input.flex-1(
      :model-value="currentVM.endDate.value"
      :start-time="endTime"
      for="endDate"
      @date-changed="endDateChanged"
    ) Date de fin
  ft-input(
    v-model="search"
    for="search"
    type='text'
    name='search'
    @input="searchChanged"
  ) Rechercher un produit
  div.flex.gap-12.mt-4
    div.flex-1
      ft-table(
        :headers="currentVM.productsHeaders"
        :items="currentVM.availableProducts"
        :selectable="true"
        :selection="availableProductSelector.get()"
        item-key="reference"
        @item-selected="availableProductSelector.toggleSelect"
        @select-all="availableProductSelector.toggleSelectAll"
      )
        template(#title) Tous les produits
    div.flex.flex-col.justify-center.items-center.gap-6
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
        :headers="currentVM.productsHeaders"
        :items="currentVM.products"
        :selectable="true"
        :selection="addedProductSelector.get()"
        item-key="reference"
        @item-selected="addedProductSelector.toggleSelect"
        @select-all="addedProductSelector.toggleSelectAll"
      )
        template(#title) Produits de la promotion
  div.flex.flex-row-reverse.mt-4
    ft-button.button-solid.px-6.text-xl(
      :disabled="!currentVM.canValidate"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
import FtInput from '@adapters/primary/nuxt/components/FtInput.vue'
import FtDatePickerInput from '@adapters/primary/nuxt/components/FtDatePickerInput.vue'
import { ReductionType } from '@core/entities/promotion'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useSelection } from '@adapters/primary/nuxt/composables/useSelection'
import { useSearchGateway } from '../../../../../gateways/searchGateway'

definePageMeta({ layout: 'main' })

const props = defineProps({
  vm: {
    type: Object,
    default() {
      return undefined
    }
  }
})

const currentVM = ref()

watch(
  () => props.vm,
  () => {
    const { vm } = props
    currentVM.value = vm
  },
  { deep: true }
)

const router = useRouter()
const routeName = router.currentRoute.value.name
const availableProductSelector = useSelection()
const addedProductSelector = useSelection()
const search = ref('')
const startTime = ref({ hours: 0, minutes: 0 })
const endTime = ref({ hours: 23, minutes: 59, seconds: 59 })

const nameChanged = (e: any) => {
  currentVM.value.setName(e.target.value)
}

const amountChanged = (e: any) => {
  currentVM.value.setAmount(e.target.value)
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

<style lang="scss">
.selectedChoice {
  @apply button-solid;
}

.unSelectedChoice {
  @apply button-default;
}
</style>
