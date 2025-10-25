# Shop Home Management - Implementation Plan

## Problem Statement

The e-commerce admin application needs comprehensive management functionality for four key elements displayed on the shop's home page:
1. **Announcement Bar** - Single promotional message with optional date scheduling
2. **Category Order** - Visual ordering of product categories
3. **Pharmacist Selection** - Featured products curated by pharmacist
4. **Emergency Pharmacy** - On-duty pharmacy information with scheduling

This functionality must follow hexagonal architecture, TDD methodology, and maintain zero warnings tolerance while being consistent with existing patterns (banners, roles, staff).

## Objectives

- Implement complete CRUD operations for all four shop home features
- Follow strict TDD methodology with tests written before implementation
- Maintain hexagonal architecture separation (Core → Adapters → UI)
- Achieve 100% test coverage for use cases and view models
- Ensure zero linting warnings and type safety
- Provide intuitive UI with drag-drop reordering capabilities
- Integrate seamlessly with existing navigation and i18n systems

## Technical Approach

### Architecture Overview

```
src/
├── core/                                  # Domain layer (pure business logic)
│   ├── entities/
│   │   ├── announcementBar.ts            # New entity
│   │   ├── pharmacistSelection.ts        # New entity
│   │   ├── emergencyPharmacy.ts          # New entity
│   │   └── category.ts                   # Extended with order field
│   ├── gateways/
│   │   ├── announcementBarGateway.ts     # New gateway interface
│   │   ├── pharmacistSelectionGateway.ts # New gateway interface
│   │   ├── emergencyPharmacyGateway.ts   # New gateway interface
│   │   └── categoryGateway.ts            # Extended with reorder method
│   └── usecases/
│       ├── announcement-bar/
│       │   ├── getAnnouncementBar.ts
│       │   ├── getAnnouncementBar.spec.ts
│       │   ├── updateAnnouncementBar.ts
│       │   └── updateAnnouncementBar.spec.ts
│       ├── categories/
│       │   ├── reorderCategories.ts
│       │   └── reorderCategories.spec.ts
│       ├── pharmacist-selection/
│       │   ├── getPharmacistSelection.ts
│       │   ├── getPharmacistSelection.spec.ts
│       │   ├── updatePharmacistSelection.ts
│       │   └── updatePharmacistSelection.spec.ts
│       └── emergency-pharmacies/
│           ├── listEmergencyPharmacies.ts
│           ├── listEmergencyPharmacies.spec.ts
│           ├── createEmergencyPharmacy.ts
│           ├── createEmergencyPharmacy.spec.ts
│           ├── editEmergencyPharmacy.ts
│           ├── editEmergencyPharmacy.spec.ts
│           ├── deleteEmergencyPharmacy.ts
│           ├── deleteEmergencyPharmacy.spec.ts
│           ├── getEmergencyPharmacy.ts
│           └── getEmergencyPharmacy.spec.ts
├── adapters/
│   ├── secondary/
│   │   ├── gateways/
│   │   │   ├── real/
│   │   │   │   ├── realAnnouncementBarGateway.ts
│   │   │   │   ├── realPharmacistSelectionGateway.ts
│   │   │   │   ├── realEmergencyPharmacyGateway.ts
│   │   │   │   └── realCategoryGateway.ts (updated)
│   │   │   └── inMemory/
│   │   │       ├── inMemoryAnnouncementBarGateway.ts
│   │   │       ├── inMemoryPharmacistSelectionGateway.ts
│   │   │       ├── inMemoryEmergencyPharmacyGateway.ts
│   │   │       └── inMemoryCategoryGateway.ts (updated)
│   │   └── store/
│   │       ├── announcementBarStore.ts
│   │       ├── pharmacistSelectionStore.ts
│   │       ├── emergencyPharmacyStore.ts
│   │       └── categoryStore.ts (updated)
│   └── primary/
│       ├── view-models/
│       │   ├── announcement-bar/
│       │   │   ├── getAnnouncementBarVM.ts
│       │   │   ├── getAnnouncementBarVM.spec.ts
│       │   │   ├── announcementBarFormVM.ts
│       │   │   └── announcementBarFormVM.spec.ts
│       │   ├── categories/
│       │   │   ├── reorderCategoriesVM.ts
│       │   │   └── reorderCategoriesVM.spec.ts
│       │   ├── pharmacist-selection/
│       │   │   ├── getPharmacistSelectionVM.ts
│       │   │   ├── getPharmacistSelectionVM.spec.ts
│       │   │   ├── pharmacistSelectionVM.ts
│       │   │   └── pharmacistSelectionVM.spec.ts
│       │   └── emergency-pharmacies/
│       │       ├── getEmergencyPharmaciesVM.ts
│       │       ├── getEmergencyPharmaciesVM.spec.ts
│       │       ├── emergencyPharmacyFormCreateVM.ts
│       │       ├── emergencyPharmacyFormCreateVM.spec.ts
│       │       ├── emergencyPharmacyFormEditVM.ts
│       │       ├── emergencyPharmacyFormEditVM.spec.ts
│       │       ├── emergencyPharmacyFormGetVM.ts
│       │       └── emergencyPharmacyFormGetVM.spec.ts
│       └── nuxt/
│           ├── pages/
│           │   └── shop-management/
│           │       ├── index.vue
│           │       ├── announcement-bar.vue
│           │       ├── category-order.vue
│           │       ├── pharmacist-selection.vue
│           │       └── emergency-pharmacies/
│           │           ├── index.vue
│           │           ├── new.vue
│           │           └── edit/[uuid].vue
│           └── components/
│               ├── organisms/
│               │   ├── AnnouncementBarForm.vue
│               │   ├── CategoryOrderList.vue
│               │   ├── PharmacistSelectionManager.vue
│               │   ├── EmergencyPharmacyForm.vue
│               │   └── EmergencyPharmaciesList.vue
│               └── molecules/
│                   ├── CategoryOrderItem.vue
│                   ├── PharmacistSelectionItem.vue
│                   └── EmergencyPharmacyCard.vue
└── utils/
    └── testData/
        ├── announcementBar.ts
        ├── pharmacistSelection.ts
        └── emergencyPharmacy.ts
```

