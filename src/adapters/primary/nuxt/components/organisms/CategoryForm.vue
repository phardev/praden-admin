<template lang="pug">
div(v-if="currentVM")
  UFormGroup.pb-4(label="Nom" name="name")
    ft-text-field(
      :model-value="currentVM.getName().value"
      @update:model-value="nameChanged"
    )
  UFormGroup.pb-4(label="Description" name="description")
    ft-text-field(
      :model-value="currentVM.getDescription().value"
      @update:model-value="descriptionChanged"
    )
  UFormGroup.pb-4(label="Catégorie parent" name="category")
    ft-autocomplete(
      :model-value="currentVM.getParentUuid().value"
      :options="currentVM.getAvailableCategories()"
      placeholder="Rechercher une catégorie"
      by="id"
      option-attribute="name"
      value-attribute="uuid"
      @update:model-value="parentCategoryChanged"
      @clear="clearParentCategory"
    )
      template(#option="{ option: category }")
        span {{ category.name }}
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

const nameChanged = (name: string) => {
  currentVM?.value?.setName(name)
}

const parentCategoryChanged = (uuid: string) => {
  currentVM?.value?.setParentUuid(uuid)
}

const clearParentCategory = () => {
  currentVM?.value?.setParentUuid(undefined)
}

const descriptionChanged = (description: string) => {
  currentVM?.value?.setDescription(description)
}

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const validate = async () => {
  emit('validate')
}
</script>
