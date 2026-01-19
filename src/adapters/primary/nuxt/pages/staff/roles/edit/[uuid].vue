<template lang="pug">
.section.space-y-8
  .flex.items-center.justify-between
    div
      h1.text-page-title {{ $t('roles.edit.title') }}
      p.text-gray-600.mt-1 {{ $t('roles.edit.description') }}

    ft-button(
      variant="outline"
      @click="navigateBack"
    )
      Icon(name="heroicons:arrow-left" class="w-4 h-4 mr-2")
      | {{ $t('common.back') }}

  .max-w-4xl(v-if="!roleNotFound")
    UCard
      RoleForm(
        :current-vm="vm"
        :submit-button-text="$t('roles.edit.submit')"
        :is-submitting="isSubmitting"
        @name-changed="handleNameChanged"
        @permission-toggled="handlePermissionToggled"
        @submit="handleSubmit"
        @cancel="navigateBack"
      )

  // Error state for role not found
  UCard.max-w-4xl(v-else)
    .text-center.py-12
      Icon(name="heroicons:exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4")
      h2.text-xl.font-semibold.text-gray-900.mb-2 {{ $t('roles.edit.notFound.title') }}
      p.text-gray-600.mb-6 {{ $t('roles.edit.notFound.description') }}
      ft-button(@click="navigateBack") {{ $t('common.back') }}
</template>

<script lang="ts" setup>
import { useRoleForm } from '@adapters/primary/nuxt/composables/useRoleForm'
import { roleFormEditVM } from '@adapters/primary/view-models/roles/role-form/roleFormEditVM'
import { PermissionResource } from '@core/entities/permissionResource'
import { listRoles } from '@core/usecases/roles/listRoles'
import { useRoleGateway } from '@/gateways/roleGateway'

// Meta and SEO
definePageMeta({
  title: 'Modifier le rôle',
  layout: 'main'
})

useSeoMeta({
  title: 'Modifier le rôle - Administration',
  description: 'Modifier les permissions et paramètres du rôle'
})

// Route parameters
const route = useRoute()
const roleUuid = route.params.uuid as string

// Composables
const router = useRouter()
const { updateRole } = useRoleForm()
const roleGateway = useRoleGateway()

// State
const isSubmitting = ref(false)
const roleNotFound = ref(false)
const vm = ref<any>(null)

// Initialize
onMounted(async () => {
  try {
    // Load roles to ensure the role exists
    await listRoles(roleGateway)

    // Create the view model with the role UUID
    vm.value = roleFormEditVM('role-edit-form', roleUuid)
  } catch (error: any) {
    // If role doesn't exist, show error state
    if (error.message?.includes('not found')) {
      roleNotFound.value = true
    } else {
      // Redirect to staff page on other errors
      await navigateTo('/staff')
    }
  }
})

// Handlers
const handleNameChanged = (value: string) => {
  if (vm.value) {
    vm.value.setName(value)
  }
}

const handlePermissionToggled = (resource: PermissionResource) => {
  if (vm.value) {
    vm.value.togglePermission(resource)
  }
}

const handleSubmit = async () => {
  if (!vm.value || !vm.value.getCanValidate()) return

  isSubmitting.value = true
  try {
    const result = await updateRole(roleUuid, vm.value)

    if (result.success) {
      await navigateTo('/staff')
    }
  } finally {
    isSubmitting.value = false
  }
}

const navigateBack = () => {
  router.push('/staff')
}
</script>
