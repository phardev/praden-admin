<template lang="pug">
.section.space-y-8
  h1.text-page-title.flex-grow {{ $t('staff.title') }}

  TabGroup.border-b.border-gray-200.mt-4(as="div")
    TabList.-mb-px.flex.space-x-4
      Tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
        v-for="(tab, tabIndex) in tabs"
        v-slot="{ selected }"
        :key="tabIndex"
        as="div"
      )
        div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
          :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
        )
          div {{ tab.label }}
    TabPanels
      TabPanel.mt-4
        ft-staff-list(
          :items="staffVM.items"
          :is-loading="staffVM.isLoading"
          :is-assigning-role="isAssigningRole"
          :role-options="roleOptions"
          @role-changed="handleRoleChange"
        )
      TabPanel.mt-4
        ft-permission-matrix(
          :system-resources="permissionMatrixVM.systemResources"
          :roles="permissionMatrixVM.roles"
          :permissions="permissionEditVM ? permissionEditVM.getCurrentPermissions() : permissionMatrixVM.permissions"
          :is-loading="permissionMatrixVM.isLoading || isSavingPermissions"
          :has-changes="permissionEditVM ? permissionEditVM.hasChanges() : false"
          @permission-changed="handlePermissionChange"
          @save-changes="handleSavePermissions"
          @reset-changes="handleResetChanges"
        )
</template>

<script lang="ts" setup>
import { listStaff } from '@core/usecases/staff/listStaff'
import { assignRoleToStaff } from '@core/usecases/staff/assignRoleToStaff'
import { editRole } from '@core/usecases/roles/role-edition/editRole'
import { listRoles } from '@core/usecases/roles/listRoles'
import { listSystemResources } from '@core/usecases/system-resources/listSystemResources'
import { useStaffGateway } from '../../../../../../gateways/staffGateway'
import { useRoleGateway } from '../../../../../../gateways/roleGateway'
import { useSystemResourceGateway } from '../../../../../../gateways/systemResourceGateway'
import { getStaffVM } from '@adapters/primary/view-models/staff/get-staff/getStaffVM'
import { getRolesVM } from '@adapters/primary/view-models/roles/get-roles/getRolesVM'
import { getPermissionMatrixVM } from '@adapters/primary/view-models/permissions/get-permission-matrix/getPermissionMatrixVM'
import {
  permissionMatrixEditVM,
  PermissionMatrixEditVM
} from '@adapters/primary/view-models/permissions/permission-matrix-edit/permissionMatrixEditVM'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'

definePageMeta({ layout: 'main' })

const isAssigningRole = ref(false)
const isSavingPermissions = ref(false)
const permissionEditVM = ref<PermissionMatrixEditVM | null>(null)

const { t } = useI18n()

const tabs = [
  { label: t('staff.staffList') },
  { label: t('staff.permissions') }
]

onMounted(() => {
  listStaff(useStaffGateway())
  listRoles(useRoleGateway())
  listSystemResources(useSystemResourceGateway())
})

const staffVM = computed(() => {
  return getStaffVM()
})

const rolesVM = computed(() => {
  return getRolesVM()
})

const permissionMatrixVM = computed(() => {
  return getPermissionMatrixVM()
})

watch(
  permissionMatrixVM,
  (vm) => {
    if (
      vm &&
      vm.roles.length > 0 &&
      vm.systemResources.length > 0 &&
      !vm.isLoading
    ) {
      if (!permissionEditVM.value) {
        permissionEditVM.value = permissionMatrixEditVM(
          vm.permissions,
          vm.roles
        )
      }
    }
  },
  { immediate: true }
)

const roleOptions = computed(() => {
  return rolesVM.value.items
})

const handleRoleChange = async (staffUuid: string, newRoleUuid: string) => {
  isAssigningRole.value = true
  try {
    await assignRoleToStaff(staffUuid, newRoleUuid, useStaffGateway())
  } catch (error) {
    console.error('Failed to assign role:', error)
  } finally {
    isAssigningRole.value = false
  }
}

const handlePermissionChange = (
  roleUuid: string,
  resource: string,
  hasPermission: boolean
) => {
  if (!permissionEditVM.value) {
    console.error('Permission edit VM not initialized')
    return
  }

  permissionEditVM.value.setPermission(roleUuid, resource, hasPermission)
}

const handleSavePermissions = async () => {
  if (!permissionEditVM.value) {
    console.error('Permission edit VM not initialized')
    return
  }

  if (!permissionEditVM.value.hasChanges()) {
    return
  }

  isSavingPermissions.value = true
  try {
    const changedRoles = permissionEditVM.value.getChangedRolesDto()
    const roleGateway = useRoleGateway()

    for (const roleChange of changedRoles) {
      await editRole(
        roleChange.roleUuid,
        {
          name: roleChange.roleName,
          permissions: roleChange.permissions
        },
        roleGateway
      )
    }

    permissionEditVM.value.updateOriginal()
  } catch (error) {
    console.error('Failed to save permissions:', error)
  } finally {
    isSavingPermissions.value = false
  }
}

const handleResetChanges = () => {
  if (!permissionEditVM.value) {
    return
  }
  permissionEditVM.value.reset()
}
</script>
