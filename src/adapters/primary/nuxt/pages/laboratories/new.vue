<template lang="pug">
  .section
    h1.text-title Créer nouveau laboratoire
    laboratory-form(
      :vm="vm"
      @validate="validate"
    )
</template>

<script lang="ts" setup>
import { laboratoryFormCreateVM } from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormCreateVM'
import { createLaboratory } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { useLaboratoryGateway } from '../../../../../../gateways/laboratoryGateway'
import { useProductGateway } from '../../../../../../gateways/productGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listProducts(25, 0, useProductGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name as string
const vm = ref(laboratoryFormCreateVM(routeName))

const validate = async () => {
  await createLaboratory(
    vm.value.getDto(),
    useLaboratoryGateway(),
    useProductGateway()
  )
  router.push('/laboratories/')
}
</script>
