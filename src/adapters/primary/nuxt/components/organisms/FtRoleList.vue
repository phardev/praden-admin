<template lang="pug">
.space-y-4
  .flex.items-center.justify-between
    h2.text-lg.font-medium.text-gray-900 {{ $t('roles.management.title') }}
    ft-button(
      icon="heroicons:plus"
      @click="$emit('createRole')"
    ) {{ $t('roles.management.create') }}

  .flex.items-center.justify-center.py-8(v-if="isLoading")
    .text-center
      .text-gray-400.mb-2
        icon.h-8.w-8.animate-spin(name="i-heroicons-arrow-path-20-solid")
      p.text-gray-600 {{ $t('common.loading') }}

  .space-y-3(v-else-if="items.length > 0")
    draggable(
      v-model="rolesModel"
      item-key="uuid"
    )
      template(#item="{ element: role }")
        div(
          :key="role.uuid"
          class="flex items-center justify-between py-4 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-3"
        )
          .flex.items-center.space-x-4
            icon.cursor-move.text-gray-400(name="pajamas:hamburger")
            .flex.flex-col
              span.text-lg.font-medium.text-gray-900 {{ role.name }}
              span.text-sm.text-gray-500
                | {{ role.permissionCount }}
                | {{ role.permissionCount === 1 ? $t('roles.permission.singular') : $t('roles.permission.plural') }}

          .flex.items-center.space-x-2
            ft-button(
              variant="outline"
              size="sm"
              icon="heroicons:pencil"
              @click="$emit('editRole', role.uuid)"
            ) {{ $t('common.edit') }}

  .flex.items-center.justify-center.py-12(v-else)
    .text-center
      .text-gray-400.mb-2
        icon.h-12.w-12(name="heroicons:shield-check")
      h3.text-lg.font-medium.text-gray-900.mb-2 {{ $t('roles.management.noRoles.title') }}
      p.text-gray-600.mb-4 {{ $t('roles.management.noRoles.description') }}
      ft-button(
        icon="heroicons:plus"
        @click="$emit('createRole')"
      ) {{ $t('roles.management.create') }}
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { reorderRoles } from '@core/usecases/roles/roles-reorder/reorderRoles'
import { useRoleGateway } from '~/gateways/roleGateway'

interface RoleItem {
  uuid: string
  name: string
  permissionCount: number
}

const props = defineProps<{
  items: Array<RoleItem>
  isLoading: boolean
}>()

defineEmits<{
  createRole: []
  editRole: [roleUuid: string]
}>()

const rolesModel = computed({
  get: () => props.items,
  set: (v: Array<RoleItem>) => {
    reorderRoles(
      v.map((r: RoleItem) => r.uuid),
      useRoleGateway()
    )
  }
})
</script>
