<template lang="pug">
.section
  h1.text-title Créer nouveau code promotion
  promotion-code-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { promotionCodeFormCreateVM } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormCreateVM'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = router.currentRoute.value.name
const vm = ref(promotionCodeFormCreateVM(routeName))

const validate = async () => {
  console.log('dto: ', vm.value.getDto())
}
</script>
