<template lang="pug">
.section
  h1.text-title Editer bannière
  banner-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { useBannerGateway } from '../../../../../../../gateways/bannerGateway'
import { getBanner } from '@core/usecases/banners/banner-get/getBanner'
import { bannerFormEditVM } from '@adapters/primary/view-models/banners/banner-form/bannerFormEditVM'
import { editBanner } from '@core/usecases/banners/banner-edition/editBanner'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const bannerUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  await getBanner(bannerUuid, useBannerGateway())
  vm.value = bannerFormEditVM(routeName)
})

const validate = async () => {
  await editBanner(bannerUuid, vm.value.getDto(), useBannerGateway())
  router.push('/banners/')
}
</script>
