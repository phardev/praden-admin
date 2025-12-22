<template lang="pug">
div.flex.min-h-screen
  left-side-menu.no-printme(
    :is-opened="sidebarDialog.isOpened()"
    @close="sidebarDialog.close()"
  )
  div.flex-1
    ft-header.no-printme(@open-sidebar="sidebarDialog.open()")
    main
      NuxtErrorBoundary(@error="getError")
        template(#error="{ clearError }")
          ft-alert.max-w-xl.mr-10.mt-5.ml-auto(
            v-if="errorTitle"
            :error-title="errorTitle"
            :error-message="errorMessage"
            @dismiss="clearError"
          )
          slot
        slot
</template>
<script lang="ts" setup>
import { useDialog } from '@adapters/primary/nuxt/composables/useDialog'

const sidebarDialog = useDialog()

const { t } = useI18n()

const errorMessage = ref<string | undefined>(undefined)
const errorTitle = ref<string | undefined>(undefined)

const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    errorTitle.value = undefined
    errorMessage.value = undefined
  }
)

interface AxiosError {
  response?: {
    status: number
    data: unknown
  }
}

const getError = (err: AxiosError) => {
  console.log(err)
  if (err.response) {
    const status = err.response.status
    switch (status) {
      case 400:
        errorTitle.value = t('error.badRequest')
        errorMessage.value = translateValidationErrors(err.response.data)
        break
      case 401:
        errorTitle.value = t('error.unauthorized')
        break
      case 404:
        errorTitle.value = t('error.notFound')
        break
      case 500:
        errorTitle.value = t('error.internal')
        break
      default:
        errorTitle.value = t('error.unknown')
        break
    }
  } else {
    errorTitle.value = t('error.unknown')
  }
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const translateValidationErrors = (errors: unknown): string => {
  const { t } = useI18n()

  if (typeof errors === 'string') {
    if (errors.includes('Unique constraint failed')) {
      const regex = /Unique constraint failed on the fields?: \((.*?)\)/
      const match = errors.match(regex)
      if (match && match[1]) {
        const fields = match[1]
          .split(',')
          .map((field) => field.trim().replace(/[`'"]+/g, ''))
        return fields
          .map((field) => t(`validation.${field}.unique`, { field }))
          .join('\n')
      }
    }
    return errors
  }

  return (errors as string[])
    .map((error: string) => {
      const parts = error.split(':').map((p: string) => p.trim())
      if (parts.length === 2) {
        const field = parts[0]
        const message = parts[1].toLowerCase()
        let validationType = ''
        let params: Record<string, any> = {}
        if (message.includes('required')) {
          validationType = 'required'
        } else if (message.includes('must be greater than')) {
          validationType = 'gt'
          const m = message.match(/must be greater than (\d+)/i)
          if (m) {
            params.min = m[1]
          }
        }
        const translationKey = `validation.${field}.${validationType}`
        const translation = t(translationKey, params)
        return translation !== translationKey ? translation : error
      }
      return error
    })
    .join('\n')
}
</script>
