# Role Reordering Specification

## Overview
Implement role reordering functionality following the exact same pattern as banner reordering. Enable administrators to drag and drop roles to change their display order in the role list.

## Requirements

### Functional Requirements
1. **Role Reordering**: Drag and drop roles to change their order
2. **Order Persistence**: Save role order to backend and local state
3. **Visual Feedback**: Hamburger icon to indicate draggable items
4. **Immediate Update**: Role order updates immediately in UI after drag operation
5. **Gateway Integration**: Reorder method added to RoleGateway interface
6. **State Management**: Update role store with reordered roles

### Non-Functional Requirements
- Follow hexagonal architecture patterns from banner reordering
- Implement TDD methodology (tests first)
- Type-safe implementation with TypeScript
- Zero warnings tolerance (linting)
- Use vuedraggable library (already in project from banners)

## Architecture Design

### Core Layer Extensions

#### 1. Role Entity Extension
```typescript
// Add order property to Role entity
export interface Role {
  uuid: UUID
  name: string
  permissions: Array<Permission>
  order: number  // NEW
}
```

#### 2. RoleGateway Extension
```typescript
export interface RoleGateway {
  list(): Promise<Array<Role>>
  reorder(roleUuids: Array<UUID>): Promise<Array<Role>>  // NEW
  create(dto: CreateRoleDTO): Promise<Role>
  edit(roleUuid: UUID, dto: EditRoleDTO): Promise<Role>
}
```

#### 3. New Use Case
```typescript
// src/core/usecases/roles/roles-reorder/reorderRoles.ts
export const reorderRoles = async (
  roles: Array<UUID>,
  roleGateway: RoleGateway
) => {
  const reordered = await roleGateway.reorder(roles)
  const roleStore = useRoleStore()
  roleStore.list(reordered)
}
```

### Infrastructure Layer

#### 1. InMemoryRoleGateway Enhancement
```typescript
// src/adapters/secondary/role-gateways/InMemoryRoleGateway.ts
async reorder(roleUuids: Array<UUID>): Promise<Array<Role>> {
  for (const uuid of roleUuids) {
    const i = roleUuids.indexOf(uuid)
    await this.edit(uuid, { order: i })
  }
  this.roles = this.roles.sort(sortByOrder)
  return Promise.resolve(JSON.parse(JSON.stringify(this.roles)))
}
```

#### 2. RealRoleGateway Enhancement
```typescript
// src/adapters/secondary/role-gateways/RealRoleGateway.ts
async reorder(roleUuids: Array<UUID>): Promise<Array<Role>> {
  const res = await axiosWithBearer.post(`${this.baseUrl}/roles/reorder`, {
    uuids: roleUuids
  })
  return res.data.items
}
```

### UI Layer

#### 1. FtRoleList Component Enhancement
Add draggable functionality to the existing `FtRoleList.vue` component:

```pug
// Replace the existing role list div with:
draggable(
  v-model="rolesModel"
  item-key="uuid"
)
  template(#item="{ element: role }")
    div(
      :key="role.uuid"
      class="flex items-center justify-between py-4 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    )
      .flex.items-center.space-x-4
        icon.cursor-move(name="pajamas:hamburger")
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
```

```typescript
// Add script section for drag and drop
<script setup lang="ts">
import draggable from 'vuedraggable'
import { reorderRoles } from '@core/usecases/roles/roles-reorder/reorderRoles'
import { useRoleGateway } from '../../../../../../../gateways/roleGateway'

// ... existing props and emits

const rolesModel = computed({
  get: () => props.items,
  set: (v) => {
    reorderRoles(
      v.map((r) => r.uuid),
      useRoleGateway()
    )
  }
})
</script>
```

## Implementation Strategy

### Phase 1: Domain Layer (TDD)
1. ✅ Add `order` property to Role entity
2. ✅ Create utility function `sortByOrder` for Role entity
3. ✅ Write tests for `reorderRoles` use case
4. ✅ Extend RoleGateway interface with `reorder` method
5. ✅ Implement `reorderRoles` use case with store integration

### Phase 2: Infrastructure Layer (TDD)
1. ✅ Update InMemoryRoleGateway with reorder method
2. ✅ Add test data with order properties (roles.ts)
3. ✅ Update RealRoleGateway with API call
4. ✅ Ensure EditRoleDTO includes optional order property

### Phase 3: UI Integration
1. ✅ Update FtRoleList component with draggable
2. ✅ Add hamburger icon for visual drag indication
3. ✅ Implement computed property for drag and drop
4. ✅ Test drag and drop functionality

### Phase 4: Testing & Validation
1. ✅ Comprehensive TDD coverage for reorderRoles use case
2. ✅ Test InMemoryRoleGateway reorder method
3. ✅ Manual validation of drag and drop UI
4. ✅ Code quality checks and linting validation

