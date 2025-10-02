# User Profile Management Specification

## Overview
Implement user profile management that retrieves profile data from API and stores it in Pinia for permission-based menu display. Focus on simplicity and robust refresh handling.

## Requirements

### Functional Requirements
1. **Profile Retrieval**: Get user profile data after Keycloak authentication
2. **State Management**: Store profile data in Pinia for application-wide access
3. **Permission Access**: Provide permission data for menu display logic
4. **Refresh Handling**: Ensure profile loads correctly after page refresh
5. **Error Handling**: Graceful handling of profile loading failures

### Non-Functional Requirements
- Follow existing hexagonal architecture patterns
- Implement TDD methodology (tests first)
- Type-safe implementation with TypeScript
- Zero warnings tolerance (linting)
- Consistent with existing codebase patterns

## Domain Model

### UserProfile Entity
```typescript
interface UserProfile {
  uuid: UUID
  email: string
  role: Role  // Reuse existing Role entity
}
```

**Rationale**: Simplified entity focusing only on essential data needed for menu permissions. Removed unnecessary `isAuthenticated` and `lastLoginAt` fields.

### API Response Adaptation
The API returns:
```json
{
    "uuid": "e577aadd-2df0-4888-9f77-b2ed98038924",
    "email": "admin@phardev.fr",
    "role": {
        "uuid": "admin",
        "name": "Admin",
        "permissions": [
            {
                "resource": "dashboard"
            },
            {
                "resource": "newsletter"
            },
            {
                "resource": "administration"
            }
        ]
    }
}
```

This maps directly to our UserProfile entity structure.

## Architecture Design

### Core Layer
- **UserProfile Entity** (`src/core/entities/userProfile.ts`)
- **UserProfileGateway Interface** (`src/core/gateways/userProfileGateway.ts`)
- **getUserProfile Use Case** (`src/core/usecases/profile/getUserProfile.ts`)

### Infrastructure Layer
- **UserProfileStore** (`src/store/userProfileStore.ts`)
- **ApiUserProfileGateway** (`src/adapters/secondary/profile-gateways/apiUserProfileGateway.ts`)
- **InMemoryUserProfileGateway** (`src/adapters/secondary/profile-gateways/inMemoryUserProfileGateway.ts`)

### Application Layer
- **Keycloak Plugin Enhancement** (`src/adapters/primary/nuxt/plugins/keycloak.client.ts`)
- **Profile Management Utilities** (`src/adapters/primary/nuxt/utils/userProfile.ts`)

## Technical Specifications

### Store Design
```typescript
interface UserProfileState {
  current: UserProfile | null
  isLoading: boolean
  error: string | null
}
```

**Rationale**: Removed `initialized` flag as it's redundant - we can determine initialization state from `current` and `isLoading` combination.

### Gateway Interface
```typescript
interface UserProfileGateway {
  getCurrentUserProfile(): Promise<UserProfile>
}
```

### Critical Refresh Handling
**Challenge**: Profile must reload after page refresh when Keycloak re-initializes.

**Solution**: 
1. Enhance Keycloak plugin to trigger profile loading on authentication (both login AND refresh)
2. Always fetch fresh profile data - no client-side persistence needed
3. Ensure menu system waits for profile data before rendering

## Implementation Strategy

### Phase 1: Domain Layer (TDD)
1. Write tests for UserProfile entity
2. Create UserProfile entity
3. Write tests for UserProfileGateway interface
4. Create UserProfileGateway interface
5. Write tests for getUserProfile use case
6. Implement getUserProfile use case

### Phase 2: Infrastructure Layer
1. Create UserProfileStore with simplified state
2. Create InMemoryUserProfileGateway for testing
3. Create ApiUserProfileGateway for production

### Phase 3: Integration Layer
1. Update Keycloak plugin for profile loading on auth + refresh
2. Create profile management utilities/composables
3. Ensure menu integration works with profile permissions

### Phase 4: Testing & Validation
1. Test refresh scenarios specifically
2. Validate menu permission system integration
3. Error handling validation
4. Run linting and type checking

## Success Criteria
- ✅ Profile loads on initial authentication
- ✅ Profile reloads correctly after page refresh  
- ✅ Store provides permission data for menu display
- ✅ Graceful error handling for profile load failures
- ✅ 100% TDD coverage
- ✅ Simple, maintainable codebase following project conventions

## Integration Points

### Menu System Integration
The profile data will be consumed by the menu system to determine which menu items to display based on user permissions. The store should provide:
- `hasPermission(resource: string): boolean` getter
- `permissions: Permission[]` getter  
- `isAuthenticated: boolean` computed from profile existence

### Keycloak Flow
```
Keycloak Authentication → Profile Loading → Store Update → Menu Rendering
```

Both initial login and page refresh must follow this flow consistently.