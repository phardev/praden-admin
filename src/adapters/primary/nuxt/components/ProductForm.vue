<template lang="pug">
div(v-if="currentVM")
  v-expansion-panels(
    v-model="panels"
    multiple
    variant="popout"
    :color="color"
  )
    v-expansion-panel
      template(#title)
        ft-form-section-subtitle(
          id="1"
          subtitle="Informations produit"
        )
      template(#text)
        ft-text-field(
          :model-value="currentVM.getName().value"
          label="Nom"
          @update:model-value="nameChanged"
        )
        fv-autocomplete(
          label="Catégorie"
          :model-value="currentVM.getCategoryUuid().value"
          :items="currentVM.getAvailableCategories()"
          item-title="name"
          item-value="uuid"
          :clearable="true"
          @update:model-value="categoryChanged"
        )
        ft-text-field(
          :model-value="currentVM.getCip13().value"
          label="Référence"
          @update:model-value="cip13Changed"
        )
        ft-text-field(
          :model-value="currentVM.getLaboratory().value"
          label="Laboratoire"
          @update:model-value="laboratoryChanged"
        )
        div(v-for="(image, index) in images" :key="index")
          img.mb-4(:src="image" height=200 width=200 alt="Selected Image")
        ft-file-input(
          :model-value="images"
          accept="image/*"
          multiple
          label="Images"
          prepend-icon="mdi-camera"
          @update:model-value="imagesChanged"
        )
    v-expansion-panel
      template(#title)
        ft-form-section-subtitle(
          id="2"
          subtitle="Prix"
        )
      template(#text)
        ft-currency-input(
          v-model="currentVM.getPriceWithoutTax().value"
          label="Prix (HT)"
          @update:model-value="priceWithoutTaxChanged"
        )
        ft-percentage-input(
          :model-value="currentVM.getPercentTaxRate().value"
          label="Taxe (%)"
          @update:model-value="percentTaxRateChanged"
        )
    v-expansion-panel
      template(#title)
        ft-form-section-subtitle(
          id="3"
          subtitle="Stock"
        )
      template(#text)
        ft-text-field(
          :model-value="currentVM.getLocation().value"
          label="Code Géographique"
          @update:model-value="locationChanged"
        )
        ft-text-field(
          :model-value="currentVM.getAvailableStock().value"
          label="Stock disponible"
          type="number"
          @update:model-value="availableStockChanged"
        )
  div.flex.flex-row-reverse.mt-4
    ft-button.button-solid.px-6.text-xl(
      v-if="currentVM.getDisplayValidate()"
      :disabled="!currentVM.getCanValidate()"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
import FtFormSectionSubtitle from '@adapters/primary/nuxt/components/FtFormSectionSubtitle.vue'
import { useCssVariables } from 'vue-composable'

definePageMeta({ layout: 'main' })

const panels = ref([0, 1, 2])
const { color } = useCssVariables({ color: '--color-primary8' })

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

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
