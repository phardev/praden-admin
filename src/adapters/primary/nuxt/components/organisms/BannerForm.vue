<template lang="pug">
div(v-if="currentVM")
  UFormGroup.pb-4(:label="currentVM.get('isActive').value ? 'Actif' : 'Inactif'" name="isActive")
    ft-toggle(
      :model-value="currentVM.get('isActive').value"
      :disabled="!currentVM.get('isActive').canEdit"
      @update:model-value="isActiveChanged"
    )
  UFormGroup.pb-4(label="Image" name="image")
    img.mb-4(
      v-if="currentVM.get('img').value"
      :src="currentVM.get('img').value"
      height=300
      width=1500
      alt="image"
    )
    ft-file-input(
      v-if="currentVM.get('img').canEdit"
      accept="image/*"
      @input="imageChanged"
    )
  UFormGroup.pb-4(label="Lien" name="href")
    ft-text-field(
      :model-value="currentVM.get('href').value"
      :disabled="!currentVM.get('href').canEdit"
      @update:model-value="hrefChanged"
    )
  UFormGroup.pb-4(label="Position" name="order")
    ft-text-field(
      type="number"
      :model-value="currentVM.get('order').value"
      :disabled="!currentVM.get('order').canEdit"
      @update:model-value="orderChanged"
    )

  div.flex.mb-4.gap-8
    UFormGroup.pb-4(label="Date de début" name="startDate")
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton(
          icon="i-heroicons-calendar-days-20-solid"
          :disabled="!currentVM.get('startDate').canEdit"
          :label="currentVM.get('startDate').value ? format(currentVM.get('startDate').value, 'd MMMM yyy', { locale: fr }) : 'Choisissez une date'"
        )
          template(#trailing)
            UButton(
              v-show="currentVM.get('startDate').canEdit && currentVM.get('startDate').value"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click.prevent="clearStartDate"
            )
        template(#panel="{ close }")
          ft-date-picker(
            v-model="currentVM.get('startDate').value"
            @update:model-value="startDateChanged"
            @close="close"
          )
    UFormGroup.pb-4(label="Date de fin" name="endDate")
      UPopover(:popper="{ placement: 'bottom-start' }")
        UButton(
          icon="i-heroicons-calendar-days-20-solid"
          :disabled="!currentVM.get('endDate').canEdit"
          :label="currentVM.get('endDate').value ? format(currentVM.get('endDate').value, 'd MMMM yyy', { locale: fr }) : 'Choisissez une date'"
        )
          template(#trailing)
            UButton(
              v-show="currentVM.get('endDate').canEdit && currentVM.get('endDate').value"
              color="white"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click.prevent="clearEndDate"
            )
        template(#panel="{ close }")
          ft-date-picker(
            v-model="currentVM.get('endDate').value"
            @update:model-value="endDateChanged"
            @close="close"
          )

  div.flex.flex-row-reverse.mt-4
    ft-button.px-6.text-xl(
      v-if="currentVM.getDisplayValidate()"
      :disabled="!currentVM.getCanValidate()"
      @click.prevent="validate"
    ) Valider
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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

const isActiveChanged = (isActive: string) => {
  currentVM?.value?.set('isActive', isActive)
}

const hrefChanged = (href: string) => {
  currentVM?.value?.set('href', href)
}

const orderChanged = (order: string) => {
  currentVM?.value?.set('order', order)
}

const imageChanged = async (value: any) => {
  await currentVM?.value?.set('img', value[0])
}

const startDateChanged = (date: number) => {
  currentVM.value.set('startDate', date)
}

const clearStartDate = () => {
  currentVM.value.set('startDate', null)
}

const endDateChanged = (date: number) => {
  currentVM.value.set('endDate', date)
}

const clearEndDate = () => {
  currentVM.value.set('endDate', null)
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
