<template lang="pug">
div(v-if="!vm")
  .space-y-6
    .pb-4
      .h-20.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
UForm(v-else :state="vm")
  p.text-gray-600.mb-6 {{ $t('welcomeCode.formDescription') }}
  .flex.gap-6.mb-4
    ft-button.text-xl.flex-1.h-20(
      v-for="scopeChoice in vm.getAvailableScopeChoices()"
      :key="scopeChoice.scope"
      :variant="scopeChoice.scope === vm.get('scope').value ? 'solid' : 'outline'"
      @click.prevent="scopeChanged(scopeChoice.scope)"
    ) {{ $t(scopeChoice.labelKey) }}
  .flex.gap-6.mb-4
    ft-button.text-xl.flex-1.h-20(
      v-for="typeChoice in vm.getAvailableTypeChoices()"
      :key="typeChoice.type"
      :variant="typeChoice.type === vm.get('reductionType').value ? 'solid' : 'outline'"
      @click.prevent="reductionTypeChanged(typeChoice.type)"
    ) {{ $t(typeChoice.labelKey) }}
  UFormGroup.pb-4(:label="$t('welcomeCode.fields.code')" name="code")
    ft-text-field(
      :model-value="vm.get('code').value"
      @update:model-value="codeChanged"
    )
  UFormGroup.pb-4(:label="$t('welcomeCode.fields.amount')" name="amount")
    ft-currency-input(
      v-if="vm.get('reductionType').value === ReductionType.Fixed"
      :model-value="vm.get('amount').value"
      @update:model-value="amountChanged"
    )
    ft-percentage-input(
      v-else
      :model-value="vm.get('amount').value"
      @update:model-value="amountChanged"
    )
  UFormGroup.pb-4(:label="$t('welcomeCode.fields.minimumAmount')" name="minimumAmount")
    ft-currency-input(
      :model-value="vm.get('minimumAmount').value"
      @update:model-value="minimumAmountChanged"
    )
  UFormGroup.pb-4(:label="$t('welcomeCode.fields.deliveryMethods')" name="deliveryMethodUuids")
    USelectMenu(
      :model-value="vm.get('deliveryMethodUuids').value"
      :options="vm.getAvailableDeliveryMethods()"
      multiple
      value-attribute="uuid"
      option-attribute="name"
      :placeholder="$t('welcomeCode.allDeliveryMethods')"
      @update:model-value="deliveryMethodsChanged"
    )
  UFormGroup.pb-4(
    v-if="vm.get('scope').value === PromotionScope.Delivery"
    :label="$t('welcomeCode.fields.maxWeight')"
    name="maxWeight"
  )
    ft-text-field(
      :model-value="vm.get('maxWeight').value"
      type="number"
      step="0.1"
      @update:model-value="maxWeightChanged"
    )
  .flex.mb-4.gap-8
    UFormGroup.pb-4(:label="$t('welcomeCode.fields.startDate')" name="startDate")
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton(
          icon="i-heroicons-calendar-days-20-solid"
          :label="dateLabel(vm.get('startDate').value)"
        )
          template(#trailing)
            UButton(
              v-show="vm.get('startDate').value"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              :aria-label="$t('welcomeCode.clearDate')"
              @click.stop.prevent="startDateChanged(undefined)"
            )
        template(#panel="{ close }")
          ft-date-picker(
            :model-value="vm.get('startDate').value"
            @update:model-value="startDateChanged"
            @close="close"
          )
    UFormGroup.pb-4(:label="$t('welcomeCode.fields.endDate')" name="endDate")
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton(
          icon="i-heroicons-calendar-days-20-solid"
          :label="dateLabel(vm.get('endDate').value)"
        )
          template(#trailing)
            UButton(
              v-show="vm.get('endDate').value"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              :aria-label="$t('welcomeCode.clearDate')"
              @click.stop.prevent="endDateChanged(undefined)"
            )
        template(#panel="{ close }")
          ft-date-picker(
            :model-value="vm.get('endDate').value"
            :is-end-date="true"
            @update:model-value="endDateChanged"
            @close="close"
          )

  .flex.flex-col.items-end.gap-2.mt-4
    ft-button.button-solid.px-6.text-xl(
      :disabled="!vm.getCanValidate()"
      :loading="vm.isSaving()"
      @click.prevent="validate"
    ) {{ $t('welcomeCode.validate') }}
    ul.text-sm.text-gray-600(v-if="vm.getValidationHints().length > 0")
      li(v-for="hint in vm.getValidationHints()" :key="hint") {{ $t(hint) }}
</template>

<script lang="ts" setup>
import type { WelcomeCodeFormVM } from '@adapters/primary/view-models/welcome-codes/welcome-code-form/welcomeCodeFormVM'
import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { timestampToLocaleString } from '@utils/formatters'

const props = defineProps<{
  vm?: WelcomeCodeFormVM
}>()

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const { t } = useI18n()

const dateLabel = (timestamp?: number): string =>
  timestamp
    ? timestampToLocaleString(timestamp, 'fr-FR')
    : t('welcomeCode.selectDate')

const scopeChanged = (scope: PromotionScope) => {
  props.vm?.set('scope', scope)
}

const reductionTypeChanged = (type: ReductionType) => {
  props.vm?.set('reductionType', type)
}

const codeChanged = (value: string) => {
  props.vm?.set('code', value)
}

const amountChanged = (value: number) => {
  props.vm?.set('amount', value)
}

const minimumAmountChanged = (value: number) => {
  props.vm?.set('minimumAmount', value)
}

const deliveryMethodsChanged = (uuids: Array<string>) => {
  props.vm?.set('deliveryMethodUuids', uuids)
}

const maxWeightChanged = (value: string) => {
  props.vm?.set('maxWeight', value)
}

const startDateChanged = (value?: number) => {
  props.vm?.set('startDate', value)
}

const endDateChanged = (value?: number) => {
  props.vm?.set('endDate', value)
}

const validate = () => {
  if (!props.vm?.getCanValidate()) {
    return
  }
  emit('validate')
}
</script>
