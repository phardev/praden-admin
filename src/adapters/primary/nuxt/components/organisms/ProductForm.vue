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
            :model-value="currentVM.getName().value"
            @update:model-value="nameChanged"
          )
        UFormGroup.pb-4(label="Catégorie" name="category")
          ft-autocomplete(
            :model-value="currentVM.getCategoryUuid().value"
            :options="currentVM.getAvailableCategories()"
            placeholder="Rechercher une catégorie"
            by="id"
            option-attribute="name"
            value-attribute="uuid"
            @update:model-value="categoryChanged"
          )
            template(#option="{ option: category }")
              span {{ category.name }}
        UFormGroup.pb-4(label="CIP13" name="cip13")
          ft-text-field(
            :model-value="currentVM.getCip13().value"
            @update:model-value="cip13Changed"
          )
        UFormGroup.pb-4(label="Laboratoire" name="laboratory")
          ft-text-field(
            :model-value="currentVM.getLaboratory().value"
            label="Laboratoire"
            @update:model-value="laboratoryChanged"
          )
        UFormGroup.pb-4(label="Images" name="images")
          div(v-for="(image, index) in images" :key="index")
            img.mb-4(:src="image" height=200 width=200 alt="Selected Image")
          ft-file-input(
            accept="image/*"
            multiple
            @input="imagesChanged"
          )
      template(#price)
        UFormGroup.pb-4(label="Prix (HT)" name="priceWithoutTax")
          ft-currency-input(
              v-model="currentVM.getPriceWithoutTax().value"
              label="Prix (HT)"
              @update:model-value="priceWithoutTaxChanged"
            )
        UFormGroup.pb-4(label="Taxe (%)" name="percentTaxRate")
          ft-percentage-input(
            :model-value="currentVM.getPercentTaxRate().value"
            label="Taxe (%)"
            @update:model-value="percentTaxRateChanged"
          )
      template(#stock)
        UFormGroup.pb-4(label="Code Géographique" name="location")
          ft-text-field(
            :model-value="currentVM.getLocation().value"
            @update:model-value="locationChanged"
          )
        UFormGroup.pb-4(label="Stock disponible" name="availableStock")
          ft-text-field(
            :model-value="currentVM.getAvailableStock().value"
            type="number"
            @update:model-value="availableStockChanged"
          )
      template(#details)
        UFormGroup.pb-4(label="Description" name="description")
          FtRichTextInput(
            :model-value="currentVM.getDescription().value"
            @update:model-value="descriptionChanged"
          )
        UFormGroup.pb-4(label="Instructions" name="instructions")
          FtRichTextInput(
            :model-value="currentVM.getInstructionsForUse().value"
            @update:model-value="instructionsChanged"
          )
        UFormGroup.pb-4(label="Composition" name="composition")
          FtRichTextInput(
            :model-value="currentVM.getComposition().value"
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
  currentVM?.value?.setName(name)
}

const cip13Changed = (cip13: string) => {
  currentVM?.value?.setCip13(cip13)
}

const priceWithoutTaxChanged = (priceWithoutTax: number) => {
  console.log('coucou: ', priceWithoutTax)
  currentVM?.value?.setPriceWithoutTax(priceWithoutTax)
}

const percentTaxRateChanged = (percentTaxRate: number) => {
  currentVM?.value?.setPercentTaxRate(percentTaxRate)
}

const laboratoryChanged = (laboratory: string) => {
  currentVM?.value?.setLaboratory(laboratory)
}

const images = computed(() => {
  return currentVM?.value?.getImages()
})

const imagesChanged = async (value: any) => {
  await currentVM?.value?.setNewImages(value)
}

const categoryChanged = (uuid: string) => {
  currentVM?.value?.setCategoryUuid(uuid)
}

const locationChanged = (location: string) => {
  currentVM?.value?.setLocation(location)
}

const availableStockChanged = (availableStock: string) => {
  currentVM?.value?.setAvailableStock(availableStock)
}

const descriptionChanged = (description: string) => {
  currentVM?.value?.setDescription(description)
}

const instructionsChanged = (instructions: string) => {
  currentVM?.value?.setInstructionsForUse(instructions)
}

const compositionChanged = (composition: string) => {
  currentVM?.value?.setComposition(composition)
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
