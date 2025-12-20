<template lang="pug">
FtModal(v-model="isOpen" @close="handleClose")
  div(class="max-w-2xl mx-auto")
    .flex.items-center.justify-between.mb-6
      h2.text-xl.font-semibold.text-gray-900 {{ mode === 'create' ? $t('staff.create.title') : $t('staff.edit.title') }}

    p.text-gray-600.mb-6 {{ mode === 'create' ? $t('staff.create.description') : $t('staff.edit.description') }}

    div(v-if="modalState.error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md")
      p(class="text-red-600") {{ modalState.error }}

    div(v-if="modalState.isLoading || !currentFormVM" class="space-y-6")
      div(class="pb-4")
        div(class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4")
        div(class="h-10 bg-gray-200 rounded animate-pulse")
      div(class="pb-4")
        div(class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4")
        div(class="h-10 bg-gray-200 rounded animate-pulse")
      div(class="pb-4")
        div(class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4")
        div(class="h-10 bg-gray-200 rounded animate-pulse")
      div(class="pb-4")
        div(class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4")
        div(class="h-10 bg-gray-200 rounded animate-pulse")

    form(v-else @submit.prevent="handleSubmit")
      UFormGroup(
        :label="$t('staff.form.email.label')"
        name="email"
        required
        class="pb-4"
      )
        ft-text-field(
          :model-value="currentFormVM.get('email').value"
          :disabled="!currentFormVM.get('email').canEdit"
          :placeholder="$t('staff.form.email.placeholder')"
          type="email"
          @update:model-value="emailChanged"
        )

      UFormGroup(
        :label="$t('staff.form.firstname.label')"
        name="firstname"
        class="pb-4"
      )
        ft-text-field(
          :model-value="currentFormVM.get('firstname').value"
          :disabled="!currentFormVM.get('firstname').canEdit"
          :placeholder="$t('staff.form.firstname.placeholder')"
          @update:model-value="firstnameChanged"
        )

      UFormGroup(
        :label="$t('staff.form.lastname.label')"
        name="lastname"
        class="pb-4"
      )
        ft-text-field(
          :model-value="currentFormVM.get('lastname').value"
          :disabled="!currentFormVM.get('lastname').canEdit"
          :placeholder="$t('staff.form.lastname.placeholder')"
          @update:model-value="lastnameChanged"
        )

      UFormGroup(
        :label="$t('staff.form.role.label')"
        name="role"
        required
        class="pb-6"
      )
        ft-role-select(
          :model-value="currentFormVM.get('roleUuid').value"
          :options="roleOptions"
          :disabled="!currentFormVM.get('roleUuid').canEdit"
          @update:model-value="roleChanged"
        )

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
        ) {{ mode === 'create' ? $t('staff.create.submit') : $t('staff.edit.submit') }}
</template>

<script setup lang="ts">
import { getRolesVM } from '@adapters/primary/view-models/roles/get-roles/getRolesVM'
import {
  type StaffFormCreateVM,
  staffFormCreateVM
} from '@adapters/primary/view-models/staff/staff-form/staffFormCreateVM'
import {
  type StaffFormEditVM,
  staffFormEditVM
} from '@adapters/primary/view-models/staff/staff-form/staffFormEditVM'
import { createStaff } from '@core/usecases/staff/staff-creation/createStaff'
import { editStaff } from '@core/usecases/staff/staff-edition/editStaff'
import { useStaffGateway } from '../../../../../../gateways/staffGateway'

interface Props {
  modelValue: boolean
  mode?: 'create' | 'edit'
  staffUuid?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  mode: 'create',
  staffUuid: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const staffGateway = useStaffGateway()
const modalState = reactive({
  isLoading: false,
  isSubmitting: false,
  error: null as string | null
})

const currentFormVM = ref<StaffFormCreateVM | StaffFormEditVM | null>(null)

const roleOptions = computed(() => {
  const rolesVM = getRolesVM()
  return rolesVM.items
})

const canValidate = computed(() => {
  if (!currentFormVM.value) return false
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
  () => isOpen.value,
  async () => {
    if (!isOpen.value) {
      currentFormVM.value = null
      modalState.error = null
      return
    }

    modalState.isLoading = true
    modalState.error = null

    try {
      if (props.mode === 'edit') {
        if (!props.staffUuid) {
          throw new Error('Staff UUID is required for edit mode')
        }
        currentFormVM.value = staffFormEditVM(
          'staff-edit-form',
          props.staffUuid
        )
      } else {
        currentFormVM.value = staffFormCreateVM('staff-create-form')
      }
    } catch (error: any) {
      modalState.error = error.message
    } finally {
      modalState.isLoading = false
    }
  },
  { immediate: true }
)

const emailChanged = (value: string) => {
  if (currentFormVM.value && 'set' in currentFormVM.value) {
    ;(currentFormVM.value as any).set('email', value)
  }
}

const firstnameChanged = (value: string) => {
  if (currentFormVM.value && 'set' in currentFormVM.value) {
    ;(currentFormVM.value as any).set('firstname', value)
  }
}

const lastnameChanged = (value: string) => {
  if (currentFormVM.value && 'set' in currentFormVM.value) {
    ;(currentFormVM.value as any).set('lastname', value)
  }
}

const roleChanged = (value: string) => {
  if (currentFormVM.value && 'set' in currentFormVM.value) {
    ;(currentFormVM.value as any).set('roleUuid', value)
  }
}

const handleSubmit = async () => {
  if (!currentFormVM.value || !canValidate.value) return

  modalState.isSubmitting = true
  try {
    const dto = currentFormVM.value.getDto()

    if (props.mode === 'edit' && props.staffUuid) {
      await editStaff(props.staffUuid, dto, staffGateway)
    } else {
      await createStaff(dto, staffGateway)
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
