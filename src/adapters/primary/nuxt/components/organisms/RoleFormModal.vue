<template lang="pug">
FtModal(v-model="isOpen" @close="handleClose")
  div(class="max-w-2xl mx-auto")
    .flex.items-center.justify-between.mb-6
      h2.text-xl.font-semibold.text-gray-900
        | {{ mode === 'create' ? $t('roles.create.title') : $t('roles.edit.title') }}

    p.text-gray-600.mb-6
      | {{ mode === 'create' ? $t('roles.create.description') : $t('roles.edit.description') }}

    div(v-if="modalState.error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md")
      p(class="text-red-600") {{ modalState.error }}

    div(v-if="modalState.isLoading || !currentFormVM" class="space-y-6")
      div(class="pb-4")
        div(class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4")
        div(class="h-10 bg-gray-200 rounded animate-pulse")
      div(class="pb-4")
        div(class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4")
        div(class="space-y-2")
          div(class="h-6 bg-gray-200 rounded animate-pulse")
          div(class="h-6 bg-gray-200 rounded animate-pulse")
          div(class="h-6 bg-gray-200 rounded animate-pulse")
          div(class="h-6 bg-gray-200 rounded animate-pulse")

    form(v-else @submit.prevent="handleSubmit")
      UFormGroup(
        :label="$t('roles.form.name.label')"
        name="name"
        required
        class="pb-4"
      )
        ft-text-field(
          :model-value="currentFormVM.get('name').value"
          :disabled="!currentFormVM.get('name').canEdit"
          :placeholder="$t('roles.form.name.placeholder')"
          @update:model-value="nameChanged"
        )

      UFormGroup(
        :label="$t('roles.form.permissions.label')"
        name="permissions"
        required
        class="pb-6"
      )
        p(class="text-sm text-gray-600 mb-4") {{ $t('roles.form.permissions.description') }}

        div(class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3")
          div(
            v-for="permission in availablePermissions"
            :key="permission.resource"
            class="flex items-center space-x-3"
          )
            ft-checkbox(
              :id="`permission-${permission.resource}`"
              :key="permission.selected"
              :model-value="permission.selected"
              @click.stop.prevent="() => togglePermission(permission.resource)"
            )
            label(
              class="text-sm font-medium text-gray-900 cursor-pointer"
              :for="`permission-${permission.resource}`"
            ) {{ permission.label }}

      div(class="flex justify-end space-x-4 pt-6 border-t border-gray-200")
        ft-button(
          type="button"
          variant="outline"
          @click="handleClose"
        ) {{ $t('common.cancel') }}

        ft-button(
          type="submit"
          :disabled="!canValidate"
          :loading="modalState.isSubmitting"
        ) {{ mode === 'create' ? $t('roles.create.submit') : $t('roles.edit.submit') }}
</template>

<script setup lang="ts">
import { type RoleFormCreateVM } from '@adapters/primary/view-models/roles/role-form/roleFormCreateVM'
import { type RoleFormEditVM } from '@adapters/primary/view-models/roles/role-form/roleFormEditVM'
import { type RoleFormVM } from '@adapters/primary/view-models/roles/role-form/roleFormVM'
import {
  openRoleModalForCreate,
  openRoleModalForEdit
} from '@adapters/primary/view-models/roles/role-modal/roleModalVM'
import { PermissionResource } from '@core/entities/permissionResource'
import { createRole } from '@core/usecases/roles/role-creation/createRole'
import { editRole } from '@core/usecases/roles/role-edition/editRole'
import { useRoleGateway } from '@/gateways/roleGateway'

interface Props {
  modelValue: boolean
  mode: 'create' | 'edit'
  roleUuid?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  mode: 'create',
  roleUuid: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const roleGateway = useRoleGateway()
const modalState = reactive({
  isLoading: false,
  isSubmitting: false,
  error: null as string | null
})

const currentFormVM = ref<RoleFormVM | null>(null)

const formKey = computed(() => {
  if (props.mode === 'create') {
    return 'role-create-form'
  } else if (props.mode === 'edit' && props.roleUuid) {
    return `role-edit-form-${props.roleUuid}`
  }
  return null
})

// Reactive computed properties that watch the formStore
const availablePermissions = computed(() => {
  if (!currentFormVM.value || !formKey.value) return []
  if ('getAvailablePermissions' in currentFormVM.value) {
    return (currentFormVM.value as any).getAvailablePermissions()
  }
  return []
})

const canValidate = computed(() => {
  if (!currentFormVM.value) return false
  // Check if the VM has the getCanValidate method
  if ('getCanValidate' in currentFormVM.value) {
    return (currentFormVM.value as any).getCanValidate()
  }
  return false
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

watch(
  () => [props.mode, props.roleUuid, isOpen.value],
  async () => {
    if (!isOpen.value) {
      currentFormVM.value = null
      modalState.error = null
      return
    }

    modalState.isLoading = true
    modalState.error = null

    try {
      if (props.mode === 'create') {
        currentFormVM.value = openRoleModalForCreate()
      } else if (props.mode === 'edit' && props.roleUuid) {
        currentFormVM.value = openRoleModalForEdit(props.roleUuid)
      }
    } catch (error: any) {
      modalState.error = error.message
    } finally {
      modalState.isLoading = false
    }
  },
  { immediate: true }
)

const nameChanged = (value: string) => {
  if (currentFormVM.value && 'set' in currentFormVM.value) {
    ;(currentFormVM.value as any).set('name', value)
  }
}

const togglePermission = (resource: PermissionResource) => {
  if (currentFormVM.value && 'togglePermission' in currentFormVM.value) {
    ;(currentFormVM.value as any).togglePermission(resource)
  }
}

const handleSubmit = async () => {
  if (!currentFormVM.value || !canValidate.value) return

  modalState.isSubmitting = true
  try {
    if (props.mode === 'create') {
      const dto = (currentFormVM.value as RoleFormCreateVM).getDto()
      await createRole(dto, roleGateway)
    } else if (props.mode === 'edit' && props.roleUuid) {
      const dto = (currentFormVM.value as RoleFormEditVM).getDto()
      await editRole(props.roleUuid, dto, roleGateway)
    }

    emit('success')
    handleClose()
  } catch (error: any) {
    modalState.error = error.message
  } finally {
    modalState.isSubmitting = false
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
