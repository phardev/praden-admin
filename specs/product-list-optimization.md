# Product List Optimization - CQRS Implementation Plan

## Executive Summary

**Status**: READY FOR IMPLEMENTATION
**Complexity**: Medium
**Estimated Effort**: 4-6 hours (TDD approach)
**Risk Level**: Low (follows proven promotion optimization pattern)
**Based on**: Successful PromotionListItem CQRS implementation

## Analysis of Promotion Optimization Implementation

### What Was Planned vs What Was Actually Implemented

#### ✅ Successfully Implemented

1. **PromotionListItem Read Model** (`src/core/usecases/promotions/promotions-listing/promotionListItem.ts`):
   - Created separate interface with minimal data: `uuid`, `name`, `type`, `amount`, `startDate`, `endDate`, `productCount`
   - Replaced full `Product[]` array with `productCount: number`

2. **Gateway Interface Update** (`src/core/gateways/promotionGateway.ts`):
   - Changed `list()` signature from `Promise<Array<Promotion>>` to `Promise<Array<PromotionListItem>>`
   - Backend directly returns optimized data structure

3. **Gateway Implementation** (`src/adapters/secondary/promotion-gateways/RealPromotionGateway.ts`):
   - `list()` method now calls `GET /promotions/` and receives `PromotionListItem[]` directly
   - Backend handles optimization - no frontend transformation needed

4. **Store Management** (`src/store/promotionStore.ts`):
   - State stores `PromotionListItem[]` instead of full `Promotion[]`
   - `toListItem()` helper function converts full `Promotion` to `PromotionListItem` when needed (for add/edit)
   - Separate `current: Promotion` for detail view

5. **ViewModel Update** (`src/adapters/primary/view-models/promotions/get-promotions/getPromotionsVM.ts`):
   - Line 110: Uses `p.productCount` directly instead of `p.products.length`
   - Works with `PromotionListItem` from store

#### 📝 Key Differences from Original Plan

**Original Plan**: Create new `listForDisplay()` method alongside existing `list()`
**Actual Implementation**: Modified `list()` directly to return `PromotionListItem[]`

**Rationale**: Simpler approach - since list view is the primary use case, no need for two separate methods.

#### 🎯 Pattern Confirmed

The actual implementation validates the CQRS read model approach:
- ✅ Domain layer defines read model (`PromotionListItem`)
- ✅ Gateway returns optimized projection
- ✅ Backend API provides optimized data
- ✅ Store manages lightweight list items
- ✅ ViewModel consumes optimized data directly

## Current Product Listing - Inefficiency Analysis

### Current Implementation Issues

**Files Analyzed:**
1. `src/core/entities/product.ts` - Full Product entity (33 lines of properties!)
2. `src/core/gateways/productGateway.ts` - Returns `Promise<Array<Product>>`
3. `src/adapters/secondary/product-gateways/RealProductGateway.ts` - Fetches full Product objects
4. `src/adapters/primary/view-models/products/get-products/getProductsVM.ts` - Uses full Product
5. `src/store/productStore.ts` - Stores full Product entities

### Data Transfer Inefficiency

**Current Product Entity (Full)**:
```typescript
interface Product {
  uuid: UUID                          // ✅ NEEDED
  status: ProductStatus               // ✅ NEEDED
  name: string                        // ✅ NEEDED
  miniature: string                   // ⚠️ NEEDED (but only miniature, not all images)
  images: Array<string>               // ❌ NOT NEEDED FOR LIST (can be 5-10 images!)
  categories: Array<Category>         // ⚠️ NEEDED (but only uuid + name, not full Category)
  cip7: string                        // ❌ NOT NEEDED FOR LIST
  cip13: string                       // ❌ NOT NEEDED FOR LIST
  ean13: string                       // ✅ NEEDED
  priceWithoutTax: number             // ✅ NEEDED
  percentTaxRate: number              // ✅ NEEDED
  locations: HashTable<string>        // ❌ NOT NEEDED FOR LIST
  availableStock: number              // ✅ NEEDED
  laboratory?: Laboratory | null      // ⚠️ NEEDED (but only uuid + name, not full Laboratory)
  description: string                 // ❌ NOT NEEDED FOR LIST (can be very long!)
  instructionsForUse: string          // ❌ NOT NEEDED FOR LIST (can be very long!)
  composition: string                 // ❌ NOT NEEDED FOR LIST (can be very long!)
  weight: number                      // ❌ NOT NEEDED FOR LIST
  maxQuantityForOrder?: number        // ❌ NOT NEEDED FOR LIST
  isMedicine: boolean                 // ⚠️ NEEDED (used for arePromotionsAllowed calculation)
  flags: Record<string, boolean>      // ✅ NEEDED (specifically arePromotionsAllowed flag)
}
```

