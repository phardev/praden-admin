<template lang="pug">
.content-page-form-container.p-6
  .mb-4.flex.items-center.justify-between
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      :label="$t('common.back')"
      @click="navigateTo('/shop-management/content-pages')"
    )
    UButton(
      color="gray"
      variant="ghost"
      icon="i-heroicons-arrow-top-right-on-square"
      :label="$t('shopManagement.contentPages.viewOnline')"
      :to="onlineUrl"
      target="_blank"
    )

  UCard
    template(#header)
      h1.text-2xl.font-bold {{ label }}

    template(#default)
      div(v-if="!formVM")
        .flex.justify-center.items-center.py-12
          icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")
          span.ml-2 {{ $t('common.loading') }}

      content-page-form(
        v-else
        :form-vm="formVM"
        :is-saving="isSaving"
        @submit="save"
      )
</template>

<script lang="ts" setup>
import type { ContentPageFormVM } from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'
import { contentPageFormVM } from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'
import { CONTENT_PAGE_SLUGS, ContentPageSlug } from '@core/entities/contentPage'
import { editContentPage } from '@core/usecases/content-page/content-page-edition/editContentPage'
import { getContentPage } from '@core/usecases/content-page/content-page-get/getContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import { useContentPageGateway } from '../../../../../../../../gateways/contentPageGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const contentPageGateway = useContentPageGateway()
const contentPageStore = useContentPageStore()

const slug = route.params.slug as ContentPageSlug
const formVM = ref<ContentPageFormVM | null>(null)

const isSaving = computed(() => contentPageStore.isSaving)
const label = computed(() => t(`shopManagement.contentPages.pages.${slug}`))
const config = useRuntimeConfig()
const onlineUrl = computed(() => `${config.public.SHOP_URL}/${slug}`)

const buildFormVM = () => {
  formVM.value = contentPageFormVM(slug)
}

onMounted(async () => {
  if (!CONTENT_PAGE_SLUGS.includes(slug)) {
    await navigateTo('/shop-management/content-pages')
    return
  }
  try {
    await getContentPage(slug, contentPageGateway)
    buildFormVM()
  } catch {
    toast.add({ title: t('error.unknown'), color: 'red' })
    await navigateTo('/shop-management/content-pages')
  }
})

const save = async () => {
  try {
    await editContentPage(slug, formVM.value!.getDto(), contentPageGateway)
    buildFormVM()
    toast.add({
      title: t('shopManagement.contentPages.updateSuccess'),
      color: 'green'
    })
  } catch {
    toast.add({
      title: t('shopManagement.contentPages.updateError'),
      color: 'red'
    })
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (formVM.value?.hasChanges) {
    if (confirm(t('shopManagement.contentPages.leavePageConfirm'))) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>
