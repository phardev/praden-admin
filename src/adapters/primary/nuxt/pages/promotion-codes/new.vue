<template lang="pug">
.section
  h1.text-title Créer nouveau code promotion
  promotion-code-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'main' })

// const router = useRouter()
// const routeName = router.currentRoute.value.name
// const vm = ref(laboratoryFormCreateVM(routeName))
//
// const validate = async () => {
//   await createLaboratory(
//       vm.value.getDto(),
//       useLaboratoryGateway(),
//       useProductGateway()
//   )
//   router.push('/laboratories/')
// }
</script>
