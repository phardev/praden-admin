<template lang="pug">
ft-modal(v-model="model" @close="emit('close')")
  UCard
    template(#header)
      .flex.items-center.gap-2
        UIcon(name="i-heroicons-pencil-square" class="text-primary text-2xl")
        span.text-xl.font-bold Modifier plusieurs produits
    .mb-2.flex.items-center.gap-2.bg-primary-100.text-primary-800.rounded.p-3
      UIcon(name="i-heroicons-information-circle" class="text-lg")
      span.text-base.font-medium {{ productCountText }}
    UForm(class="space-y-4" @submit="submit")
      UFormGroup.pb-4(label="Autoriser les promotions pour tous" name="arePromotionsAllowed")
        .flex.items-center.gap-4
          UToggle(
            v-model="arePromotionsAllowed"
            size="xl"
            aria-label="Autoriser les promotions"
          )
          span.text-base {{ arePromotionsAllowed ? 'Oui, promotions autorisées' : 'Non, promotions interdites' }}
      .mt-6.flex.justify-end.gap-4
        ft-button.button-outline(type="button" aria-label="Annuler" @click="emit('close')") Annuler
        ft-button.button-solid(type="submit" aria-label="Appliquer les modifications") Appliquer à la sélection
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', dto: any): void
}>()
const arePromotionsAllowed = ref(false)
const props = defineProps<{ selectedCount?: number }>()

const productCountText = computed(() => {
  if (!props.selectedCount || props.selectedCount < 2)
    return '1 produit sélectionné'
  return `${props.selectedCount} produits sélectionnés`
})

const submit = () => {
  emit('submit', {
    arePromotionsAllowed: arePromotionsAllowed.value
  })
}
</script>
