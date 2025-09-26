<template lang="pug">
.space-y-4
  .flex.items-center.justify-center.py-8(v-if="isLoading")
    .text-center
      .text-gray-400.mb-2
        icon.h-8.w-8.animate-spin(name="i-heroicons-arrow-path-20-solid")
      p.text-gray-600 {{ $t('common.loading') }}
  .space-y-3(v-else-if="items.length > 0")
    .flex.items-center.justify-between.py-4.border-b.border-gray-200(
      v-for="staff in items"
      :key="staff.uuid"
    )
      .flex.items-center.space-x-3
        span.text-lg.font-medium.text-gray-900 {{ staff.firstname }} {{ staff.lastname }}
      .flex.items-center.space-x-2
        ft-role-select(
          :model-value="staff.roleUuid"
          :options="roleOptions || []"
          :disabled="isAssigningRole"
          @update:model-value="$emit('roleChanged', staff.uuid, $event)"
        )
        icon.h-4.w-4.animate-spin.text-gray-400(
          v-if="isAssigningRole"
          name="i-heroicons-arrow-path-20-solid"
        )
  .flex.items-center.justify-center.py-12(v-else)
    .text-center
      .text-gray-400.mb-2
        icon.h-12.w-12(name="i-heroicons-users-20-solid")
      p.text-gray-600 {{ $t('staff.noStaff') }}
</template>

<script setup lang="ts">
interface StaffItem {
  uuid: string
  firstname: string
  lastname: string
  email: string
  roleUuid: string
  roleName: string
}

interface RoleOption {
  uuid: string
  name: string
}

defineProps<{
  items: Array<StaffItem>
  isLoading: boolean
  isAssigningRole?: boolean
  roleOptions?: Array<RoleOption>
}>()

defineEmits<{
  roleChanged: [staffUuid: string, newRoleUuid: string]
}>()
</script>
