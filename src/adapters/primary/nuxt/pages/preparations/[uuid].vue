<template lang="pug">
.section
  h1.text-4xl.font-semibold.text-default Commande \#{{ preparationVM.reference }}
  input.mt-8.w-full.rounded-full.border-opposite(
    type='text'
    placeholder='Code produit'
    :value="scan"
    @keyup.enter="addProduct"
  )
  fv-table(
    :headers="preparationVM.headers"
    :items="preparationVM.lines"
  )
  div.w-full.flex.flex-row-reverse
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="preparationVM.canValidate"
      @click="validatePreparation"
    ) Valider la commande
</template>

<script lang="ts" setup>
import { definePageMeta } from '../../../../../../.nuxt/imports'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import { getPreparationVM } from '@adapters/primary/view-models/get-preparation/getPreparationVM'
import { addProductToPreparation } from '@core/usecases/order/add-product-to-preparation/addProductToPreparation'

definePageMeta({ layout: 'main' })

const route = useRoute()
const preparationUuid = route.params.uuid

onMounted(() => {
  getPreparation(preparationUuid, useOrderGateway())
})

const scan = ref('')

const addProduct = (e: any) => {
  addProductToPreparation(e.target.value)
  scan.value = ''
}

const validatePreparation = () => {
  console.log('On valide')
}

const preparationVM = computed(() => {
  return getPreparationVM()
})
</script>
