<template lang="pug">
  .section(v-if="vm")
    h1.text-title Editer laboratoire
    laboratory-form(
      :vm="vm"
      @validate="validate"
    )
</template>

<script lang="ts" setup>
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { useLaboratoryGateway } from '../../../../../../../gateways/laboratoryGateway'
import { getLaboratory } from '@core/usecases/laboratories/laboratory-get/getLaboratory'
import { laboratoryFormEditVM } from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormEditVM'
import { editLaboratory } from '@core/usecases/laboratories/laboratory-edition/editLaboratory'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const laboratoryUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  await getLaboratory(
    laboratoryUuid,
    useLaboratoryGateway(),
    useProductGateway()
  )
  vm.value = laboratoryFormEditVM(routeName)
})

const validate = async () => {
  await editLaboratory(
    laboratoryUuid,
    vm.value.getDto(),
    useLaboratoryGateway(),
    useProductGateway()
  )
  router.push('/laboratories/')
}
</script>
