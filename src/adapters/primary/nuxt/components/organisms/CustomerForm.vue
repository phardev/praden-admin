<template lang="pug">
div(v-if="currentVM")
  UFormGroup.pb-4(label="Prénom" name="firstname")
    ft-text-field(
      :model-value="currentVM.get('firstname').value"
      :disabled="!currentVM.get('firstname').canEdit"
      @update:model-value="firstnameChanged"
    )
  UFormGroup.pb-4(label="Nom" name="lastname")
    ft-text-field(
      :model-value="currentVM.get('lastname').value"
      :disabled="!currentVM.get('lastname').canEdit"
      @update:model-value="lastnameChanged"
    )
  UFormGroup.pb-4(label="E-mail" name="email")
    ft-text-field(
      :model-value="currentVM.get('email').value"
      :disabled="!currentVM.get('email').canEdit"
      @update:model-value="emailChanged"
    )
  UFormGroup.pb-4(label="Téléphone" name="phone")
    ft-text-field(
      :model-value="currentVM.get('phone').value"
      :disabled="!currentVM.get('phone').canEdit"
      @update:model-value="phoneChanged"
    )
  div.flex.flex-row-reverse.mt-4
    ft-button.px-6.text-xl(
      v-if="currentVM.getDisplayValidate()"
      :disabled="!currentVM.getCanValidate()"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'main' })

const props = defineProps({
  vm: {
    type: Object,
    default() {
      return undefined
    }
  }
})

const currentVM = toRef(props, 'vm')

const firstnameChanged = (firstname: string) => {
  currentVM?.value?.set('firstname', firstname)
}

const lastnameChanged = (lastname: string) => {
  currentVM?.value?.set('lastname', lastname)
}

const emailChanged = (email: string) => {
  currentVM?.value?.set('email', email)
}

const phoneChanged = (phone: string) => {
  currentVM?.value?.set('phone', phone)
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
