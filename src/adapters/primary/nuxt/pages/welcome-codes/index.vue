<template lang="pug">
.section
  .flex.items-center.justify-between.mb-4
    h1.text-title {{ $t('welcomeCode.listTitle') }}
    nuxt-link(to="/welcome-codes/new")
      ft-button.button-solid.text-xl.px-6 {{ $t('welcomeCode.createButton') }}
  p.text-gray-600 {{ $t('welcomeCode.listDescription') }}
  welcome-codes-list(
    :welcome-codes-vm="welcomeCodesVM"
    @edit="edit"
    @enable="enable"
    @disable="disable"
  )
</template>

<script lang="ts" setup>
import { useDiscountCodeErrorToast } from '@adapters/primary/nuxt/composables/useDiscountCodeErrorToast'
import { getWelcomeCodesVM } from '@adapters/primary/view-models/welcome-codes/get-welcome-codes/getWelcomeCodesVM'
import { disableWelcomeCode } from '@core/usecases/welcome-codes/welcome-code-disabling/disableWelcomeCode'
import { enableWelcomeCode } from '@core/usecases/welcome-codes/welcome-code-enabling/enableWelcomeCode'
import { listWelcomeCodes } from '@core/usecases/welcome-codes/welcome-codes-listing/listWelcomeCodes'
import { useWelcomeCodeGateway } from '../../../../../../gateways/welcomeCodeGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const { showDiscountCodeError, showDiscountCodeSuccess } =
  useDiscountCodeErrorToast()

const welcomeCodesVM = computed(() => getWelcomeCodesVM())

onMounted(async () => {
  try {
    await listWelcomeCodes(useWelcomeCodeGateway())
  } catch (error) {
    showDiscountCodeError(error)
  }
})

const edit = (uuid: string) => {
  router.push(`/welcome-codes/edit/${uuid}`)
}

const enable = async (uuid: string) => {
  try {
    await enableWelcomeCode(uuid, useWelcomeCodeGateway())
    showDiscountCodeSuccess('welcomeCode.enableSuccess')
  } catch (error) {
    showDiscountCodeError(error)
  }
}

const disable = async (uuid: string) => {
  try {
    await disableWelcomeCode(uuid, useWelcomeCodeGateway())
    showDiscountCodeSuccess('welcomeCode.disableSuccess')
  } catch (error) {
    showDiscountCodeError(error)
  }
}
</script>
