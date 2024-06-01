<template lang="pug">
div(v-if="currentVM")
  UForm
    UAccordion(
      multiple
      size="xl"
      :items="items"
    )
      template(#informations)
        UFormGroup.pb-4(label="Nom" name="name")
          ft-text-field(
            :model-value="currentVM.get('name').value"
            :disabled="!currentVM.get('name').canEdit"
            @update:model-value="nameChanged"
          )
        UFormGroup.pb-4(label="Catégorie" name="category")
          ft-autocomplete(
            :model-value="currentVM.get('categoryUuid').value"
            :disabled="!currentVM.get('categoryUuid').canEdit"
            :options="currentVM.getAvailableCategories()"
            placeholder="Rechercher une catégorie"
            by="id"
            option-attribute="name"
            value-attribute="uuid"
            @update:model-value="categoryChanged"
            @clear="clearCategory"
          )
            template(#option="{ option: category }")
              span {{ category.name }}
        UFormGroup.pb-4(label="CIP7" name="cip7")
          ft-text-field(
            :model-value="currentVM.get('cip7').value"
            :disabled="!currentVM.get('cip7').canEdit"
            @update:model-value="cip7Changed"
          )
        UFormGroup.pb-4(label="CIP13" name="cip13")
          ft-text-field(
            :model-value="currentVM.get('cip13').value"
            :disabled="!currentVM.get('cip13').canEdit"
            @update:model-value="cip13Changed"
          )
        UFormGroup.pb-4(label="EAN13" name="ean13")
          ft-text-field(
            :model-value="currentVM.get('ean13').value"
            :disabled="!currentVM.get('ean13').canEdit"
            @update:model-value="ean13Changed"
          )
        UFormGroup.pb-4(label="Laboratoire" name="laboratory")
          ft-text-field(
            :model-value="currentVM.get('laboratory').value"
            :disabled="!currentVM.get('laboratory').canEdit"
            label="Laboratoire"
            @update:model-value="laboratoryChanged"
          )
        UFormGroup.pb-4(label="Images" name="images")
          div.flex.items-center.gap-4
            div(v-for="(image, index) in images" :key="index")
              img.mb-4(:src="image" height=200 width=200 alt="Selected Image")
          ft-file-input(
            v-if="currentVM.get('newImages').canEdit"
            accept="image/*"
            multiple
            @input="imagesChanged"
          )
      template(#price)
        UFormGroup.pb-4(label="Prix (HT)" name="priceWithoutTax")
          ft-currency-input(
            v-model.lazy="currentVM.get('priceWithoutTax').value"
            :disabled="!currentVM.get('priceWithoutTax').canEdit"
            label="Prix (HT)"
              @update:model-value="priceWithoutTaxChanged"
            )
        UFormGroup.pb-4(label="Taxe (%)" name="percentTaxRate")
          ft-percentage-input(
            :model-value="currentVM.get('percentTaxRate').value"
            :disabled="!currentVM.get('percentTaxRate').canEdit"
            label="Taxe (%)"
            @update:model-value="percentTaxRateChanged"
          )
        UFormGroup.pb-4(label="Prix (TTC)" name="priceWithTax")
          ft-currency-input(
            v-model.lazy="currentVM.get('priceWithTax').value"
            :disabled="!currentVM.get('priceWithTax').canEdit"
            label="Prix (HT)"
            @update:model-value="priceWithTaxChanged"
          )
      template(#stock)
        UFormGroup.pb-4(label="Code Géographique" name="location")
          ft-text-field(
            :model-value="currentVM.get('location').value"
            :disabled="!currentVM.get('location').canEdit"
            @update:model-value="locationChanged"
          )
        UFormGroup.pb-4(label="Stock disponible" name="availableStock")
          ft-text-field(
            :model-value="currentVM.get('availableStock').value"
            :disabled="!currentVM.get('availableStock').canEdit"
            type="number"
            @update:model-value="availableStockChanged"
          )
      template(#details)
        UFormGroup.pb-4(label="Description" name="description")
          FtRichTextInput(
            :model-value="currentVM.get('description').value"
            :disabled="!currentVM.get('description').canEdit"
            @update:model-value="descriptionChanged"
          )
        UFormGroup.pb-4(label="Instructions" name="instructions")
          FtRichTextInput(
            :model-value="currentVM.get('instructionsForUse').value"
            :disabled="!currentVM.get('instructionsForUse').canEdit"
            @update:model-value="instructionsChanged"
          )
        UFormGroup.pb-4(label="Composition" name="composition")
          FtRichTextInput(
            :model-value="currentVM.get('composition').value"
            :disabled="!currentVM.get('composition').canEdit"
            @update:model-value="compositionChanged"
          )
  div.flex.flex-row-reverse.mt-4
    ft-button.px-6.text-xl(
      v-if="currentVM.getDisplayValidate()"
      :disabled="!currentVM.getCanValidate()"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'main' })

const items = [
  {
    label: '1. Informations produit',
    defaultOpen: true,
    slot: 'informations'
  },
  {
    label: '2. Prix',
    defaultOpen: true,
    slot: 'price'
  },
  {
    label: '3. Stock',
    defaultOpen: true,
    slot: 'stock'
  },
  {
    label: '4. Détails',
    defaultOpen: true,
    slot: 'details'
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

const nameChanged = (name: string) => {
  currentVM?.value?.set('name', name)
}

const cip7Changed = (cip7: string) => {
  currentVM?.value?.set('cip7', cip7)
}

const cip13Changed = (cip13: string) => {
  currentVM?.value?.set('cip13', cip13)
}

const ean13Changed = (ean13: string) => {
  currentVM?.value?.set('ean13', ean13)
}

const priceWithoutTaxChanged = (priceWithoutTax: number) => {
  if (currentVM?.value?.get('priceWithoutTax').canEdit)
    currentVM?.value?.set('priceWithoutTax', priceWithoutTax)
}

const percentTaxRateChanged = (percentTaxRate: number) => {
  currentVM?.value?.set('percentTaxRate', percentTaxRate)
}

const priceWithTaxChanged = (priceWithTax: number) => {
  if (currentVM?.value?.get('priceWithTax').canEdit)
    currentVM?.value?.set('priceWithTax', priceWithTax)
}

const laboratoryChanged = (laboratory: string) => {
  currentVM?.value?.set('laboratory', laboratory)
}

const images = computed(() => {
  return currentVM?.value?.get('images').value
})

const imagesChanged = async (value: any) => {
  await currentVM?.value?.set('newImages', value)
}

const categoryChanged = (uuid: string) => {
  currentVM?.value?.set('categoryUuid', uuid)
}

const clearCategory = () => {
  currentVM?.value?.set('categoryUuid', undefined)
}

const locationChanged = (location: string) => {
  currentVM?.value?.set('location', location)
}

const availableStockChanged = (availableStock: string) => {
  currentVM?.value?.set('availableStock', availableStock)
}

const descriptionChanged = (description: string) => {
  currentVM?.value?.set('description', description)
}

const instructionsChanged = (instructions: string) => {
  currentVM?.value?.set('instructionsForUse', instructions)
}

const compositionChanged = (composition: string) => {
  currentVM?.value?.set('composition', composition)
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
