# Role Management Specification

## Overview
Implement comprehensive role creation and editing functionality following the existing hexagonal architecture patterns. Enable administrators to create new roles and edit existing ones with full permission management capabilities.

## Requirements

### Functional Requirements
1. **Role Creation**: Create new roles with name and permission assignments
2. **Role Editing**: Modify existing role names and permissions
3. **Permission Management**: Assign/remove permissions from system resources (17 available)
4. **Form Validation**: Ensure role names are unique and required
5. **UI Integration**: Add role management to staff section with dedicated pages
6. **State Management**: Update role store and refresh permission matrix

### Non-Functional Requirements
- Follow hexagonal architecture patterns
- Implement TDD methodology (tests first)
- Type-safe implementation with TypeScript
- Zero warnings tolerance (linting)
- Consistent with existing form patterns (categories, banners, etc.)

## Architecture Design

### Core Layer Extensions
1. **CreateRoleDTO** type for role creation
2. **createRole** use case with gateway integration
3. **RoleGateway** extension with create() method
4. **Form validation** and business rules

### View Models Layer
1. **RoleFormCreateVM** - Role creation form management
2. **RoleFormEditVM** - Role editing form management  
3. **RoleFormVM** base class with shared functionality
4. **Form field management** with permission selection

### UI Layer
1. **RoleForm** component for create/edit forms
2. **Role creation page** (/staff/roles/new)
3. **Role editing page** (/staff/roles/edit/[uuid])
4. **Navigation integration** in staff section

### Infrastructure Layer
1. **InMemoryRoleGateway** enhancement for testing
2. **RealRoleGateway** create method implementation
3. **Role store** enhancement for creation/editing

## Technical Specifications

### Domain Extensions
```typescript
// Role creation DTO
export type CreateRoleDTO = Pick<Role, 'name'> & {
  permissions: Array<Permission>
}

// Gateway extension
interface RoleGateway {
  list(): Promise<Array<Role>>
  create(dto: CreateRoleDTO): Promise<Role>
  edit(roleUuid: UUID, dto: EditRoleDTO): Promise<Role>
}
```

### Form Structure
- **Name field**: Required text input with uniqueness validation
- **Permissions section**: Checkboxes for each system resource
- **Form actions**: Save, Cancel with proper navigation
- **Validation rules**: Name required, at least one permission selected

### Page Structure
- **Create page**: `/staff/roles/new` with form component
- **Edit page**: `/staff/roles/edit/[uuid]` with pre-populated form
- **Integration**: Links from staff page to manage roles
- **Navigation**: Breadcrumbs and proper routing

## Implementation Strategy

### Phase 1: Domain Layer (TDD)
1. Write tests for CreateRoleDTO and createRole use case
2. Extend RoleGateway interface with create method
3. Implement createRole use case with store integration
4. Create InMemoryRoleGateway enhancement for testing

### Phase 2: View Models Layer (TDD)
1. Create RoleFormVM base class with shared functionality
2. Implement RoleFormCreateVM with form management
3. Implement RoleFormEditVM with existing role loading
4. Add comprehensive test coverage for all view models

### Phase 3: Components & Pages
1. Create RoleForm component with permission checkboxes
2. Build role creation page with form integration
3. Build role editing page with data loading
4. Add navigation links and breadcrumbs

### Phase 4: Infrastructure & Integration
1. Enhance RealRoleGateway with create functionality
2. Update role store with creation capabilities
3. Integrate with existing staff page (add role management tab)
4. Update permission matrix to reflect new roles

### Phase 5: Testing & Validation
1. Comprehensive TDD coverage for all components
2. Integration testing with existing permission system
3. Manual validation of complete workflow
4. Code quality checks and linting validation

## File Structure
```
specs/role-management.md
src/core/usecases/roles/role-creation/
├── createRole.ts
└── createRole.spec.ts
src/adapters/primary/view-models/roles/role-form/
├── roleFormVM.ts
├── roleFormCreateVM.ts
├── roleFormCreateVM.spec.ts
├── roleFormEditVM.ts
└── roleFormEditVM.spec.ts
src/adapters/primary/nuxt/components/organisms/
└── RoleForm.vue
src/adapters/primary/nuxt/pages/staff/roles/
├── new.vue
└── edit/[uuid].vue
```

## Success Criteria
- ✅ Administrators can create new roles with selected permissions
- ✅ Existing roles can be edited (name and permissions)
- ✅ Form validation prevents invalid role creation
- ✅ Role creation/editing integrates with existing permission matrix
- ✅ UI follows existing design patterns and accessibility standards
- ✅ 100% TDD coverage for all new business logic
- ✅ Zero linting warnings and type safety maintained
- ✅ Performance remains optimal with additional functionality

## Integration Points
- **Staff Management**: Add role management tab to existing staff page
- **Permission Matrix**: Refresh matrix after role changes
- **Navigation**: Update navigation to include role management
- **Gateway System**: Enhance existing role gateway with create functionality
- **Store System**: Extend role store for creation and editing operations

## Domain Model Extensions

### Role Creation DTO
```typescript
export type CreateRoleDTO = Pick<Role, 'name'> & {
  permissions: Array<Permission>
}
```

### Role Gateway Extension
```typescript
export interface RoleGateway {
  list(): Promise<Array<Role>>
  create(dto: CreateRoleDTO): Promise<Role>
  edit(roleUuid: UUID, dto: EditRoleDTO): Promise<Role>
}
```

### Business Rules
1. **Role Name Uniqueness**: Role names must be unique across the system
2. **Required Permissions**: Roles must have at least one permission assigned
3. **Valid Permissions**: Only permissions from available system resources are allowed
4. **Role Name Validation**: Role names must be non-empty and trimmed

### Error Handling
- **RoleNameAlreadyExistsError**: When attempting to create role with existing name
- **InvalidRolePermissionsError**: When role has no permissions or invalid permissions
- **RoleDoesNotExistError**: When attempting to edit non-existent role

### System Resources Available
The system supports 17 permission resources:
- DASHBOARD, REMINDERS, PRODUCTS, LABORATORIES, CATEGORIES
- PROMOTIONS, PROMOTION_CODES, CUSTOMERS, NEWSLETTER, SUPPORT  
- DELIVERIES, PREPARATIONS, ORDERS, BANNERS, STAFF, RESEARCH

## Testing Strategy

### Unit Tests Required
1. **createRole use case tests** - Various scenarios including success and error cases
2. **RoleFormCreateVM tests** - Form behavior, validation, DTO generation
3. **RoleFormEditVM tests** - Loading existing data, editing behavior
4. **Gateway tests** - InMemory implementation testing
5. **Store integration tests** - Role creation and editing in store

### Test Scenarios
- Create role with valid name and permissions
- Attempt to create role with duplicate name
- Create role with no permissions (should fail)
- Create role with invalid permissions (should fail)
- Edit existing role name and permissions
- Handle role creation/editing API failures gracefully

### Test Data Requirements
- Sample roles for testing
- Mock permission resources
- Various user scenarios and edge cases