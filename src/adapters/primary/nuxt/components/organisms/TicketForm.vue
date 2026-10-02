<template lang="pug">
div(v-if="!vm")
  .space-y-6
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class="w-1/4")
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class="w-1/4")
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-32.bg-gray-200.rounded.animate-pulse
UForm(v-else :state="vm")
  UFormGroup.pb-4(:label="$t('support.create.fields.customer')" name="customer")
    customer-search-select(
      :selected-customer="vm.getCustomer()"
      :namespace="customerNamespace"
      @selected="customerSelected"
      @change="customerCleared"
    )
  UFormGroup.pb-4(
    v-if="vm.getCustomer()"
    :label="$t('support.create.fields.order')"
    :hint="$t('support.create.optional')"
    name="orderUuid"
  )
    USkeleton.h-10(v-if="vm.isLoadingOrders()")
    p.text-sm.text-gray-500(v-else-if="vm.getAvailableOrders().length === 0") {{ $t('support.create.noOrders') }}
    .flex.items-center.gap-2(v-else)
      USelectMenu.flex-1(
        :model-value="vm.get('orderUuid').value"
        :options="vm.getAvailableOrders()"
        value-attribute="uuid"
        option-attribute="label"
        :placeholder="$t('support.create.orderPlaceholder')"
        size="lg"
        @update:model-value="orderChanged"
      )
      UButton(
        v-if="vm.get('orderUuid').value"
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        :aria-label="$t('support.create.clearOrder')"
        @click="orderCleared"
      )
  UFormGroup.pb-4(:label="$t('support.create.fields.subject')" name="subject")
    ft-text-field(
      :model-value="vm.get('subject').value"
      :placeholder="$t('support.create.subjectPlaceholder')"
      @update:model-value="subjectChanged"
    )
  UFormGroup.pb-4(:label="$t('support.create.fields.description')" name="description")
    UTextarea(
      :model-value="vm.get('description').value"
      :placeholder="$t('support.create.descriptionPlaceholder')"
      :rows="6"
      size="lg"
      resize
      @update:model-value="descriptionChanged"
    )
  UFormGroup.pb-4(:label="$t('support.details.priority')" name="priority")
    USelectMenu(
      :model-value="vm.get('priority').value"
      :options="priorityOptions"
      value-attribute="value"
      option-attribute="label"
      size="lg"
      @update:model-value="priorityChanged"
    )
  UFormGroup.pb-4(
    :label="$t('support.attachments.label')"
    :hint="$t('support.create.optional')"
    name="attachments"
  )
    input(
      type="file"
      multiple
      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      @change="filesSelected"
    )
    .mt-2.space-y-1(v-if="vm.get('attachments').value.length > 0")
      .flex.items-center.justify-between.text-xs.bg-gray-50.rounded.px-2.py-1(
        v-for="(file, index) in vm.get('attachments').value"
        :key="index"
      )
        .flex.items-center.gap-2
          UIcon.w-3.h-3(name="i-lucide-file")
          span {{ file.name }}
        UButton(
          icon="i-lucide-x"
          size="2xs"
          variant="ghost"
          :aria-label="$t('support.create.removeAttachment')"
          @click="attachmentRemoved(index)"
        )

  .flex.flex-col.items-end.gap-2.mt-4
    ft-button.button-solid.px-6.text-xl(
      :disabled="!vm.getCanValidate()"
      :loading="vm.isSaving()"
      @click.prevent="validate"
    ) {{ $t('support.create.validate') }}
    ul.text-sm.text-gray-600(v-if="vm.getValidationHints().length > 0")
      li(v-for="hint in vm.getValidationHints()" :key="hint") {{ $t(hint) }}
</template>

<script lang="ts" setup>
import type {
  TicketFormCreateVM,
  TicketPriorityOptionVM
} from '@adapters/primary/view-models/support/ticket-form/ticketFormCreateVM'
import { TICKET_CUSTOMER_SEARCH_NAMESPACE } from '@adapters/primary/view-models/support/ticket-form/ticketFormCreateVM'
import type { TicketPriority } from '@core/entities/ticket'

const props = defineProps<{
  vm?: TicketFormCreateVM
}>()

const emit = defineEmits<{
  (e: 'validate'): void
  (e: 'customer-selected', customerUuid: string): void
  (e: 'customer-cleared'): void
}>()

const { t } = useI18n()
const customerNamespace = TICKET_CUSTOMER_SEARCH_NAMESPACE

const priorityOptions = computed(() => {
  const options: Array<TicketPriorityOptionVM> =
    props.vm?.getPriorityOptions() ?? []
  return options.map((option) => ({
    value: option.value,
    label: t(option.labelKey)
  }))
})

const customerSelected = (customerUuid: string) => {
  props.vm?.set('customerUuid', customerUuid)
  emit('customer-selected', customerUuid)
}

const customerCleared = () => {
  props.vm?.set('customer', undefined)
  emit('customer-cleared')
}

const orderChanged = (orderUuid: string) => {
  props.vm?.set('orderUuid', orderUuid)
}

const orderCleared = () => {
  props.vm?.set('orderUuid', undefined)
}

const subjectChanged = (value: string) => {
  props.vm?.set('subject', value)
}

const descriptionChanged = (value: string) => {
  props.vm?.set('description', value)
}

const priorityChanged = (value: TicketPriority) => {
  props.vm?.set('priority', value)
}

const filesSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!props.vm || !input.files) {
    return
  }
  props.vm.set('attachments', [
    ...props.vm.get('attachments').value,
    ...Array.from(input.files)
  ])
  input.value = ''
}

const attachmentRemoved = (index: number) => {
  if (!props.vm) {
    return
  }
  const attachments: Array<File> = props.vm.get('attachments').value
  props.vm.set(
    'attachments',
    attachments.filter((_, i) => i !== index)
  )
}

const validate = () => {
  if (!props.vm?.getCanValidate()) {
    return
  }
  emit('validate')
}
</script>