**ViewModel Actually Uses** (getProductsVM.ts:86-101):
```typescript
{
  uuid: p.uuid,                                                    // ✅
  name: p.name,                                                    // ✅
  img: p.miniature,                                                // ✅
  reference: p.ean13,                                              // ✅
  laboratory: p.laboratory?.name || '',                            // ⚠️ Only name!
  categories: p.categories.map((c) => c.name),                    // ⚠️ Only names!
  priceWithoutTax: formatter.format(p.priceWithoutTax / 100),     // ✅
  priceWithTax: (calculated from priceWithoutTax + tax),          // ✅ (uses percentTaxRate)
  availableStock: p.availableStock,                               // ✅
  isActive: p.status === ProductStatus.Active,                    // ✅ (uses status)
  arePromotionsAllowed: p.flags?.arePromotionsAllowed && !p.isMedicine  // ✅ (uses flags.arePromotionsAllowed + isMedicine)
}
```

### 🚨 Waste Calculation

**Current Data Transfer Per Product**:
- `images` array: ~5 images × 200 bytes = ~1KB
- `description`: ~500 bytes
- `instructionsForUse`: ~500 bytes
- `composition`: ~500 bytes
- Full `Laboratory` object (if present): ~300 bytes (uuid, name, description, address, etc.)
- Full `Category[]` objects: ~200 bytes each × average 3 categories = ~600 bytes
- `locations`, `cip7`, `cip13`, `weight`, `maxQuantityForOrder`: ~200 bytes

**Total Waste per Product**: ~3.6KB of unnecessary data
**For 100 Products**: ~360KB of waste
**For 1000 Products**: ~3.6MB of waste

## Proposed Solution: ProductListItem Read Model

### ProductListItem Interface

Based on ViewModel requirements and user specifications:

```typescript
// src/core/usecases/product/product-listing/productListItem.ts
export interface ProductListItem {
  uuid: UUID
  name: string
  ean13: string
  laboratory: {
    uuid: UUID
    name: string
  } | null
  categories: Array<{
    uuid: UUID
    name: string
  }>
  priceWithoutTax: number
  percentTaxRate: number
  availableStock: number
  status: ProductStatus
  flags: {
    arePromotionsAllowed: boolean
  }
  miniature: string
  isMedicine: boolean
}
```

### Why This Structure?

1. **uuid**: Required for row actions (view, edit, delete)
2. **name**: Primary display field
3. **ean13**: Reference field (instead of cip7/cip13)
4. **laboratory**: Nested object with only uuid + name (not full Laboratory entity)
5. **categories**: Array of minimal objects with only uuid + name (not full Category entities)
6. **priceWithoutTax**: Display field
7. **percentTaxRate**: Needed for priceWithTax calculation
8. **availableStock**: Display field
9. **status**: Needed for isActive calculation
10. **flags.arePromotionsAllowed**: Needed for promotions column
11. **miniature**: Image display (NOT full images array)
12. **isMedicine**: Needed for arePromotionsAllowed calculation

### Data Reduction Estimation

**Before (Full Product)**: ~5KB per product
**After (ProductListItem)**: ~800 bytes per product
**Reduction**: ~84% less data transferred

For 100 products:
- Before: ~500KB
- After: ~80KB
- **Savings: 420KB (84%)**

## Implementation Plan (Following Promotion Pattern)

### Phase 1: Domain Layer - Define Read Model ✅

**Step 1.1: Create `ProductListItem` interface**
- File: `src/core/usecases/product/product-listing/productListItem.ts`
- Action: Create new file with ProductListItem interface
- Test: N/A (type definition)

### Phase 2: Gateway Layer - Update Interface ✅

**Step 2.1: Modify ProductGateway interface**
- File: `src/core/gateways/productGateway.ts`
- Action: Change `list()` signature
- Before: `list(limit: number, offset: number): Promise<Array<Product>>`
- After: `list(limit: number, offset: number): Promise<Array<ProductListItem>>`

**Step 2.2: Update RealProductGateway (TDD - RED then GREEN)**
- File: `src/adapters/secondary/product-gateways/RealProductGateway.ts`
- Test File: `src/adapters/secondary/product-gateways/RealProductGateway.spec.ts`
- Action: Modify `list()` method to expect `ProductListItem[]` from backend
- Backend API: Should already return optimized data or will need coordination
- Note: Backend must support returning `ProductListItem` structure

