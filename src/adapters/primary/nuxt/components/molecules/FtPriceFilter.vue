<template lang="pug">
div.flex.items-center.gap-2
  USelect.w-20.shrink-0(
    :model-value="operator"
    :options="operatorOptions"
    value-attribute="value"
    option-attribute="label"
    size="lg"
    aria-label="Opérateur de comparaison du prix"
    @update:model-value="operatorChanged"
  )
  ft-text-field.min-w-0.flex-1(
    :model-value="amount"
    type="number"
    min="0"
    step="0.01"
    placeholder="Montant en €"
    aria-label="Montant du filtre en euros"
    @update:model-value="amountChanged"
  )
  UButton.shrink-0(
    color="gray"
    variant="link"
    icon="i-heroicons-x-mark-20-solid"
    :padded="false"
    aria-label="Supprimer cette condition de prix"
    @click.prevent="remove"
  )
</template>

<script lang="ts" setup>
import type { PriceFilterOperator } from '@core/usecases/shared/priceFilter'

defineProps<{
  operator: PriceFilterOperator
  amount: number | undefined
}>()

const emit = defineEmits<{
  (e: 'update:operator', value: PriceFilterOperator): void
  (e: 'update:amount', value: number | undefined): void
  (e: 'remove'): void
}>()

const operatorOptions = [
  { value: 'lte', label: '≤' },
  { value: 'eq', label: '=' },
  { value: 'gte', label: '≥' }
]

const operatorChanged = (value: PriceFilterOperator) => {
  emit('update:operator', value)
}

const amountChanged = (value: string) => {
  const parsed = Number(value)
  const isValid = value !== '' && value !== null && !isNaN(parsed) && parsed > 0
  emit('update:amount', isValid ? parsed : undefined)
}

const remove = () => {
  emit('remove')
}
</script>
