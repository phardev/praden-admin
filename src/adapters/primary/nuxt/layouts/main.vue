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
    assistance-request-panel
  UNotifications
</template>
<script lang="ts" setup>
import {
  type ErrorWithResponse,
  useApiErrorMessage
} from '@adapters/primary/nuxt/composables/useApiErrorMessage'
import { useDialog } from '@adapters/primary/nuxt/composables/useDialog'

const sidebarDialog = useDialog()

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

const { fromError } = useApiErrorMessage()

const getError = (err: ErrorWithResponse) => {
  const { title, message } = fromError(err)
  errorTitle.value = title
  errorMessage.value = message
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