**Step 2.3: Update InMemoryProductGateway (TDD)**
- File: `src/adapters/secondary/product-gateways/InMemoryProductGateway.ts`
- Action: Convert full Product entities to ProductListItem on the fly
- Logic: Map full Products to ProductListItem projection

### Phase 3: Store Layer - Update State Management ✅

**Step 3.1: Update ProductStore**
- File: `src/store/productStore.ts`
- Changes:
  ```typescript
  state: () => ({
    items: [] as Array<ProductListItem>,  // Changed from Product[]
    current: undefined as ProductWithPromotion | undefined,  // Keep for detail view
    // ... rest stays same
  })
  ```
- Action: Add `toListItem()` helper (similar to promotionStore)
- Action: Update `add()` and `edit()` to convert Promotion to ProductListItem

**Step 3.2: Update store methods**
- `list(products: Array<ProductListItem>)`: Store ProductListItem[] directly
- `add(product: Product)`: Convert to ProductListItem before storing
- `edit(product: Product)`: Convert to ProductListItem and update in list
- `setCurrent(product: ProductWithPromotion)`: Keep as-is (uses full Product)

### Phase 4: ViewModel Layer - Update to Use ProductListItem ✅

**Step 4.1: Update `getProductsVM`**
- File: `src/adapters/primary/view-models/products/get-products/getProductsVM.ts`
- Test File: `src/adapters/primary/view-models/products/get-products/getProductsVM.spec.ts`
- Changes:
  - Line 36: `const products = productStore.items` (now ProductListItem[])
  - Line 86-101: Simplify mapping (data already optimized)
  - Line 94: `laboratory: p.laboratory?.name || ''` (direct access)
  - Line 95: `categories: p.categories.map((c) => c.name)` (already minimal)
  - Line 100: `arePromotionsAllowed: p.flags?.arePromotionsAllowed && !p.isMedicine` (direct access)

**Simplified ViewModel Mapping**:
```typescript
items: products.map((p: ProductListItem) => {
  const priceWithTax = p.priceWithoutTax + (p.priceWithoutTax * p.percentTaxRate) / 100
  return {
    uuid: p.uuid,
    name: p.name,
    img: p.miniature,
    reference: p.ean13,
    laboratory: p.laboratory?.name || '',
    categories: p.categories.map((c) => c.name),
    priceWithoutTax: formatter.format(p.priceWithoutTax / 100),
    priceWithTax: formatter.format(priceWithTax / 100),
    availableStock: p.availableStock,
    isActive: p.status === ProductStatus.Active,
    arePromotionsAllowed: p.flags?.arePromotionsAllowed && !p.isMedicine
  }
})
```

### Phase 5: Update All Usecases Using Product Listing ✅

**Files to Update**:
1. Find all usecases calling `productGateway.list()`
2. Update to work with `ProductListItem[]` instead of `Product[]`

**Potential Usecases**:
- Product searching (`searchProducts`)
- Category-based listing (`getByCategoryUuid`)
- Laboratory-based listing (`getByLaboratoryUuid`)

**Note**: These methods may need similar optimization (to be evaluated case-by-case)

### Phase 6: Backend Coordination ⚠️

**Step 6.1: Define API Contract**
```
GET /products?limit={limit}&offset={offset}

Response:
{
  "items": [
    {
      "uuid": "string",
      "name": "string",
      "ean13": "string",
      "laboratory": {
        "uuid": "string",
        "name": "string"
      } | null,
      "categories": [
        {
          "uuid": "string",
          "name": "string"
        }
      ],
      "priceWithoutTax": number,
      "percentTaxRate": number,
      "availableStock": number,
      "status": "ACTIVE" | "INACTIVE",
      "flags": {
        "arePromotionsAllowed": boolean
      },
      "miniature": "string",
      "isMedicine": boolean
    }
  ]
}
```

**Step 6.2: Backend Implementation**
- Backend team must modify `/products` endpoint
- Return `ProductListItem` structure instead of full Product
- Optimize database query (avoid loading unnecessary fields)

### Phase 7: Testing & Verification ✅

**Step 7.1: Unit Tests**
- Test ProductListItem type definition
- Test gateway methods with new signature
- Test store methods with ProductListItem
- Test ViewModel with optimized data

**Step 7.2: Integration Tests**
- Test full flow: API → Gateway → UseCase → Store → ViewModel
- Verify data correctness
- Verify performance improvement

**Step 7.3: Manual UI Testing**
- Verify product list displays correctly
- Verify all columns show expected data
- Verify actions (view, edit, delete) still work

