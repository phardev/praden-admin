<template lang="pug">
.space-y-4
  .flex.items-center.justify-center.py-8(v-if="isLoading")
    .text-center
      .text-gray-400.mb-2
        icon.h-8.w-8.animate-spin(name="i-heroicons-arrow-path-20-solid")
      p.text-gray-600 {{ $t('common.loading') }}
  .overflow-x-auto(v-else-if="systemResources.length > 0 && roles.length > 0")
    table.min-w-full.divide-y.divide-gray-200
      thead.bg-gray-50
        tr
          th.px-6.py-3.text-left.text-xs.font-medium.text-gray-500.uppercase.tracking-wider
            | {{ $t('permissions.permission') }}
          th.px-6.py-3.text-center.text-xs.font-medium.text-gray-500.uppercase.tracking-wider(
            v-for="role in roles"
            :key="role.uuid"
          )
            .flex.items-center.justify-center.space-x-2
              ft-role-badge(:role-name="role.name" :role-uuid="role.uuid")
      tbody.bg-white.divide-y.divide-gray-200
        tr(
          v-for="resource in systemResources"
          :key="resource"
          :class="{ 'bg-gray-50': systemResources.indexOf(resource) % 2 === 1 }"
        )
          td.px-6.py-4.whitespace-nowrap.text-sm.font-medium.text-gray-900
            .flex.items-center.space-x-2
              span {{ $t(`permissions.resources.${resource}`) }}
          td.px-6.py-4.whitespace-nowrap(
            v-for="role in roles"
            :key="`${resource}-${role.uuid}`"
          )
            .flex.items-center.justify-center
              ft-checkbox(
                :key="`${resource}-${role.uuid}`"
                :model-value="(permissions[role.uuid] && permissions[role.uuid][resource]) || false"
                @click="$emit('permissionChanged', role.uuid, resource, !((permissions[role.uuid] && permissions[role.uuid][resource]) || false))"
              )
  .flex.items-center.justify-center.py-12(v-else)
    .text-center
      .text-gray-400.mb-2
        icon.h-12.w-12(name="i-heroicons-shield-exclamation-20-solid")
      p.text-gray-600 {{ $t('permissions.noData') }}

  .mt-6.border-t.border-gray-200.pt-4(v-if="hasChanges && !isLoading")
    .flex.items-center.justify-between.bg-yellow-50.px-4.py-3.rounded-lg.border.border-yellow-200
      .flex.items-center.space-x-2
        icon.h-5.w-5.text-yellow-600(name="i-heroicons-exclamation-triangle-20-solid")
        span.text-sm.text-yellow-800 {{ $t('permissions.unsavedChanges') }}
      .flex.items-center.space-x-3
        ft-button(
          variant="outline"
          size="sm"
          @click="$emit('reset-changes')"
        )
          | {{ $t('permissions.cancel') }}
        ft-button(
          color="primary"
          size="sm"
          :loading="false"
          @click="$emit('saveChanges')"
        )
          | {{ $t('permissions.saveChanges') }}
</template>

<script setup lang="ts">
interface Role {
  uuid: string
  name: string
}

defineProps<{
  systemResources: Array<string>
  roles: Array<Role>
  permissions: Record<string, Record<string, boolean>>
  isLoading: boolean
  hasChanges?: boolean
}>()

defineEmits<{
  permissionChanged: [
    roleUuid: string,
    resource: string,
    hasPermission: boolean
  ]
  saveChanges: []
  'reset-changes': []
}>()
</script>
