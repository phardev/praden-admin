<template lang="pug">
UTooltip(:text="$t('shopManagement.contentPages.mandatoryHelp')")
  UBadge(
    color="amber"
    variant="subtle"
    :ui="{ rounded: 'rounded-full' }"
  )
    .flex.items-center.gap-1
      icon.h-3.w-3(name="i-heroicons-lock-closed")
      span {{ $t('shopManagement.contentPages.mandatory') }}
</template>