## Verification Checklist: Required Fields

Based on user requirements, all necessary fields are included:

- ✅ uuid
- ✅ name
- ✅ ean13
- ✅ laboratory: { uuid, name } only
- ✅ categories: [{ uuid, name}] only
- ✅ priceWithoutTax
- ✅ percentTaxRate
- ✅ availableStock
- ✅ status
- ✅ flags (specifically flags.arePromotionsAllowed)
- ✅ miniature (for image display)
- ✅ isMedicine (needed for arePromotionsAllowed calculation)

**Additional Fields Not in Original Spec but Required**:
- `miniature`: Needed for image display (line 92 in getProductsVM.ts)
- `isMedicine`: Needed for arePromotionsAllowed calculation (line 100)
- `percentTaxRate`: Needed for priceWithTax calculation (line 88)

## Risks & Mitigations

### Risk 1: Backend API Not Ready
**Impact**: HIGH (blocks implementation)
**Probability**: MEDIUM
**Mitigation**:
- Start with InMemoryGateway implementation (works immediately)
- Coordinate with backend team early
- Use feature flag to toggle between old/new approach

### Risk 2: Other Gateways Methods Need Similar Optimization
**Impact**: MEDIUM (getByCategoryUuid, getByLaboratoryUuid, batch)
**Probability**: HIGH
**Mitigation**:
- Evaluate each method individually
- Consider creating separate read models for each use case
- Follow same CQRS pattern

### Risk 3: Breaking Changes
**Impact**: HIGH (product listing could break)
**Probability**: LOW (if TDD followed strictly)
**Mitigation**:
- Comprehensive test coverage
- Gradual rollout with feature flag
- Monitor production closely

## Success Metrics

### Performance Improvements
- **Data transfer reduction**: 84% (500KB → 80KB for 100 products)
- **API response time**: Expected 20-30% improvement
- **Memory usage**: Expected 60-70% reduction in store
- **Page load time**: Expected 15-25% improvement

### Code Quality
- Test coverage: Maintain >80%
- Type safety: 100% (TypeScript strict mode)
- Architecture: Clear CQRS separation

## Implementation Timeline

**Total Estimated Time: 4-6 hours (with TDD)**

| Phase | Task | Time | Dependencies |
|-------|------|------|--------------|
| 1 | Define ProductListItem | 15 min | None |
| 2 | Update gateway interface | 15 min | Phase 1 |
| 3 | TDD: InMemoryGateway | 45 min | Phase 2 |
| 4 | TDD: RealGateway | 45 min | Backend API |
| 5 | Update store | 45 min | Phase 2 |
| 6 | Update ViewModel + tests | 45 min | Phase 5 |
| 7 | Update usecases | 30 min | Phase 5 |
| 8 | Testing & verification | 1 hour | All phases |
| 9 | Documentation | 30 min | All phases |

**Critical Path**: Backend API readiness

## Next Steps

### Immediate Actions

1. **Review & Approve Plan**: Get team consensus
2. **Backend Coordination**: Share API contract with backend team
3. **Create ProductListItem Interface**: Start with domain layer
4. **TDD Implementation**: Begin with InMemoryGateway (no backend dependency)

### Follow-up Considerations

1. **Apply to Other Methods**:
   - `getByCategoryUuid()` → CategoryProductListItem?
   - `getByLaboratoryUuid()` → LaboratoryProductListItem?
   - `batch()` → Evaluate if optimization needed

2. **Search Optimization**:
   - Product search currently uses full Product entities
   - Consider optimizing search results similarly

3. **Monitor Performance**:
   - Set up metrics tracking
   - Validate data reduction assumptions

## Conclusion

The product listing optimization follows the **proven CQRS pattern** successfully applied to promotions. The approach:

1. ✅ **Separates read model** (ProductListItem) from write model (Product)
2. ✅ **Respects hexagonal architecture** (clear layer boundaries)
3. ✅ **Optimizes at gateway layer** (backend returns minimal data)
4. ✅ **Reduces data transfer by 84%** (~500KB → ~80KB for 100 products)
5. ✅ **Maintains type safety** (TypeScript strict mode)
6. ✅ **Includes all required fields** (verified against user spec)
7. ✅ **Follows existing pattern** (proven with PromotionListItem)

**Recommendation: PROCEED** with implementation following strict TDD methodology.

---

**Document Version**: 1.0
**Date**: 2025-10-21
**Author**: Analysis based on promotion optimization implementation
**Status**: Ready for Implementation
**Based on**: `PROMOTION_LIST_OPTIMIZATION_ANALYSIS.md` and actual implementation review
