<template lang="pug">
UBadge.uppercase.py-1.px-3(
  :color="generateSubtleColorFromUuid(roleUuid)"
  variant="soft"
  :ui="{ rounded: 'rounded-full' }"
) {{ roleName }}
</template>

<script setup>
import { generateSubtleColorFromUuid } from '@utils/colorUtils'

defineProps({
  roleName: {
    type: String,
    required: true
  },
  roleUuid: {
    type: String,
    required: true
  }
})
</script>