### Key Technical Decisions

1. **Single Announcement vs Multiple**: Unlike banners, only one announcement bar exists (no list management needed)
2. **Pharmacist Selection Storage**: Store only product UUIDs; backend resolves full product data
3. **Category Ordering**: Add `order: number` field to existing Category entity (follows Banner pattern)
4. **Emergency Pharmacy Reusability**: Pharmacies can be assigned to multiple dates; backend filters by active dates
5. **Date Handling**: Always inject `dateProvider` gateway; never use `Date.now()` directly
6. **Testing Strategy**: One expect per test, compare full objects, use InMemory gateways (no mocks)
7. **Code Clarity**: No comments in code; extract functions with descriptive names instead

## Implementation Guide

### Phase 1: Core Layer - Entities & Gateways (TDD)

#### Step 1.1: AnnouncementBar Entity

**Test File**: `src/core/entities/announcementBar.spec.ts`

```typescript
// Test cases:
// 1. isAnnouncementBarStarted returns false when startDate is in future
// 2. isAnnouncementBarStarted returns true when startDate is in past
// 3. isAnnouncementBarStarted returns true when startDate is undefined
// 4. isAnnouncementBarEnded returns false when endDate is in future
// 5. isAnnouncementBarEnded returns true when endDate is in past
// 6. isAnnouncementBarEnded returns false when endDate is undefined
// 7. isAnnouncementBarInProgress returns true when started and not ended
// 8. isAnnouncementBarInProgress returns false when not started
// 9. isAnnouncementBarInProgress returns false when ended
```

**Implementation File**: `src/core/entities/announcementBar.ts`

```typescript
export interface AnnouncementBar {
  uuid: UUID
  text: string
  isActive: boolean
  startDate?: Timestamp
  endDate?: Timestamp
}

export const isAnnouncementBarStarted = (bar: AnnouncementBar, now: Timestamp): boolean => {
  // Implementation after tests
}

export const isAnnouncementBarEnded = (bar: AnnouncementBar, now: Timestamp): boolean => {
  // Implementation after tests
}

export const isAnnouncementBarInProgress = (bar: AnnouncementBar, now: Timestamp): boolean => {
  // Implementation after tests
}
```

**TDD Cycle**:
1. Write test for `isAnnouncementBarStarted` with future date → RED
2. Implement minimal code to pass → GREEN
3. Refactor if needed → GREEN
4. Repeat for remaining functions

#### Step 1.2: PharmacistSelection Entity

**File**: `src/core/entities/pharmacistSelection.ts`

```typescript
export interface PharmacistSelection {
  productUuids: Array<UUID>
}
```

No helper functions needed; this is a simple data structure.

#### Step 1.3: EmergencyPharmacy Entity

**File**: `src/core/entities/emergencyPharmacy.ts`

```typescript
export interface EmergencyPharmacy {
  uuid: UUID
  name: string
  address: string
  phone: string
  date: Timestamp
  isActive: boolean
}
```

No helper functions needed initially; add if validation logic emerges during use case implementation.

#### Step 1.4: Category Entity Extension

**File**: `src/core/entities/category.ts` (existing file)

Add field:
```typescript
export interface Category {
  // ... existing fields
  order: number
}
```

Update existing test file to verify order field presence.

#### Step 1.5: Gateway Interfaces

**Files**:
- `src/core/gateways/announcementBarGateway.ts`
- `src/core/gateways/pharmacistSelectionGateway.ts`
- `src/core/gateways/emergencyPharmacyGateway.ts`
- `src/core/gateways/categoryGateway.ts` (extend existing)

Define interfaces as per specification. No tests needed for interfaces.

**Verification**: Run `pnpm ts:check` to ensure no TypeScript errors.

### Phase 2: Use Cases (TDD - Red → Green → Refactor)

#### Step 2.1: AnnouncementBar Use Cases

**Use Case 1: getAnnouncementBar**

1. Write test file: `src/core/usecases/announcement-bar/getAnnouncementBar.spec.ts`
   - Test: Successfully retrieves announcement bar from gateway
   - Test: Stores announcement bar in store

