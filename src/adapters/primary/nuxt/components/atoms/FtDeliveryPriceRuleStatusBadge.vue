<template lang="pug">
UBadge.uppercase.py-2.px-4(
  :color="colors[status]"
  :ui="{ rounded: 'rounded-full' }"
) {{ $t(`deliveryPriceRules.status.${status}`) }}
</template>

<script setup lang="ts">
import type { DeliveryPriceRuleStatus } from '@core/entities/deliveryPriceRule'

defineProps<{
  status: DeliveryPriceRuleStatus
}>()

const colors: Record<DeliveryPriceRuleStatus, string> = {
  disabled: 'gray',
  upcoming: 'blue',
  active: 'green',
  expired: 'orange'
}
</script>
