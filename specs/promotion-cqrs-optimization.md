# Promotion CQRS Optimization Specification

## Overview
Refactor the promotion store and use cases to implement CQRS (Command Query Responsibility Segregation) pattern, separating read models (lightweight list items) from write models (full entities). This optimization reduces payload size by ~90% and prevents concurrent API requests.

## Requirements

### Functional Requirements
1. **Lightweight List View**: Return `PromotionListItem` (with `productCount`) instead of full `Promotion` entities
2. **Full Detail View**: Load complete `Promotion` entity only when viewing/editing specific promotion
3. **Request Deduplication**: Prevent concurrent API calls using loading guards
4. **Store Synchronization**: Keep `items` (list) and `current` (detail) in sync after mutations

### Non-Functional Requirements
- Follow hexagonal architecture and CQRS principles
- Align with existing store patterns (category, laboratory)
- Maintain backward compatibility with existing components
- Type-safe implementation with TypeScript
- All tests must pass

## Current Issues

### Issue 1: Inefficient Store Structure
**Problem**: Store has dual arrays (`items`, `detailedItems`) causing confusion
- `items`: `PromotionListItem[]` (read model)
- `detailedItems`: `Promotion[]` (unused/inconsistent)
- `current`: `Promotion | undefined` (write model)

**Impact**:
- Tests reference `detailedItems` but actions use it inconsistently
- Overcomplicated state management
- Not aligned with other stores

### Issue 2: No Loading Guard
**Problem**: `listPromotions` usecase has no concurrent request protection

**Impact**:
- Multiple rapid navigations trigger overlapping API calls
- Can cause backend timeout errors
- Inconsistent with other list usecases

### Issue 3: Actions Don't Sync Properly
**Problem**: `add()` and `edit()` actions only update `detailedItems`, not `items`

**Impact**:
- List view doesn't reflect newly created/edited promotions
- Manual page refresh required to see changes

## Architecture Design

### CQRS Pattern Implementation

**Read Model (Query)**: `PromotionListItem`
```typescript
interface PromotionListItem {
  uuid: string
  name: string
  type: ReductionType
  amount: number
  startDate?: Timestamp
  endDate?: Timestamp
  productCount: number  // ← Not full products array
}
```

**Write Model (Command)**: `Promotion`
```typescript
interface Promotion {
  uuid: UUID
  name: string
  products: Array<Product>  // ← Full nested array
  type: ReductionType
  amount: number
  startDate?: Timestamp
  endDate?: Timestamp
}
```

### Store Structure (Refactored)

**New Structure**:
```typescript
{
  items: Array<PromotionListItem>,      // List view (lightweight)
  current: Promotion | undefined,       // Detail/edit view (full entity)
  isLoading: boolean                    // Request deduplication
}
```

**Rationale**:
- **Consistency**: Same pattern as `categoryStore`, `laboratoryStore`
- **CQRS alignment**: `items` = read model, `current` = write model
- **Memory efficiency**: Don't store full entities for list view
- **Simplicity**: Remove unused `detailedItems` array

### Gateway Design (No Changes Required)

**Current Gateway** (already CQRS-compliant):
```typescript
export interface PromotionGateway {
  list(): Promise<Array<PromotionListItem>>        // ← Read Model
  getByUuid(uuid: UUID): Promise<Promotion>        // ← Write Model
  create(dto: CreatePromotionDTO): Promise<Promotion>
  edit(uuid: UUID, dto: EditPromotionDTO): Promise<Promotion>
}
```

## Technical Specifications

### Store Refactoring

**File**: `src/store/promotionStore.ts`

**Changes Required**:
1. Remove `detailedItems` array from state
2. Add `isLoading`, `startLoading()`, `stopLoading()`
3. Add `toListItem()` helper for `Promotion` → `PromotionListItem` transformation
4. Update `add()` to set `current` AND push to `items`
5. Update `edit()` to set `current` AND update item in `items`
6. Add `getByUuid()` getter

**Implementation**:
```typescript
const toListItem = (promotion: Promotion): PromotionListItem => ({
  uuid: promotion.uuid,
  name: promotion.name,
  type: promotion.type,
  amount: promotion.amount,
  startDate: promotion.startDate,
  endDate: promotion.endDate,
  productCount: promotion.products.length
})

export const usePromotionStore = defineStore('PromotionStore', {
  state: () => ({
    items: [] as Array<PromotionListItem>,
    current: undefined as Promotion | undefined,
    isLoading: false
  }),
  getters: {
    getByUuid: (state) => (uuid: string) => {
      return state.items.find((item) => item.uuid === uuid)
    }
  },
  actions: {
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    list(promotions: Array<PromotionListItem>) {
      this.items = promotions
    },
    add(promotion: Promotion) {
      this.current = promotion
      this.items.push(toListItem(promotion))
    },
    edit(promotion: Promotion) {
      this.current = promotion
      this.items = this.items.map((item) =>
        item.uuid === promotion.uuid ? toListItem(promotion) : item
      )
    },
    setCurrent(promotion: Promotion) {
      this.current = JSON.parse(JSON.stringify(promotion))
    }
  }
})
```

