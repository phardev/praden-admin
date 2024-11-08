<template lang="pug">
.section
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer laboratoire
  h1.text-title Voir laboratoire
  laboratory-form(
    :vm="vm"
  )
</template>

<script lang="ts" setup>
import { laboratoryFormGetVM } from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormGetVM'
import { getLaboratory } from '@core/usecases/laboratories/laboratory-get/getLaboratory'
import { useLaboratoryGateway } from '../../../../../../../gateways/laboratoryGateway'
import { useProductGateway } from '../../../../../../../gateways/productGateway'

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
  vm.value = laboratoryFormGetVM(routeName)
})

const edit = () => {
  router.push(`/laboratories/edit/${laboratoryUuid}`)
}
</script>
