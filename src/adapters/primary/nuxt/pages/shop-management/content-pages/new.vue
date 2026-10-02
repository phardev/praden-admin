<template lang="pug">
.content-page-form-container.p-6
  .mb-4
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management/content-pages')"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ $t('shopManagement.contentPages.createTitle') }}
    template(#default)
      content-page-form(:form-vm="formVM" :is-saving="isSaving" @submit="save")
</template>

<script lang="ts" setup>
import { contentPageFormVM } from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'
import { createContentPage } from '@core/usecases/content-page/content-page-creation/createContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import { useContentPageGateway } from '../../../../../../../gateways/contentPageGateway'
import { useContentPageTransitions } from '../../../composables/useContentPageTransitions'

definePageMeta({ layout: 'main' })

const SLUG_ERROR_MESSAGES: Record<string, string> = {
  CONTENT_PAGE_SLUG_ALREADY_EXISTS:
    'shopManagement.contentPages.slugAlreadyUsed',
  CONTENT_PAGE_SLUG_RESERVED: 'shopManagement.contentPages.slugReserved'
}

const { t } = useI18n()
const toast = useToast()
const contentPageGateway = useContentPageGateway()
const contentPageStore = useContentPageStore()
const { applyTransitions } = useContentPageTransitions(contentPageGateway)

const formVM = ref(contentPageFormVM())
const isSaving = computed(() => contentPageStore.isSaving)
const isCreated = ref(false)

const errorMessage = (error: any): string => {
  const key = SLUG_ERROR_MESSAGES[error?.response?.data?.code]
  return t(key ?? 'shopManagement.contentPages.createError')
}

const save = async () => {
  try {
    const dto = formVM.value.getCreateDto()
    await createContentPage(dto, contentPageGateway)
    isCreated.value = true
    await applyTransitions(dto.slug, formVM.value)
    toast.add({
      title: t('shopManagement.contentPages.createSuccess'),
      color: 'green'
    })
    await navigateTo('/shop-management/content-pages')
  } catch (error: any) {
    toast.add({ title: errorMessage(error), color: 'red' })
    if (isCreated.value) {
      await navigateTo(
        `/shop-management/content-pages/edit/${formVM.value.getCreateDto().slug}`
      )
    }
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (formVM.value.hasChanges && !isCreated.value) {
    next(confirm(t('shopManagement.contentPages.leavePageConfirm')))
    return
  }
  next()
})
</script>

<style scoped>
.content-page-form-container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
