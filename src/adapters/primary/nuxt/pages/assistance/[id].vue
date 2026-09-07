<template lang="pug">
.section
  .space-y-6(v-if="showSkeleton")
    .flex.items-start.gap-4
      USkeleton.h-11.w-11.rounded-xl
      .flex-1.space-y-2
        USkeleton.h-4.w-40
        USkeleton.h-7.w-96
        USkeleton.h-4.w-80
    USkeleton.h-20.w-full.rounded-2xl
    .space-y-4.rounded-2xl.border.border-gray-100.bg-white.p-6
      USkeleton.ml-auto.h-14.w-96.rounded-xl
      USkeleton.h-14.w-96.rounded-xl
      USkeleton.ml-auto.h-14.w-96.rounded-xl

  div(v-else-if="item")
    .mb-6.flex.items-start.gap-4
      UButton(
        icon="i-heroicons-arrow-left"
        variant="soft"
        color="primary"
        size="lg"
        class="rounded-xl"
        :aria-label="$t('assistance.details.back')"
        @click="router.push('/assistance')"
      )
      .min-w-0.flex-1
        .flex.items-center.gap-3
          span.font-mono.text-sm.text-gray-500 {{ item.reference }}
          ft-assistance-status-badge(:status="item.status")
        h1.mb-1.mt-1.text-2xl.font-semibold.text-gray-900 {{ item.title }}
        .flex.flex-wrap.items-center.gap-4.text-sm.text-gray-500
          span.inline-flex.items-center(class="gap-1.5")
            UIcon.h-4.w-4(:name="subjectIcon")
            | {{ $t(`assistance.categoryShort.${item.category.toLowerCase()}`) }}
            span(v-if="item.subjectLabel") · {{ item.subjectLabel }}
          NuxtLink.text-link.inline-flex.items-center.font-medium(
            class="gap-1.5"
            v-if="item.subjectPageUrl && openPageLabel"
            :to="item.subjectPageUrl"
          )
            UIcon.h-4.w-4(name="i-heroicons-arrow-top-right-on-square")
            | {{ openPageLabel }}
          span.inline-flex.items-center(class="gap-1.5")
            UIcon.h-4.w-4(name="i-heroicons-user")
            | {{ item.author }}
          span.inline-flex.items-center(class="gap-1.5")
            UIcon.h-4.w-4(name="i-heroicons-clock")
            | {{ item.createdAt }}
      ft-button(
        v-if="item.canResolve"
        variant="outline"
        color="primary"
        icon="i-heroicons-check"
        :loading="isResolving"
        :disabled="isResolving"
        @click="resolve"
      ) {{ $t('assistance.details.resolve') }}

    ft-assistance-stepper.mb-6(
      :current="item.stepper.current"
      :is-cancelled="item.stepper.isCancelled"
    )

    .rounded-2xl.border.border-gray-100.bg-white.p-6.shadow-sm
      assistance-thread(:request-id="item.id" :messages="item.messages")
      .mt-5.border-t.border-gray-100.pt-4
        assistance-reply-box(
          v-if="item.canReply"
          ref="replyBox"
          :placeholder="replyPlaceholder"
          :is-sending="isSending"
          @send="reply"
        )
        UAlert(
          v-else
          color="primary"
          variant="soft"
          :description="$t('assistance.details.closedNotice')"
        )

  .flex.flex-wrap.items-center.gap-4(v-else-if="hasLoadFailed")
    UAlert.flex-1(color="red" variant="soft" :description="$t('assistance.empty.loadFailed')")
    ft-button(variant="outline" color="primary" @click="load") {{ $t('assistance.empty.retry') }}
    NuxtLink.text-link.inline-flex.items-center.font-medium(class="gap-1.5" to="/assistance")
      UIcon.h-4.w-4(name="i-heroicons-arrow-left")
      | {{ $t('assistance.details.back') }}
</template>

