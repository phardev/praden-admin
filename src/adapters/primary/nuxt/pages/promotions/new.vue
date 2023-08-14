<template lang="pug">
.section
  h1.text-title Créer nouvelle promotion
  div.flex.gap-6
    ft-button.text-2xl.flex-1.h-24(
      v-for="(typeChoice, index) in vm.availableTypeChoices"
      :key="index"
      :class="typeChoice.type === vm.type.value ? 'selectedChoice' : 'unSelectedChoice'"
      @click="vm.setType(typeChoice.type)"
    )
      div.flex.flex-col.items-center.justify-center
        icon.icon-xl.mr-2(:name="getIcon(typeChoice.type)")
        span {{ typeChoice.text }}
  ft-input(
    :value="vm.name.value"
    for="name"
    required
    type='text'
    name='name'
    @input="nameChanged"
  ) Nom
  ft-currency-input(
    v-if="vm.type.value === ReductionType.Fixed"
    :value="vm.amount.value"
    required
    @input="amountChanged"
  ) Valeur de la réduction
  ft-percentage-input(
    v-if="vm.type.value === ReductionType.Percentage"
    :value="vm.amount.value"
    required
    @input="amountChanged"
  ) Valeur de la réduction
  div.flex.mb-4
    ft-date-picker-input.flex-1(
      :model-value="vm.startDate.value"
      :start-time="startTime"
      for="startDate"
      @date-changed="startDateChanged"
    ) Date de début
    ft-date-picker-input.flex-1(
      :model-value="vm.endDate.value"
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
        :headers="vm.productsHeaders"
        :items="vm.availableProducts"
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
        :headers="vm.productsHeaders"
        :items="vm.products"
        :selectable="true"
        :selection="addedProductSelector.get()"
        item-key="reference"
        @item-selected="addedProductSelector.toggleSelect"
        @select-all="addedProductSelector.toggleSelectAll"
      )
        template(#title) Produits de la promotion
  div.flex.flex-row-reverse.mt-4
    ft-button.button-solid.px-6.text-xl(
      :disabled="!vm.canValidate"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
import { createPromotionVM } from '@adapters/primary/view-models/create-promotion/createPromotionVM'
import FtInput from '@adapters/primary/nuxt/components/FtInput.vue'
import FtDatePickerInput from '@adapters/primary/nuxt/components/FtDatePickerInput.vue'
import { ReductionType } from '@core/usecases/promotions/promotions-listing/promotion'
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import { useSelection } from '@adapters/primary/nuxt/composables/useSelection'
import { createPromotion } from '@core/usecases/promotions/promotion-creation/createPromotion'
import { usePromotionGateway } from '../../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listProducts(useProductGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name
const vm = ref(createPromotionVM(routeName))
const availableProductSelector = useSelection()
const addedProductSelector = useSelection()
const search = ref('')
const startTime = ref({ hours: 0, minutes: 0 })
const endTime = ref({ hours: 23, minutes: 59, seconds: 59 })

const nameChanged = (e: any) => {
  vm.value.setName(e.target.value)
}

const amountChanged = (e: any) => {
  vm.value.setAmount(e.target.value)
}

const searchChanged = (e: any) => {
  searchProducts(routeName, e.target.value, useSearchGateway())
}

const startDateChanged = (date: number) => {
  vm.value.setStartDate(date)
}

const endDateChanged = (date: number) => {
  vm.value.setEndDate(date)
}

const getIcon = (type: ReductionType) => {
  return type === ReductionType.Fixed ? 'solar:euro-bold' : 'ic:twotone-percent'
}

const addProducts = () => {
  vm.value.addProducts(availableProductSelector.get())
  availableProductSelector.clear()
}

const removeProducts = () => {
  vm.value.removeProducts(addedProductSelector.get())
  addedProductSelector.clear()
}

const validate = async () => {
  await createPromotion(vm.value.dto, usePromotionGateway())
  router.push('/promotions/')
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
