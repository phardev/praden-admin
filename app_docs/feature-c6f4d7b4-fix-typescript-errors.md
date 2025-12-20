# Fix TypeScript Errors in Frontend

**ADW ID:** c6f4d7b4
**Date:** 2025-12-20
**Specification:** N/A

## Overview

This update resolves TypeScript compilation errors across the frontend codebase by adding proper type annotations, type declarations for third-party modules, and type guard improvements. The changes ensure strict TypeScript mode compliance without altering application behavior.

## What Was Built

- Added type declaration files for untyped third-party libraries (v-calendar, vue-qr)
- Improved type guards for discriminated unions (productImage entity)
- Added explicit type annotations to Vue component props and functions
- Fixed type mismatches in store actions and gateway implementations
- Updated usecase functions to properly transform data types

## Affected Repositories

- [x] Frontend (app/client) - TypeScript error fixes across components, composables, stores, and usecases

## Technical Implementation

### Files Modified

#### Type Declarations (New Files)
- `types/v-calendar.d.ts`: Type definitions for v-calendar date picker
- `types/vue-qr.d.ts`: Type definitions for vue-qr component

#### Core Entity Improvements
- `src/core/entities/productImage.ts`: Enhanced type guards `isExistingImage` and `isNewImage` with proper type predicates

#### Store Fixes
- `src/store/searchStore.ts`: Updated `set` action to accept `undefined` values with proper type handling

#### Gateway Updates
- `gateways/dashBoardGateway.ts`: Added missing mock data properties for dashboard statistics
- `gateways/emailGateway.ts`: Type annotation fixes

#### Composable Fixes
- `src/adapters/primary/nuxt/composables/usePermissions.ts`: Added type assertions for permissions record access

#### Component Type Annotations
- `src/adapters/primary/nuxt/components/molecules/FtCategoryTreeNode.vue`: Added `TreeItem` interface and typed props
- `src/adapters/primary/nuxt/components/molecules/FtCategoryTree.vue`: Typed component props
- `src/adapters/primary/nuxt/components/molecules/PieChart.vue`: Typed chart data props
- `src/adapters/primary/nuxt/components/molecules/FtTable.vue`: Typed table column definitions
- Multiple chart components: Typed data series properties

#### Usecase Fixes
- `src/core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare.ts`: Added `toListItem` transformer function to properly convert `Product` to `ProductListItem`
- `src/core/usecases/customers/customer-creation/createCustomer.ts`: Type annotation improvements
- `src/core/usecases/roles/role-edition/editRole.ts`: Added explicit return type
- `src/core/usecases/support/resolveTicket.ts`: Type annotation fix
- `src/core/usecases/announcement-bar/*.ts`: Added explicit return types

#### View Model Fixes
- Category, Laboratory, Promotion form VMs: Updated initialization patterns
- Navigation menu VM: Fixed filter types
- Pharmacist selection VM: Type annotation fixes

#### InMemory Gateway Fixes
- `InMemoryCustomerGateway.ts`: Type annotation improvements
- `InMemoryProductGateway.ts`: Type annotation improvements
- `InMemoryTicketGateway.ts`: Type annotation improvements

### Key Changes

- Added type predicates (`is` syntax) to `isExistingImage` and `isNewImage` functions for proper type narrowing
- Created missing type declarations for v-calendar and vue-qr third-party modules
- Fixed `searchStore.set()` to properly handle `undefined` values
- Added `toListItem` transformer in `listOrdersToPrepare` to convert `Product` entities to `ProductListItem` type expected by the store
- Added explicit `PropType` imports and usage in Vue component prop definitions
- Fixed type assertions in `usePermissions` composable for dynamic property access

## How to Use

No user-facing changes. The codebase now compiles without TypeScript errors in strict mode.

## Testing

1. Run TypeScript compilation:
   ```bash
   pnpm build
   ```

2. Run tests to verify no regressions:
   ```bash
   TZ=UTC pnpm test run
   ```

3. Verify linting passes:
   ```bash
   pnpm lint
   ```

## Notes

- All changes are type-level only; no runtime behavior modifications
- Type guards in `productImage.ts` now enable proper type narrowing, improving code safety in consuming components
- The `searchStore.set()` fix allows proper cleanup of search results when setting to `undefined`