<script lang="ts" setup>
import { assistanceRequestDetailsVM } from '@adapters/primary/view-models/assistance/assistance-request-details/assistanceRequestDetailsVM'
import type { AssistanceRequestCategory } from '@core/entities/assistanceRequest'
import { AssistanceRequestDoesNotExistsError } from '@core/errors/AssistanceRequestDoesNotExistsError'
import { addAssistanceMessage } from '@core/usecases/assistance/assistance-message-addition/addAssistanceMessage'
import { getAssistanceRequestDetails } from '@core/usecases/assistance/assistance-request-details/getAssistanceRequestDetails'
import { resolveAssistanceRequest } from '@core/usecases/assistance/assistance-request-resolution/resolveAssistanceRequest'
import { useAssistanceRequestGateway } from '../../../../../../gateways/assistanceRequestGateway'
import { useDateProvider } from '../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

const NOW_REFRESH_INTERVAL_MS = 60 * 1000

const subjectIcons: Record<AssistanceRequestCategory, string> = {
  ORDER: 'i-heroicons-shopping-bag',
  DELIVERY: 'i-heroicons-truck',
  PRODUCT: 'i-heroicons-cube',
  CUSTOMER: 'i-heroicons-user',
  OTHER: 'i-heroicons-tag'
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const gateway = useAssistanceRequestGateway()
const dateProvider = useDateProvider()

const id = String(route.params.id)
const now = ref(dateProvider.now())
const hasLoadFailed = ref(false)
const isSending = ref(false)
const isResolving = ref(false)
const replyBox = ref<{ clear: () => void } | null>(null)
let refreshTimer: ReturnType<typeof setInterval> | undefined

const vm = computed(() => assistanceRequestDetailsVM(now.value))

const item = computed(() =>
  vm.value.item?.id === id ? vm.value.item : undefined
)

const showSkeleton = computed(
  () => vm.value.isLoading || (!item.value && !hasLoadFailed.value)
)

const subjectIcon = computed(() =>
  item.value ? subjectIcons[item.value.category] : subjectIcons.OTHER
)

const openPageLabel = computed(() =>
  item.value?.openPageKey ? t(item.value.openPageKey) : undefined
)

const replyPlaceholder = computed(() =>
  item.value?.replyToName
    ? t('assistance.details.replyPlaceholder', { name: item.value.replyToName })
    : t('assistance.details.replyPlaceholderDefault')
)

const referenceNumber = (reference: string): string =>
  reference.replace(/^#/, '')

const notifyError = (key: string) => {
  toast.add({ title: t(key), color: 'red' })
}

const load = async () => {
  hasLoadFailed.value = false
  try {
    await getAssistanceRequestDetails(id, gateway)
  } catch (error) {
    hasLoadFailed.value = true
    if (error instanceof AssistanceRequestDoesNotExistsError) {
      notifyError('assistance.details.notFound')
      router.replace('/assistance')
      return
    }
    notifyError('assistance.empty.loadFailed')
  }
}

const reply = async ({
  content,
  files
}: {
  content: string
  files: Array<File>
}) => {
  isSending.value = true
  try {
    await addAssistanceMessage(id, content, files, gateway)
    replyBox.value?.clear()
  } catch {
    notifyError('assistance.details.sendFailed')
  } finally {
    isSending.value = false
  }
}

const resolve = async () => {
  if (!item.value) return
  const reference = referenceNumber(item.value.reference)
  isResolving.value = true
  try {
    await resolveAssistanceRequest(id, gateway)
    toast.add({
      title: t('assistance.details.resolvedToast', { reference }),
      color: 'green'
    })
  } catch {
    notifyError('assistance.details.resolveFailed')
  } finally {
    isResolving.value = false
  }
}

const refreshNow = () => {
  now.value = dateProvider.now()
}

onMounted(() => {
  load()
  refreshTimer = setInterval(refreshNow, NOW_REFRESH_INTERVAL_MS)
})

onUnmounted(() => {
  clearInterval(refreshTimer)
})
</script>
