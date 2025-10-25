<template lang="pug">
.section.space-y-8
  .flex.items-center.justify-between
    div
      h1.text-page-title {{ $t('roles.create.title') }}
      p.text-gray-600.mt-1 {{ $t('roles.create.description') }}

    ft-button(
      variant="outline"
      @click="navigateBack"
    )
      Icon(name="heroicons:arrow-left" class="w-4 h-4 mr-2")
      | {{ $t('common.back') }}

  .max-w-4xl
    UCard
      RoleForm(
        :current-vm="vm"
        :submit-button-text="$t('roles.create.submit')"
        :is-submitting="isSubmitting"
        @name-changed="handleNameChanged"
        @permission-toggled="handlePermissionToggled"
        @submit="handleSubmit"
        @cancel="navigateBack"
      )
</template>

<script lang="ts" setup>
import { useRoleForm } from '@adapters/primary/nuxt/composables/useRoleForm'
import { roleFormCreateVM } from '@adapters/primary/view-models/roles/role-form/roleFormCreateVM'
import { PermissionResource } from '@core/entities/permissionResource'

// Meta and SEO
definePageMeta({
  title: 'Créer un nouveau rôle',
  layout: 'default'
})

useSeoMeta({
  title: 'Créer un nouveau rôle - Administration',
  description: 'Créer un nouveau rôle avec des permissions personnalisées'
})

// Composables
const { $router } = useNuxtApp()
const { createNewRole } = useRoleForm()

// State
const vm = roleFormCreateVM('role-create-form')
const isSubmitting = ref(false)

// Handlers
const handleNameChanged = (value: string) => {
  vm.setName(value)
}

const handlePermissionToggled = (resource: PermissionResource) => {
  vm.togglePermission(resource)
}

const handleSubmit = async () => {
  if (!vm.getCanValidate()) return

  isSubmitting.value = true
  try {
    const result = await createNewRole(vm)

    if (result.success) {
      await navigateTo('/staff')
    }
  } finally {
    isSubmitting.value = false
  }
}

const navigateBack = () => {
  $router.push('/staff')
}
</script>
