<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/laboratories/new")
      ft-button.button-solid.text-xl.px-6 Créer laboratoire
  ft-table(
    :headers="laboratoriesVM.headers"
    :items="laboratoriesVM.items"
    @clicked="laboratorySelected"
  )
    template(#title) Laboratoires
    template(#miniature="{ item }")
      .h-10.w-10
        img.rounded-full.h-10.w-10(v-if="item.miniature" :src="item.miniature")
</template>

<script lang="ts" setup>
import { listLaboratories } from '@core/usecases/laboratories/laboratory-listing/listLaboratories'
import { useLaboratoryGateway } from '../../../../../../gateways/laboratoryGateway'
import { getLaboratoriesVM } from '@adapters/primary/view-models/laboratories/get-laboratories/getLaboratoriesVM'

definePageMeta({ layout: 'main' })

const router = useRouter()

onMounted(() => {
  listLaboratories(useLaboratoryGateway())
})

const laboratoriesVM = computed(() => {
  return getLaboratoriesVM()
})

const laboratorySelected = (uuid: string) => {
  router.push(`/laboratories/get/${uuid}`)
}
</script>
