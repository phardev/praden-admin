<template lang="pug">
.homepage-showcase-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="handleBackClick"
    )

  UAlert.mb-4(
    v-if="!showcaseVM.isLoading && showcaseVM.hasChanges"
    color="amber"
    variant="subtle"
    icon="i-heroicons-exclamation-triangle"
    :title="$t('shopManagement.homepageShowcase.unsavedChanges')"
    :description="$t('shopManagement.homepageShowcase.unsavedChangesDescription')"
  )
    template(#actions)
      .flex.gap-3
        UButton(
          color="gray"
          variant="ghost"
          :label="$t('common.cancel')"
          @click="showCancelModal = true"
        )
        UButton(
          color="primary"
          :label="$t('shopManagement.homepageShowcase.save')"
          :loading="showcaseVM.isSaving"
          @click="saveShowcase"
        )

  UAlert.mb-4(
    v-if="!showcaseVM.isLoading && showcaseVM.isHiddenOnShop"
    color="amber"
    variant="soft"
    icon="i-heroicons-eye-slash"
    :title="$t('shopManagement.homepageShowcase.hiddenOnShop.title')"
    :description="$t('shopManagement.homepageShowcase.hiddenOnShop.description')"
  )

  UCard
    template(#header)
      .flex.items-center.justify-between
        h1.text-2xl.font-bold {{ $t(`shopManagement.homepageShowcase.kinds.${kind}.title`) }}
        UButton(
          color="primary"
          icon="i-heroicons-plus"
          :label="$t('shopManagement.homepageShowcase.addProduct')"
          @click="managerRef?.openModal()"
        )

    template(#default)
      .mb-6(v-if="!showcaseVM.isLoading")
        p.text-gray-600 {{ $t(`shopManagement.homepageShowcase.kinds.${kind}.description`) }}
        .flex.items-center.gap-2.mt-2.text-sm.text-gray-900(data-testid="showcase-counts")
          span.font-medium {{ $t('shopManagement.homepageShowcase.selectedCount', { count: showcaseVM.selectedCount }, showcaseVM.selectedCount) }}
          span(aria-hidden="true") ·
          span {{ $t('shopManagement.homepageShowcase.visibleCount', { count: showcaseVM.visibleCount }, showcaseVM.visibleCount) }}

      HomepageShowcaseManager(ref="managerRef" :kind="kind" :showcase-v-m="showcaseVM")

  UModal(v-model="showCancelModal")
    UCard
      template(#header)
        h3.text-lg.font-semibold {{ $t('shopManagement.homepageShowcase.cancelChanges') }}
      template(#default)
        p.text-gray-600 {{ $t('shopManagement.homepageShowcase.cancelChangesConfirm') }}
      template(#footer)
        .flex.justify-end.gap-3
          UButton(
            color="gray"
            variant="ghost"
            :label="$t('common.cancel')"
            @click="showCancelModal = false"
          )
          UButton(
            color="red"
            :label="$t('common.cancel')"
            @click="confirmCancel"
          )
</template>

<script lang="ts" setup>
import HomepageShowcaseManager from '@adapters/primary/nuxt/components/organisms/HomepageShowcaseManager.vue'
import { homepageShowcaseFormVM } from '@adapters/primary/view-models/homepage-showcases/homepage-showcase-form/homepageShowcaseFormVM'
import type { ShowcaseKind } from '@core/entities/homepageShowcase'
import { getHomepageShowcase } from '@core/usecases/homepage-showcases/getHomepageShowcase'
import { updateHomepageShowcase } from '@core/usecases/homepage-showcases/updateHomepageShowcase'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { useHomepageShowcaseGateway } from '../../../../../../gateways/homepageShowcaseGateway'

const props = defineProps<{
  kind: ShowcaseKind
}>()

const { t } = useI18n()
const homepageShowcaseGateway = useHomepageShowcaseGateway()
const dateProvider = useDateProvider()

const buildVM = () => homepageShowcaseFormVM(props.kind, dateProvider)
const showcaseVM = ref(buildVM())
const showCancelModal = ref(false)
const managerRef = ref<InstanceType<typeof HomepageShowcaseManager>>()

onMounted(async () => {
  await getHomepageShowcase(props.kind, homepageShowcaseGateway)
  showcaseVM.value.reset()
})

const saveShowcase = async () => {
  await updateHomepageShowcase(
    props.kind,
    showcaseVM.value.getProducts(),
    homepageShowcaseGateway
  )
  const toast = useToast()
  if (showcaseVM.value.hasSaveFailed) {
    toast.add({
      title: t('shopManagement.homepageShowcase.updateError'),
      color: 'red'
    })
    return
  }
  toast.add({
    title: t('shopManagement.homepageShowcase.updateSuccess'),
    color: 'green'
  })
}

const handleBackClick = () => {
  if (
    !showcaseVM.value.hasChanges ||
    confirm(t('shopManagement.homepageShowcase.leavePageConfirm'))
  ) {
    navigateTo('/shop-management')
  }
}

const confirmCancel = () => {
  showcaseVM.value.reset()
  showCancelModal.value = false
}

onBeforeRouteLeave((to, from, next) => {
  if (
    !showcaseVM.value.hasChanges ||
    confirm(t('shopManagement.homepageShowcase.leavePageConfirm'))
  ) {
    next()
    return
  }
  next(false)
})
</script>

<style scoped>
.homepage-showcase-container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