## File Structure
```
specs/reorder-roles.md
src/core/entities/role.ts                                    # ADD order property
src/core/gateways/roleGateway.ts                             # ADD reorder method
src/core/usecases/roles/roles-reorder/
├── reorderRoles.ts                                          # NEW
└── reorderRoles.spec.ts                                     # NEW
src/adapters/secondary/role-gateways/
├── InMemoryRoleGateway.ts                                   # UPDATE with reorder
└── RealRoleGateway.ts                                       # UPDATE with reorder
src/adapters/primary/nuxt/components/organisms/
└── FtRoleList.vue                                           # UPDATE with draggable
src/utils/testData/roles.ts                                  # UPDATE with order
```

## Test Specifications

### Test File: reorderRoles.spec.ts
Following banner pattern exactly:

```typescript
describe('Roles reorder', () => {
  let roleGateway: InMemoryRoleGateway
  let roleStore: any
  let expectedRoles: Array<Role>

  beforeEach(() => {
    setActivePinia(createPinia())
    roleGateway = new InMemoryRoleGateway(new FakeUuidGenerator())
    roleStore = useRoleStore()
    givenExistingRoles(adminRole, pharmacistRole, assistantRole)
  })

  describe('For a reorder', () => {
    beforeEach(async () => {
      expectedRoles = [
        { ...pharmacistRole, order: 0 },
        { ...adminRole, order: 1 },
        { ...assistantRole, order: 2 }
      ]
      await whenReorderRoles([pharmacistRole.uuid, adminRole.uuid, assistantRole.uuid])
    })
    it('should reorder roles in gateway', async () => {
      expect(await roleGateway.list()).toStrictEqual(expectedRoles)
    })
    it('should reorder roles in store', () => {
      expect(roleStore.items).toStrictEqual(expectedRoles)
    })
  })

  describe('For another reorder', () => {
    beforeEach(async () => {
      expectedRoles = [
        { ...assistantRole, order: 0 },
        { ...pharmacistRole, order: 1 },
        { ...adminRole, order: 2 }
      ]
      await whenReorderRoles([assistantRole.uuid, pharmacistRole.uuid, adminRole.uuid])
    })
    it('should reorder roles in gateway', async () => {
      expect(await roleGateway.list()).toStrictEqual(expectedRoles)
    })
    it('should reorder roles in store', () => {
      expect(roleStore.items).toStrictEqual(expectedRoles)
    })
  })

  const givenExistingRoles = (...roles: Array<Role>) => {
    roleGateway.feedWith(...roles)
    roleStore.items = roles
  }

  const whenReorderRoles = async (roles: Array<UUID>) => {
    await reorderRoles(roles, roleGateway)
  }
})
```

## Success Criteria
- ✅ Administrators can drag and drop roles to reorder them
- ✅ Role order persists in backend and local state
- ✅ Reordering integrates with existing role list UI
- ✅ Visual feedback with hamburger icon
- ✅ 100% TDD coverage for reorder use case
- ✅ Zero linting warnings and type safety maintained
- ✅ Follows exact same pattern as banner reordering

## Integration Points
- **Role Store**: Update list action to handle reordered roles
- **Role Gateway**: Add reorder method to both InMemory and Real implementations
- **FtRoleList Component**: Add vuedraggable integration
- **Backend API**: POST `/roles/reorder` endpoint with `{uuids: Array<UUID>}`

## Business Rules
1. **Order Persistence**: Role order must persist across sessions
2. **Order Uniqueness**: Each role has a unique order value (0-indexed)
3. **Automatic Reordering**: When a role is moved, all roles are reassigned order values
4. **List Sorting**: Roles always display sorted by their order property

## Test Data Updates
```typescript
// src/utils/testData/roles.ts
export const adminRole: Role = {
  uuid: 'role-admin',
  name: 'Administrateur',
  order: 0,  // NEW
  permissions: [...]
}

export const pharmacistRole: Role = {
  uuid: 'role-pharmacist',
  name: 'Pharmacien',
  order: 1,  // NEW
  permissions: [...]
}

export const assistantRole: Role = {
  uuid: 'role-assistant',
  name: 'Assistant',
  order: 2,  // NEW
  permissions: [...]
}
```

## API Specification

### Backend Endpoint
```
POST /roles/reorder
Content-Type: application/json

Request Body:
{
  "uuids": ["role-uuid-1", "role-uuid-2", "role-uuid-3"]
}

Response:
{
  "items": [
    { "uuid": "role-uuid-1", "name": "Role 1", "order": 0, "permissions": [...] },
    { "uuid": "role-uuid-2", "name": "Role 2", "order": 1, "permissions": [...] },
    { "uuid": "role-uuid-3", "name": "Role 3", "order": 2, "permissions": [...] }
  ]
}
```

## Dependencies
- **vuedraggable**: Already installed (used for banners)
- **@headlessui/vue**: Already installed
- **pinia**: Already installed

## Notes
- This specification mirrors the banner reordering implementation exactly
- The `order` property should be added to all existing roles with default sequential values
- Database migration required to add `order` column to roles table
- Consider adding API endpoint for bulk order updates if performance becomes an issue

---

**Based on**: Banner reordering implementation (`src/core/usecases/banners/banners-reorder/`)
