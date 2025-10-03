# User Permissions Management Specification

## Overview
Implement permission-based UI visibility using a dedicated Permissions View Model that acts as a cross-cutting concern. This follows the backend middleware pattern where permissions are handled at application boundaries, keeping domain logic pure.

## Requirements

### Functional Requirements
1. **Resource Access Control**: Hide/show UI elements based on user permissions
2. **Navigation Filtering**: Filter menu items based on user access rights
3. **Page Content Control**: Control visibility of dashboard widgets, stats, and action buttons
4. **Security by Default**: Hide all elements by default, show only with explicit permission
5. **Reactive Updates**: UI updates when user permissions change

### Non-Functional Requirements
- Follow hexagonal architecture patterns
- Implement TDD methodology
- Keep domain View Models pure (no permission logic)
- Use single Permissions VM as cross-cutting concern
- Maintain existing code quality standards
- Zero comments in code

## Architecture Design

### Permission Model
Based on API response structure with three permission resources:
- `dashboard` - Access to statistics, analytics, dashboard features
- `newsletter` - Access to newsletter management and subscriptions  
- `administration` - Access to staff management, system resources, admin tools

### Core Pattern
```
Component → Permissions VM (resource access) + Domain VM (business data)
```

### Permissions View Model
Single responsibility: Determine what user can access based on UserProfile permissions.

```typescript
export const getPermissionsVM = () => {
  const userProfileStore = useUserProfileStore()
  
  return {
    canAccessDashboard: userProfileStore.hasPermission('dashboard'),
    canAccessNewsletter: userProfileStore.hasPermission('newsletter'),
    canAccessAdministration: userProfileStore.hasPermission('administration')
  }
}
```

### Component Integration Pattern
```vue
<template>
  <div v-if="permissions.canAccessDashboard">
    <DashboardStats :data="dashboard.statsCards" />
  </div>
</template>

<script setup>
const permissions = computed(() => getPermissionsVM())
const dashboard = computed(() => getDashboardVM())
</script>
```

## Implementation Strategy

### Phase 1: Permissions VM Foundation
1. Create comprehensive test scenarios for all permission combinations
2. Implement Permissions VM with TDD approach
3. Validate all edge cases (no permissions, null profile, etc.)

### Phase 2: Navigation System Integration
1. Update Navigation Menu VM to filter based on permissions
2. Map menu sections to required permissions
3. Hide sections/links without proper access
4. Update navigation components to use filtered menu

### Phase 3: Page Content Integration
1. Update Index page with permission-based conditional rendering
2. Update Dashboard page with access control
3. Maintain existing domain VM functionality
4. Keep domain logic separated from permission logic

### Phase 4: Quality Assurance
1. Comprehensive testing with different permission scenarios
2. Manual validation of UI behavior
3. Code quality checks and linting
4. Performance validation

## Technical Specifications

### File Structure
```
src/adapters/primary/view-models/permissions/
├── getPermissionsVM.ts
└── getPermissionsVM.spec.ts
```

### Permission Resource Mapping
- **Dashboard section**: `dashboard` permission
- **Newsletter features**: `newsletter` permission
- **Admin sections (Staff, Research)**: `administration` permission
- **Catalog items**: Define default behavior or logical groupings

### Component Updates Required
- `NavigationMenu.vue` - Filter menu items
- `pages/index.vue` - Dashboard cards and stats section
- `pages/dashboard/index.vue` - Dashboard access control
- `LeftSideMenu.vue` components - Menu visibility

### Test Coverage Requirements
- All permission combinations (none, single, multiple, all)
- Edge cases (null profile, no permissions)
- Reactive updates when permissions change
- Navigation filtering behavior
- Page access control validation

## Security Considerations

### Hide by Default Principle
All UI elements hidden by default without explicit permission check. No element should be visible without proper authorization.

### Permission Validation
- Permissions checked at View Model layer, not in components
- No permission logic scattered across domain VMs
- Single source of truth for access control

### Error Handling
- Graceful handling when user profile not loaded
- Safe defaults when permission data unavailable
- No exposure of unauthorized functionality

## Success Criteria
- ✅ Single Permissions VM handles all resource access
- ✅ Navigation filters correctly based on permissions
- ✅ Page content respects user access rights
- ✅ Domain VMs remain pure (no permission logic)
- ✅ Components use clean separation pattern
- ✅ All tests passing with comprehensive coverage
- ✅ Security by default maintained throughout
- ✅ Code quality standards preserved
- ✅ Ready for future permission additions

## Integration Points

### UserProfile System Integration
Leverages existing UserProfile system with `hasPermission(resource: string)` method from UserProfileStore.

### Menu System Integration
Filters existing navigation menu structure based on permission requirements without modifying menu data structure.

### Dashboard Integration
Controls visibility of dashboard widgets, statistics, and admin features while maintaining existing data fetching and display logic.

## Future Extensibility

### Adding New Permissions
1. Add new permission resource to API
2. Add corresponding getter to Permissions VM
3. Update components with new conditional rendering
4. Add test coverage for new permission

### Permission Granularity
Current implementation focuses on resource-level permissions. Can be extended for action-level permissions if needed while maintaining the same architectural pattern.