### Use Case Updates

**File**: `src/core/usecases/promotions/promotions-listing/listPromotions.ts`

**Changes Required**: Add loading guard pattern

```typescript
export const listPromotions = async (
  promotionGateway: PromotionGateway
): Promise<void> => {
  const promotionStore = usePromotionStore()

  if (promotionStore.isLoading) {
    return
  }

  try {
    promotionStore.startLoading()
    const promotions = await promotionGateway.list()
    promotionStore.list(promotions)
  } finally {
    promotionStore.stopLoading()
  }
}
```

**Files**: No changes needed (already call `store.add()`/`store.edit()`)
- `src/core/usecases/promotions/promotion-creation/createPromotion.ts`
- `src/core/usecases/promotions/promotion-edition/editPromotion.ts`

## Implementation Strategy

### Phase 1: Store Refactoring
1. Refactor `promotionStore.ts` with new structure
2. Add loading state management
3. Add `toListItem()` transformation helper
4. Update `add()` and `edit()` actions to sync both `items` and `current`

### Phase 2: Use Case Updates
1. Add loading guard to `listPromotions.ts`
2. Verify `createPromotion.ts` and `editPromotion.ts` work correctly

### Phase 3: Test Fixes
1. Fix `createPromotion.spec.ts`: Replace `detailedItems` with `items`
2. Verify all promotion-related tests pass
3. Run full test suite

## File Changes Summary

### Files to Modify
1. **`src/store/promotionStore.ts`**
   - Remove `detailedItems` array
   - Add `isLoading`, `startLoading()`, `stopLoading()`
   - Add `toListItem()` transformation helper
   - Update `add()` and `edit()` actions

2. **`src/core/usecases/promotions/promotions-listing/listPromotions.ts`**
   - Add loading guard (`if (store.isLoading) return`)

3. **`src/core/usecases/promotions/promotion-creation/createPromotion.spec.ts`**
   - Replace `detailedItems` with `items` (lines 64, 85, 156)

### Files to Keep (No Changes)
- `src/core/entities/promotion.ts` - Write model
- `src/core/usecases/promotions/promotions-listing/promotionListItem.ts` - Read model
- `src/core/gateways/promotionGateway.ts` - Interface
- `src/core/usecases/promotions/promotion-creation/createPromotion.ts` - Already correct
- `src/core/usecases/promotions/promotion-edition/editPromotion.ts` - Already correct

## Testing Strategy

### Test Updates Required

**File**: `createPromotion.spec.ts`

**Changes**:
```typescript
// Line 64: Change from detailedItems to items
it('should save the promotion in promotion store', () => {
  expect(promotionStore.items).toStrictEqual([
    { uuid: 'abc123', name: 'PromoTest', type: ReductionType.Percentage, amount: 10, productCount: 1 }
  ])
})

// Line 85: Change from detailedItems to items
it('should save the promotion in promotion store', () => {
  expect(promotionStore.items).toStrictEqual([
    promotionPercentageDolodentListItem,
    expectedPromotionListItem
  ])
})

// Line 156: Update helper function
const givenExistingPromotions = (...promotions: Array<Promotion>) => {
  promotionGateway.feedWith(...promotions)
  promotionStore.items = promotions.map(p => toListItem(p))
}
```

### Test Scenarios to Verify
- ✅ List promotions returns `PromotionListItem[]`
- ✅ Create promotion updates both `current` and `items`
- ✅ Edit promotion updates both `current` and corresponding item in `items`
- ✅ Loading guard prevents concurrent requests
- ✅ Store `items` array contains `productCount`, not full `products`

## Success Criteria

- ✅ Store follows `items` + `current` pattern (no `detailedItems`)
- ✅ List view uses `PromotionListItem` (productCount only)
- ✅ Detail/edit views use full `Promotion` with `products[]`
- ✅ Loading guard prevents concurrent API calls
- ✅ All tests pass (2037+ tests)
- ✅ No TypeScript errors
- ✅ Consistent with category/laboratory store patterns

## Performance Expectations

### Before CQRS
- Payload: ~50-100KB for 50 promotions with nested products
- Risk of concurrent requests causing timeouts

### After CQRS
- Payload: ~5-10KB for 50 promotions (productCount only)
- 10x faster list loading
- No concurrent request issues
- Detail view fetched on-demand

## Integration Points

- **Backend**: Already implementing CQRS view for `list()` endpoint
- **Gateway**: Already returns correct types (`PromotionListItem[]` vs `Promotion`)
- **Components**: No changes needed (use store getters/actions)
- **Other Stores**: Aligned with category, laboratory patterns

## Risk Assessment

### Risks
1. **Breaking Change**: Removing `detailedItems` might break untested components
   - **Mitigation**: Grep for `detailedItems` usage first

2. **Store Sync**: `items` and `current` could diverge
   - **Mitigation**: Centralized `toListItem()` transformation

3. **Test Failures**: Existing tests reference `detailedItems`
   - **Mitigation**: Update test expectations before deployment

### Risk Level: LOW
- Changes are isolated to store and one usecase
- Pattern proven by existing category/laboratory stores
- Backward compatible at component level
