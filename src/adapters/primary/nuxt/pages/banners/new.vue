<template lang="pug">
.section
  h1.text-title Créer nouvelle bannière
  banner-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { bannerFormCreateVM } from '@adapters/primary/view-models/banners/banner-form/bannerFormCreateVM'
import { useBannerGateway } from '../../../../../../gateways/bannerGateway'
import { createBanner } from '@core/usecases/banners/banner-creation/createBanner'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = router.currentRoute.value.name
const vm = ref(bannerFormCreateVM(routeName))

const validate = async () => {
  await createBanner(vm.value.getDto(), useBannerGateway())
  router.push('/banners/')
}
</script>
