<template lang="pug">
HomepageShowcaseEditor(:kind="ShowcaseKind.PharmacistSelection")
</template>

<script lang="ts" setup>
import HomepageShowcaseEditor from '@adapters/primary/nuxt/components/organisms/HomepageShowcaseEditor.vue'
import { ShowcaseKind } from '@core/entities/homepageShowcase'

definePageMeta({ layout: 'main' })
</script>
