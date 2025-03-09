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

const errorMessage = ref(undefined)
const errorTitle = ref(undefined)

const getError = (err) => {
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
    // If not a unique constraint error, just return the original error string.
    return errors
  }

  return errors
    .map((error) => {
      // Expect error string in the format "field: ValidationMessage"
      const parts = error.split(':').map((p) => p.trim())
      if (parts.length === 2) {
        const [field, validation] = parts
        // Build a translation key like "validation.name.required"
        const key = `validation.${field}.${validation.toLowerCase()}`
        const translated = t(key)
        // If the translation key is missing, fallback to a default message
        return translated !== key ? translated : t('validation.default')
      }
      // Fallback if not in the expected format
      return error
    })
    .join('\n')
}
</script>