2. Run tests: `TZ=UTC pnpm test run src/core/usecases/announcement-bar/getAnnouncementBar.spec.ts`
   - Expected: RED (use case doesn't exist)

3. Implement: `src/core/usecases/announcement-bar/getAnnouncementBar.ts`
   - Minimal implementation to pass tests

4. Run tests again: Expected GREEN

5. Refactor if needed, ensure tests stay GREEN

**Use Case 2: updateAnnouncementBar**

1. Write test file: `src/core/usecases/announcement-bar/updateAnnouncementBar.spec.ts`
   - Test: Updates announcement bar via gateway
   - Test: Validates text is required
   - Test: Stores updated announcement bar in store
   - Test: Handles startDate and endDate correctly

2. Run tests: Expected RED

3. Implement: `src/core/usecases/announcement-bar/updateAnnouncementBar.ts`

4. Run tests: Expected GREEN

5. Refactor, verify GREEN

**Verification Command**: `TZ=UTC pnpm test src/core/usecases/announcement-bar/`

#### Step 2.2: Category Reorder Use Case

**Use Case: reorderCategories**

1. Write test file: `src/core/usecases/categories/reorderCategories.spec.ts`
   - Test: Successfully reorders categories via gateway
   - Test: Updates categoryStore with new order
   - Test: Preserves all category data except order

2. Run tests: `TZ=UTC pnpm test run src/core/usecases/categories/reorderCategories.spec.ts`
   - Expected: RED

3. Implement: `src/core/usecases/categories/reorderCategories.ts`
   - Follow `reorderBanners` pattern from existing codebase

4. Run tests: Expected GREEN

5. Refactor, verify GREEN

#### Step 2.3: PharmacistSelection Use Cases

**Use Case 1: getPharmacistSelection**

1. Write test file: `src/core/usecases/pharmacist-selection/getPharmacistSelection.spec.ts`
   - Test: Retrieves product UUIDs from gateway
   - Test: Stores selection in store

2. Run tests: Expected RED

3. Implement: `src/core/usecases/pharmacist-selection/getPharmacistSelection.ts`

4. Run tests: Expected GREEN

5. Refactor, verify GREEN

**Use Case 2: updatePharmacistSelection**

1. Write test file: `src/core/usecases/pharmacist-selection/updatePharmacistSelection.spec.ts`
   - Test: Updates product UUIDs via gateway
   - Test: Stores updated selection in store
   - Test: Preserves UUID order

2. Run tests: Expected RED

3. Implement: `src/core/usecases/pharmacist-selection/updatePharmacistSelection.ts`

4. Run tests: Expected GREEN

5. Refactor, verify GREEN

**Verification Command**: `TZ=UTC pnpm test src/core/usecases/pharmacist-selection/`

#### Step 2.4: EmergencyPharmacy Use Cases

**Use Case 1: listEmergencyPharmacies**

1. Write test: `src/core/usecases/emergency-pharmacies/listEmergencyPharmacies.spec.ts`
   - Test: Retrieves all emergency pharmacies from gateway
   - Test: Stores pharmacies in store

2. Run test: Expected RED

3. Implement: `src/core/usecases/emergency-pharmacies/listEmergencyPharmacies.ts`

4. Run test: Expected GREEN

**Use Case 2: createEmergencyPharmacy**

1. Write test: `src/core/usecases/emergency-pharmacies/createEmergencyPharmacy.spec.ts`
   - Test: Creates pharmacy with required fields
   - Test: Validates name is required
   - Test: Validates address is required
   - Test: Validates phone is required
   - Test: Validates date is required
   - Test: Adds created pharmacy to store

2. Run tests: Expected RED

3. Implement: `src/core/usecases/emergency-pharmacies/createEmergencyPharmacy.ts`

4. Run tests: Expected GREEN

**Use Case 3: editEmergencyPharmacy**

1. Write test: `src/core/usecases/emergency-pharmacies/editEmergencyPharmacy.spec.ts`
   - Test: Updates existing pharmacy
   - Test: Validates required fields
   - Test: Updates pharmacy in store

2. Run tests: Expected RED

3. Implement: `src/core/usecases/emergency-pharmacies/editEmergencyPharmacy.ts`

4. Run tests: Expected GREEN

**Use Case 4: deleteEmergencyPharmacy**

1. Write test: `src/core/usecases/emergency-pharmacies/deleteEmergencyPharmacy.spec.ts`
   - Test: Deletes pharmacy via gateway
   - Test: Removes pharmacy from store

2. Run test: Expected RED

3. Implement: `src/core/usecases/emergency-pharmacies/deleteEmergencyPharmacy.ts`

4. Run test: Expected GREEN

**Use Case 5: getEmergencyPharmacy**

1. Write test: `src/core/usecases/emergency-pharmacies/getEmergencyPharmacy.spec.ts`
   - Test: Retrieves single pharmacy by UUID

2. Run test: Expected RED

3. Implement: `src/core/usecases/emergency-pharmacies/getEmergencyPharmacy.ts`

4. Run test: Expected GREEN

**Verification Command**: `TZ=UTC pnpm test src/core/usecases/emergency-pharmacies/`

**Phase 2 Completion Check**:
```bash
TZ=UTC pnpm test src/core/usecases/
```
All tests should be GREEN.

### Phase 3: Adapters Layer

#### Step 3.1: Test Data Utilities

**File**: `src/utils/testData/announcementBar.ts`
```typescript
export const createAnnouncementBarForTest = (overrides?: Partial<AnnouncementBar>): AnnouncementBar => {
  // Create realistic test data
}
```

**File**: `src/utils/testData/pharmacistSelection.ts`
```typescript
export const createPharmacistSelectionForTest = (overrides?: Partial<PharmacistSelection>): PharmacistSelection => {
  // Create realistic test data
}
```

**File**: `src/utils/testData/emergencyPharmacy.ts`
```typescript
export const createEmergencyPharmacyForTest = (overrides?: Partial<EmergencyPharmacy>): EmergencyPharmacy => {
  // Create realistic test data
}
```

#### Step 3.2: InMemory Gateways

**AnnouncementBar**:
- File: `src/adapters/secondary/gateways/inMemory/inMemoryAnnouncementBarGateway.ts`
- Implementation: Single announcement bar storage (not array)
- Pattern: Follow existing InMemory gateway patterns

**PharmacistSelection**:
- File: `src/adapters/secondary/gateways/inMemory/inMemoryPharmacistSelectionGateway.ts`
- Implementation: Store array of product UUIDs

**EmergencyPharmacy**:
- File: `src/adapters/secondary/gateways/inMemory/inMemoryEmergencyPharmacyGateway.ts`
- Implementation: Array-based storage with UUID lookup

**Category Extension**:
- File: `src/adapters/secondary/gateways/inMemory/inMemoryCategoryGateway.ts` (existing)
- Update: Add `reorder` method implementation

**Verification**: Use cases should already pass with InMemory gateways (they were tested in Phase 2).

#### Step 3.3: Real Gateways (API Integration)

**Research Phase**: Before implementation, examine existing Real gateways to understand:
- HTTP client setup
- Error handling patterns
- Response transformation
- Authentication headers

**AnnouncementBar**:
- File: `src/adapters/secondary/gateways/real/realAnnouncementBarGateway.ts`
- Endpoints:
  - GET `/shop-management/announcement-bar`
  - PUT `/shop-management/announcement-bar`

**PharmacistSelection**:
- File: `src/adapters/secondary/gateways/real/realPharmacistSelectionGateway.ts`
- Endpoints:
  - GET `/products/selection`
  - PUT `/products/selection`

**EmergencyPharmacy**:
- File: `src/adapters/secondary/gateways/real/realEmergencyPharmacyGateway.ts`
- Endpoints:
  - GET `/emergency-pharmacies`
  - POST `/emergency-pharmacies`
  - PUT `/emergency-pharmacies/:uuid`
  - DELETE `/emergency-pharmacies/:uuid`
  - GET `/emergency-pharmacies/:uuid`

**Category Extension**:
- File: `src/adapters/secondary/gateways/real/realCategoryGateway.ts` (existing)
- Add endpoint: PUT `/categories/reorder`

**Testing Strategy**: Manual testing with real backend or integration tests (out of scope for TDD unit tests).

#### Step 3.4: Pinia Stores

**AnnouncementBar Store**:
- File: `src/store/announcementBarStore.ts`
- State: Single `announcementBar: AnnouncementBar | null`
- Actions: `setAnnouncementBar`, `clearAnnouncementBar`

**PharmacistSelection Store**:
- File: `src/store/pharmacistSelectionStore.ts`
- State: `productUuids: Array<UUID>`
- Actions: `setPharmacistSelection`, `clearPharmacistSelection`

**EmergencyPharmacy Store**:
- File: `src/store/emergencyPharmacyStore.ts`
- State: `emergencyPharmacies: Array<EmergencyPharmacy>`
- Actions: `setEmergencyPharmacies`, `addEmergencyPharmacy`, `updateEmergencyPharmacy`, `removeEmergencyPharmacy`

**Category Store Extension**:
- File: `src/store/categoryStore.ts` (existing)
- Update: Ensure categories include `order` field, add `updateCategoryOrder` action if needed

**Pattern**: Follow existing store patterns (e.g., bannerStore, roleStore).

### Phase 4: View Models (TDD - Red → Green → Refactor)

#### Step 4.1: AnnouncementBar View Models

**View Model 1: getAnnouncementBarVM**

1. Write test: `src/adapters/primary/view-models/announcement-bar/getAnnouncementBarVM.spec.ts`
   - Test: Transforms AnnouncementBar entity to UI-friendly format
   - Test: Includes computed `isInProgress` field
   - Test: Formats dates correctly

2. Run test: Expected RED

3. Implement: `src/adapters/primary/view-models/announcement-bar/getAnnouncementBarVM.ts`

4. Run test: Expected GREEN

5. Refactor, verify GREEN

**View Model 2: announcementBarFormVM**

1. Write test: `src/adapters/primary/view-models/announcement-bar/announcementBarFormVM.spec.ts`
   - Test: Initializes form state from AnnouncementBar entity
   - Test: Validates required text field
   - Test: Handles form submission
   - Test: Updates announcement bar via use case
   - Test: Shows success/error states

2. Run tests: Expected RED

3. Implement: `src/adapters/primary/view-models/announcement-bar/announcementBarFormVM.ts`

4. Run tests: Expected GREEN

5. Refactor, verify GREEN

**Verification Command**: `TZ=UTC pnpm test src/adapters/primary/view-models/announcement-bar/`

#### Step 4.2: Category Order View Models

**View Model: reorderCategoriesVM**

1. Write test: `src/adapters/primary/view-models/categories/reorderCategoriesVM.spec.ts`
   - Test: Handles drag-drop state
   - Test: Calls reorderCategories use case with new order
   - Test: Updates UI after successful reorder
   - Test: Handles reorder errors

2. Run tests: Expected RED

3. Implement: `src/adapters/primary/view-models/categories/reorderCategoriesVM.ts`

4. Run tests: Expected GREEN

**View Model Extension: getTreeCategoriesVM**

1. Update test: `src/adapters/primary/view-models/categories/getTreeCategoriesVM.spec.ts` (existing)
   - Add test: Includes order field in category transformation

2. Run test: Expected RED (if order field missing)

3. Update implementation: Include `order` field

4. Run test: Expected GREEN

**Verification Command**: `TZ=UTC pnpm test src/adapters/primary/view-models/categories/`

#### Step 4.3: PharmacistSelection View Models

**View Model 1: getPharmacistSelectionVM**

1. Write test: `src/adapters/primary/view-models/pharmacist-selection/getPharmacistSelectionVM.spec.ts`
   - Test: Retrieves product UUIDs
   - Test: Fetches full product details (may need product gateway mock)
   - Test: Returns ordered list of products

2. Run tests: Expected RED

3. Implement: `src/adapters/primary/view-models/pharmacist-selection/getPharmacistSelectionVM.ts`

4. Run tests: Expected GREEN

**View Model 2: pharmacistSelectionVM**

1. Write test: `src/adapters/primary/view-models/pharmacist-selection/pharmacistSelectionVM.spec.ts`
   - Test: Manages product search
   - Test: Adds product to selection
   - Test: Removes product from selection
   - Test: Reorders products via drag-drop
   - Test: Saves selection via use case

2. Run tests: Expected RED

3. Implement: `src/adapters/primary/view-models/pharmacist-selection/pharmacistSelectionVM.ts`

4. Run tests: Expected GREEN

**Verification Command**: `TZ=UTC pnpm test src/adapters/primary/view-models/pharmacist-selection/`

#### Step 4.4: EmergencyPharmacy View Models

**View Model 1: getEmergencyPharmaciesVM**

1. Write test: `src/adapters/primary/view-models/emergency-pharmacies/getEmergencyPharmaciesVM.spec.ts`
   - Test: Retrieves emergency pharmacies
   - Test: Groups pharmacies by date
   - Test: Sorts by date descending

2. Run tests: Expected RED

3. Implement: `src/adapters/primary/view-models/emergency-pharmacies/getEmergencyPharmaciesVM.ts`

4. Run tests: Expected GREEN

**View Model 2: emergencyPharmacyFormCreateVM**

1. Write test: `src/adapters/primary/view-models/emergency-pharmacies/emergencyPharmacyFormCreateVM.spec.ts`
   - Test: Initializes empty form
   - Test: Validates required fields
   - Test: Creates pharmacy via use case
   - Test: Navigates to list on success

2. Run tests: Expected RED

3. Implement: `src/adapters/primary/view-models/emergency-pharmacies/emergencyPharmacyFormCreateVM.ts`

4. Run tests: Expected GREEN

**View Model 3: emergencyPharmacyFormEditVM**

1. Write test: `src/adapters/primary/view-models/emergency-pharmacies/emergencyPharmacyFormEditVM.spec.ts`
   - Test: Loads existing pharmacy data
   - Test: Validates required fields
   - Test: Updates pharmacy via use case
   - Test: Navigates to list on success

2. Run tests: Expected RED

3. Implement: `src/adapters/primary/view-models/emergency-pharmacies/emergencyPharmacyFormEditVM.ts`

4. Run tests: Expected GREEN

**View Model 4: emergencyPharmacyFormGetVM**

1. Write test: `src/adapters/primary/view-models/emergency-pharmacies/emergencyPharmacyFormGetVM.spec.ts`
   - Test: Retrieves pharmacy by UUID
   - Test: Handles not found error

2. Run tests: Expected RED

3. Implement: `src/adapters/primary/view-models/emergency-pharmacies/emergencyPharmacyFormGetVM.ts`

4. Run tests: Expected GREEN

**Verification Command**: `TZ=UTC pnpm test src/adapters/primary/view-models/emergency-pharmacies/`

**Phase 4 Completion Check**:
```bash
TZ=UTC pnpm test src/adapters/primary/view-models/
```
All tests should be GREEN.

### Phase 5: UI Components

#### Step 5.1: Page Components

**Research Phase**: Before implementation, examine existing pages:
- Check routing patterns in `pages/` directory
- Review form page structure (e.g., categories, banners, roles)
- Understand layout components and navigation

**Pages to Create**:

1. **Overview Page**: `src/adapters/primary/nuxt/pages/shop-management/index.vue`
   - Display 4 cards linking to each feature
   - No form logic, just navigation

2. **Announcement Bar Page**: `src/adapters/primary/nuxt/pages/shop-management/announcement-bar.vue`
   - Import `AnnouncementBarForm` organism
   - Use `announcementBarFormVM`
   - Handle loading/error states

3. **Category Order Page**: `src/adapters/primary/nuxt/pages/shop-management/category-order.vue`
   - Import `CategoryOrderList` organism
   - Use `reorderCategoriesVM`
   - Implement drag-drop with `vuedraggable`

4. **Pharmacist Selection Page**: `src/adapters/primary/nuxt/pages/shop-management/pharmacist-selection.vue`
   - Import `PharmacistSelectionManager` organism
   - Use `pharmacistSelectionVM`
   - Product search + drag-drop ordering

5. **Emergency Pharmacies List Page**: `src/adapters/primary/nuxt/pages/shop-management/emergency-pharmacies/index.vue`
   - Import `EmergencyPharmaciesList` organism
   - Use `getEmergencyPharmaciesVM`
   - Display grouped by date

6. **Emergency Pharmacy Create Page**: `src/adapters/primary/nuxt/pages/shop-management/emergency-pharmacies/new.vue`
   - Import `EmergencyPharmacyForm` organism
   - Use `emergencyPharmacyFormCreateVM`

7. **Emergency Pharmacy Edit Page**: `src/adapters/primary/nuxt/pages/shop-management/emergency-pharmacies/edit/[uuid].vue`
   - Import `EmergencyPharmacyForm` organism
   - Use `emergencyPharmacyFormEditVM` and `emergencyPharmacyFormGetVM`

**Pattern**: Follow existing page patterns from categories, banners, roles, staff features.

#### Step 5.2: Organism Components

**Research Phase**: Examine existing organisms:
- Form patterns (e.g., CategoryForm, BannerForm)
- List patterns (e.g., BannersList with drag-drop)
- Error/success notification patterns

**Organisms to Create**:

1. **AnnouncementBarForm.vue**
   - Props: `modelValue` (AnnouncementBar), `loading`, `error`
   - Emits: `update:modelValue`, `submit`
   - Fields: text (textarea), isActive (toggle), startDate (datepicker), endDate (datepicker)
   - Use atoms: FtInput, FtTextarea, FtButton, FtToggle, FtDatePicker

2. **CategoryOrderList.vue**
   - Props: `categories` (Array<Category>), `loading`
   - Emits: `reorder` (newOrder: Array<UUID>)
   - Use: `vuedraggable` for drag-drop
   - Display: CategoryOrderItem molecules in draggable list
   - Pattern: Follow BannersList.vue

3. **PharmacistSelectionManager.vue**
   - Props: `selectedProducts` (Array<Product>), `loading`
   - Emits: `add-product`, `remove-product`, `reorder`
   - Features: Product search input, selected products list with drag-drop
   - Use: PharmacistSelectionItem molecules, vuedraggable

4. **EmergencyPharmacyForm.vue**
   - Props: `modelValue` (EmergencyPharmacy), `loading`, `error`, `mode` ('create' | 'edit')
   - Emits: `update:modelValue`, `submit`
   - Fields: name, address, phone, date, isActive
   - Use atoms: FtInput, FtButton, FtToggle, FtDatePicker

5. **EmergencyPharmaciesList.vue**
   - Props: `pharmaciesGroupedByDate` (Map<Date, Array<EmergencyPharmacy>>)
   - Emits: `edit`, `delete`
   - Display: Grouped sections by date with EmergencyPharmacyCard molecules

#### Step 5.3: Molecule Components

1. **CategoryOrderItem.vue**
   - Props: `category` (Category)
   - Display: Drag handle icon + category name + thumbnail (if available)

2. **PharmacistSelectionItem.vue**
   - Props: `product` (Product)
   - Emits: `remove`
   - Display: Product image + name + price + remove button

3. **EmergencyPharmacyCard.vue**
   - Props: `pharmacy` (EmergencyPharmacy)
   - Emits: `edit`, `delete`
   - Display: Name, address, phone, date, active status, action buttons

#### Step 5.4: Atoms

**No new atoms needed**. Reuse existing atoms:
- FtInput
- FtTextarea
- FtButton
- FtToggle
- FtDatePicker
- FtModal
- FtCard

### Phase 6: i18n Integration

**File**: `src/i18n/locales/fr.json`

Add complete French translations as specified in the specification document under "I18n Translations" section.

**Verification**:
1. Search all new Vue files for hardcoded strings: `grep -r "\".*\"" src/adapters/primary/nuxt/pages/shop-management/`
2. Ensure all user-facing text uses `$t('...')` or equivalent i18n syntax

### Phase 7: Navigation Integration

**File**: Update navigation configuration (check existing navigation structure first)

Add "Gestion boutique" section with children as specified:
- Vue d'ensemble → `/shop-management`
- Barre d'annonce → `/shop-management/announcement-bar`
- Ordre des catégories → `/shop-management/category-order`
- Sélection du pharmacien → `/shop-management/pharmacist-selection`
- Pharmacies de garde → `/shop-management/emergency-pharmacies`

**Research**: Find navigation configuration file (likely in `src/adapters/primary/nuxt/` or similar).

### Phase 8: Integration Testing & Verification

#### Step 8.1: Run Full Test Suite

```bash
TZ=UTC pnpm test-once
```

**Expected Result**: All tests pass with 100% coverage for use cases and view models.

**If Tests Fail**:
1. Identify failing test
2. Debug implementation
3. Fix issue
4. Re-run tests
5. Repeat until GREEN

#### Step 8.2: Linting Verification

```bash
pnpm lint
```

**Expected Result**: Zero warnings and zero errors.

**If Linting Fails**:
1. Fix linting errors/warnings
2. Re-run linter
3. Ensure zero warnings tolerance

#### Step 8.3: Type Checking

```bash
pnpm ts:check
```

**Expected Result**: No TypeScript errors.

**If Type Errors Exist**:
1. Fix type issues
2. Re-run type check
3. Ensure full type safety

#### Step 8.4: Build Verification

```bash
pnpm build
```

**Expected Result**: Build succeeds without errors.

**If Build Fails**:
1. Check build logs for errors
2. Fix identified issues
3. Re-run build
4. Repeat until successful

#### Step 8.5: Manual Testing

Start development server:
```bash
pnpm dev
```

**Test Checklist**:

1. **Navigation**:
   - [ ] "Gestion boutique" menu appears
   - [ ] All sub-menu items are clickable
   - [ ] Routes navigate correctly

2. **Announcement Bar**:
   - [ ] Page loads without errors
   - [ ] Can update announcement text
   - [ ] Toggle active state works
   - [ ] Date pickers function correctly
   - [ ] Save button updates announcement
   - [ ] Success/error messages appear

3. **Category Order**:
   - [ ] Categories load and display
   - [ ] Drag-drop reordering works
   - [ ] Order persists after save
   - [ ] Loading states display correctly

4. **Pharmacist Selection**:
   - [ ] Product search functions
   - [ ] Can add products to selection
   - [ ] Can remove products
   - [ ] Drag-drop reordering works
   - [ ] Changes save correctly

5. **Emergency Pharmacies**:
   - [ ] List displays pharmacies grouped by date
   - [ ] Create page has empty form
   - [ ] Can create new pharmacy
   - [ ] Edit page loads existing data
   - [ ] Can update pharmacy
   - [ ] Can delete pharmacy
   - [ ] Confirmation modal appears for delete

6. **Cross-Feature**:
   - [ ] All i18n strings display in French
   - [ ] No console errors in browser
   - [ ] Loading states work correctly
   - [ ] Error states display appropriately
   - [ ] Forms validate required fields

## Testing Strategy

### Unit Tests

**Coverage Targets**:
- Entities: 100% (helper functions)
- Use Cases: 100% (all business logic)
- View Models: 100% (all transformations and state management)
- Gateways: InMemory implementations used in tests (no separate gateway tests)

**Testing Rules** (Critical):
1. **One expect per test** - Each test validates one specific behavior
2. **Compare full objects** - Use `expect(result).toEqual(expectedObject)`, not field-by-field
3. **No mocks** - Use InMemory gateways instead of mocking
4. **Inject dateProvider** - Never use `Date.now()` directly in code
5. **Never use `expect.any()`** - Always specify exact expected values
6. **Use realistic test data** - Create test data utilities that reflect real-world data

**Example Test Structure**:

```typescript
// ❌ BAD - Multiple expects, field-by-field comparison
it('should update announcement bar', async () => {
  const result = await updateAnnouncementBar(...)
  expect(result.text).toBe('New text')
  expect(result.isActive).toBe(true)
  expect(result.uuid).toBeDefined()
})

// ✅ GOOD - Single expect, full object comparison
it('should update announcement bar text', async () => {
  const result = await updateAnnouncementBar(...)
  expect(result).toEqual({
    uuid: 'test-uuid-123',
    text: 'New text',
    isActive: true,
    startDate: undefined,
    endDate: undefined
  })
})
```

### Integration Testing (Manual)

**Approach**: Manual testing via browser after all automated tests pass.

**Focus Areas**:
- User flows from navigation to form submission
- Error handling and validation messages
- Drag-drop interactions (vuedraggable)
- Date picker functionality
- API integration with real backend

### Test Data Management

**Location**: `src/utils/testData/`

**Files**:
- `announcementBar.ts` - Factory function for announcement bar test data
- `pharmacistSelection.ts` - Factory function for selection test data
- `emergencyPharmacy.ts` - Factory function for pharmacy test data

**Pattern**: Follow existing test data utilities (e.g., `banner.ts`, `role.ts`).

## Potential Challenges & Solutions

### Challenge 1: Category Entity Extension

**Issue**: Existing Category entity may be used in many places; adding `order` field could break existing code.

**Solution**:
1. Add `order` field as optional initially: `order?: number`
2. Run full test suite to identify breakages
3. Update affected code to handle optional order
4. Once stable, make `order` required and assign default values to existing categories
5. Run migration script (if needed) to populate order field in backend

### Challenge 2: Pharmacist Selection - Product Fetching

**Issue**: Frontend stores only product UUIDs, but UI needs full product details (name, image, price).

**Solution**:
1. View model should call product gateway to fetch full product details based on UUIDs
2. May need to create a `getProductsByUuids` use case or extend existing product gateway
3. Handle loading state while fetching products
4. Cache product data to avoid repeated fetches

### Challenge 3: Drag-Drop State Management

**Issue**: vuedraggable state can be tricky with Vue 3 reactivity and Pinia stores.

**Solution**:
1. Keep local draggable state in component
2. Emit reorder event with new order array
3. View model handles persistence via use case
4. After successful save, update store
5. Follow BannersList.vue pattern exactly

### Challenge 4: Date Handling Across Timezones

**Issue**: Announcement bar and emergency pharmacy dates must be consistent across timezones.

**Solution**:
1. Always inject `dateProvider` gateway
2. Store dates as UTC timestamps on backend
3. Display dates in user's local timezone (handled by date picker component)
4. Use `TZ=UTC` when running tests to ensure consistent test results
5. Never use `Date.now()` directly - always use `dateProvider.now()`

### Challenge 5: InMemory vs Real Gateway Differences

**Issue**: Tests pass with InMemory gateways but fail with Real gateways due to API differences.

**Solution**:
1. Ensure Real gateways transform API responses to match entity interfaces exactly
2. Add API integration tests (outside TDD scope) to verify Real gateway behavior
3. Use realistic test data that matches backend API response structure
4. Document any API response quirks in Real gateway implementation

### Challenge 6: Form Validation Consistency

**Issue**: Different forms may have inconsistent validation logic.

**Solution**:
1. Extract validation rules to shared utilities (e.g., `src/utils/validation/`)
2. Reuse validation patterns from existing forms (categories, banners)
3. Ensure error messages are consistent and i18n-ized
4. Test validation in view model tests (not just UI)

## Success Criteria

### Functional Requirements

- [ ] Announcement bar can be created/updated with text, active status, and date range
- [ ] Categories can be reordered via drag-drop and order persists
- [ ] Pharmacist selection allows adding/removing/reordering products
- [ ] Emergency pharmacies support full CRUD operations with date assignment
- [ ] All features accessible via "Gestion boutique" navigation menu

### Technical Requirements

- [ ] All use cases have accompanying `.spec.ts` files with 100% coverage
- [ ] All view models have accompanying `.spec.ts` files with 100% coverage
- [ ] Full test suite passes: `TZ=UTC pnpm test-once` → ✅ GREEN
- [ ] Linting passes with zero warnings: `pnpm lint` → ✅ ZERO WARNINGS
- [ ] Type checking passes: `pnpm ts:check` → ✅ NO ERRORS
- [ ] Build succeeds: `pnpm build` → ✅ SUCCESS
- [ ] All UI text uses i18n (no hardcoded strings)
- [ ] Hexagonal architecture maintained (Core → Adapters → UI)
- [ ] No comments in code (extract functions for clarity)
- [ ] One expect per test (compare full objects)
- [ ] No mocks (use InMemory gateways)
- [ ] dateProvider injected (no Date.now() usage)

### Manual Testing

- [ ] All pages load without errors
- [ ] Forms validate required fields
- [ ] Success/error messages display correctly
- [ ] Drag-drop interactions work smoothly
- [ ] Date pickers function as expected
- [ ] Navigation menu integrates seamlessly
- [ ] No browser console errors during usage

### Documentation

- [ ] Code is self-documenting (no comments, clear function names)
- [ ] i18n translations complete and accurate
- [ ] Test data utilities created and documented

## Next Steps After Completion

1. **Backend Coordination**: Ensure backend endpoints exist and match gateway expectations
2. **API Integration Testing**: Test Real gateways with actual backend
3. **Performance Optimization**: Profile drag-drop performance with large lists
4. **Accessibility Audit**: Ensure WCAG compliance for all new UI components
5. **User Acceptance Testing**: Get feedback from actual pharmacists/admins
6. **Monitoring**: Add analytics/logging for usage tracking
7. **Documentation**: Create user guide for shop management features

## Implementation Timeline Estimate

**Phase 1: Core Layer (Entities & Gateways)** - 2-3 hours
- Entity definitions, helper functions, tests
- Gateway interface definitions

**Phase 2: Use Cases (TDD)** - 8-10 hours
- 12 use cases with comprehensive tests
- Red → Green → Refactor cycles

**Phase 3: Adapters Layer** - 4-6 hours
- InMemory gateways (partially done during Phase 2)
- Real gateways (API integration)
- Pinia stores

**Phase 4: View Models (TDD)** - 6-8 hours
- 10+ view models with tests
- Complex state management for forms and lists

**Phase 5: UI Components** - 8-10 hours
- 7 pages + 5 organisms + 3 molecules
- Drag-drop integration
- Form handling

**Phase 6: i18n Integration** - 1-2 hours
- Translation key definitions
- Verify no hardcoded strings

**Phase 7: Navigation Integration** - 1 hour
- Add menu entries
- Test navigation flow

**Phase 8: Integration Testing** - 3-4 hours
- Full test suite verification
- Manual testing
- Bug fixes

**Total Estimated Time**: 33-44 hours (approximately 5-6 working days for a single developer)

## Conclusion

This implementation plan provides a comprehensive, step-by-step guide to building the Shop Home Management feature following TDD methodology and hexagonal architecture. By adhering to the Red → Green → Refactor cycle and maintaining strict separation of concerns, the implementation will be robust, testable, and maintainable.

The key to success is discipline:
- **Write tests first** (Red)
- **Implement minimal code** (Green)
- **Refactor for clarity** (still Green)
- **Never skip tests**
- **One expect per test**
- **No mocks, use InMemory**
- **Inject dateProvider**
- **Compare full objects**

Follow this plan systematically, verify at each phase, and the feature will integrate seamlessly with the existing codebase while maintaining zero warnings tolerance and full type safety.
