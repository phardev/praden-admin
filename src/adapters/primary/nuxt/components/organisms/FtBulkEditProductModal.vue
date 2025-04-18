<template lang="pug">
ft-modal(v-model="model" @close="emit('close')")
  UCard
    template(#header)
      span.text-xl.font-bold Modifier les produits sélectionnés
    UForm(@submit="submit")
      UFormGroup.pb-4(label="Autoriser les promotions" name="arePromotionsAllowed")
        UToggle(
          v-model="arePromotionsAllowed"
          size="xl"
        )
      .mt-6.flex.justify-end.gap-4
        ft-button.button-outline(@click.prevent="emit('close')") Annuler
        ft-button.button-solid(type="submit") Valider
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', dto: any): void
}>()
const arePromotionsAllowed = ref(false)

const submit = () => {
  emit('submit', {
    arePromotionsAllowed: arePromotionsAllowed.value
  })
}
</script>
