<template lang="pug">
div(v-if="currentVM")
  pre {{ currentVM.formStore.items }}
  ft-input(
    :value="currentVM.name.value"
    for="name"
    required
    :disabled="!currentVM.name.canEdit"
    type='text'
    name='name'
    @input="nameChanged"
  ) Nom
  ft-input(
    :value="currentVM.cip13.value"
    for="cip13"
    required
    :disabled="!currentVM.cip13.canEdit"
    type='text'
    name='cip13'
    @input="cip13Changed"
  ) Référence
  ft-input(
    :value="currentVM.laboratory.value"
    for="laboratory"
    required
    :disabled="!currentVM.laboratory.canEdit"
    type='text'
    name='laboratory'
    @input="laboratoryChanged"
  ) Laboratoire
  ft-currency-input(
    :value="currentVM.priceWithoutTax.value"
    :disabled="!currentVM.priceWithoutTax.canEdit"
    required
    @input="priceWithoutTaxChanged"
  ) Prix (HT)
  ft-percentage-input(
    :value="currentVM.percentTaxRate.value"
    :disabled="!currentVM.percentTaxRate.canEdit"
    required
    @input="percentTaxRateChanged"
  ) Taxe (%)
  fv-autocomplete(
    label="Catégorie"
    :items="currentVM.availableCategories"
    item-title="name"
    item-value="uuid"
    :clearable="true"
    @update:model-value="categoryChanged"
  )
  ft-input(
    :value="currentVM.location.value"
    for="location"
    required
    :disabled="!currentVM.location.canEdit"
    type='text'
    name='location'
    @input="locationChanged"
  ) Code Géographique
  div.flex.flex-row-reverse.mt-4
    ft-button.button-solid.px-6.text-xl(
      v-if="currentVM.displayValidate"
      :disabled="!currentVM.canValidate"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
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

const nameChanged = (e: any) => {
  currentVM.value.setName(e.target.value)
}

const cip13Changed = (e: any) => {
  currentVM.value.setCip13(e.target.value)
}

const priceWithoutTaxChanged = (e: any) => {
  currentVM.value.setPriceWithoutTax(e.target.value)
}

const percentTaxRateChanged = (e: any) => {
  currentVM.value.setPercentTaxRate(e.target.value)
}

const laboratoryChanged = (e: any) => {
  currentVM.value.setLaboratory(e.target.value)
}

const categoryChanged = (uuid: string) => {
  currentVM.value.setCategoryUuid(uuid)
}

const locationChanged = (e: any) => {
  currentVM.value.setLocation(e.target.value)
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
