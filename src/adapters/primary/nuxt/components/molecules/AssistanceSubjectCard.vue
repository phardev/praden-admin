<template lang="pug">
div.flex.items-center.gap-3.bg-customPrimary-50.border.border-customPrimary-200.rounded-xl.p-3
  div.flex.items-center.justify-center.w-9.h-9.rounded-lg.bg-white.text-customPrimary-500.flex-shrink-0
    UIcon.h-5.w-5(:name="iconName" aria-hidden="true")
  div.flex-1.min-w-0
    p.text-sm.font-semibold.text-gray-900.truncate {{ $t(`assistance.categoryShort.${category.toLowerCase()}`) }} · {{ subject.label }}
    p.text-xs.text-gray-500.font-mono {{ shortUuid }}
  UButton(variant="link" size="xs" color="gray" @click="$emit('change')") {{ $t('assistance.panel.change') }}
</template>

<script lang="ts" setup>
import type {
  AssistanceRequestCategory,
  AssistanceSubject
} from '@core/entities/assistanceRequest'
import { AssistanceSubjectType } from '@core/entities/assistanceRequest'

const props = defineProps<{
  category: AssistanceRequestCategory
  subject: AssistanceSubject
}>()

defineEmits<{
  (e: 'change'): void
}>()

const SHORT_UUID_LENGTH = 8

const icons: Record<AssistanceSubjectType, string> = {
  [AssistanceSubjectType.ORDER]: 'i-heroicons-shopping-bag',
  [AssistanceSubjectType.PRODUCT]: 'i-heroicons-cube',
  [AssistanceSubjectType.CUSTOMER]: 'i-heroicons-user'
}

const iconFor = (type: AssistanceSubjectType): string => icons[type]

const iconName = computed(() => iconFor(props.subject.type))

const shortUuid = computed(
  () => `${props.subject.uuid.slice(0, SHORT_UUID_LENGTH)}…`
)
</script>
