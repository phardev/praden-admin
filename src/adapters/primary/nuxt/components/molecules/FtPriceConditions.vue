<template lang="pug">
div.space-y-2
  ft-price-filter(
    v-for="(condition, index) in conditions"
    :key="index"
    :operator="condition.operator"
    :amount="condition.amount"
    @update:operator="(operator) => updateOperator(index, operator)"
    @update:amount="(amount) => updateAmount(index, amount)"
    @remove="() => remove(index)"
  )
  UButton(
    icon="i-heroicons-plus-20-solid"
    color="gray"
    variant="link"
    size="xs"
    :padded="false"
    @click="add"
  ) Ajouter une condition
</template>

<script lang="ts" setup>
import type { PriceFilterOperator } from '@core/usecases/shared/priceFilter'

interface PriceConditionRow {
  operator: PriceFilterOperator
  amount: number | undefined
}

const props = defineProps<{
  conditions: Array<PriceConditionRow>
}>()

const emit = defineEmits<{
  (e: 'update:conditions', value: Array<PriceConditionRow>): void
}>()

const updateOperator = (index: number, operator: PriceFilterOperator) => {
  emit(
    'update:conditions',
    props.conditions.map((condition: PriceConditionRow, i: number) =>
      i === index ? { ...condition, operator } : condition
    )
  )
}

const updateAmount = (index: number, amount: number | undefined) => {
  emit(
    'update:conditions',
    props.conditions.map((condition: PriceConditionRow, i: number) =>
      i === index ? { ...condition, amount } : condition
    )
  )
}

const remove = (index: number) => {
  emit(
    'update:conditions',
    props.conditions.filter((_: PriceConditionRow, i: number) => i !== index)
  )
}

const add = () => {
  emit('update:conditions', [
    ...props.conditions,
    { operator: 'lte', amount: undefined }
  ])
}
</script>
