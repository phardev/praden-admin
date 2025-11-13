# Promotion Statistics Specification

## Overview

This specification describes the implementation of promotion statistics with product-level details and PDF export functionality. This feature allows pharmacies to track promotion usage by product and generate official reports.

## Architecture Overview

The implementation follows existing patterns:
- **Promotion-code stats** (email-based) → Already exists for tracking code usage by email
- **Promotion stats** (product-based) → New feature for tracking promotion usage by product
- **PDF Generation** → Backend responsibility (following delivery label pattern)

## Core Domain Changes

### 1. New Entity: PromotionStats

**File**: `src/core/entities/promotionStats.ts`

```typescript
export interface PromotionProductUsage {
  productUuid: UUID
  name: string
  ean13: string
  usageCount: number
  totalAmountTaxIncluded: number
  totalReductionTaxIncluded: number
}

export interface PromotionStats {
  usageCount: number
  totalSales: number
  totalDiscountGiven: number
  productUsages: Array<PromotionProductUsage>
}
```

**Key Differences from PromotionCodeStats**:
- Product-level details instead of email-level details
- Includes EAN13 (European Article Number for product identification)
- Tracks both total amount and reduction per product (tax included)
- Used for official pharmacy reports

### 2. Gateway Extension

**File**: `src/core/gateways/promotionGateway.ts`

Extend the existing `PromotionGateway` interface:

```typescript
export interface PromotionGateway {
  // ... existing methods
  getStats(uuid: UUID): Promise<PromotionStats>
  exportStatsPDF(uuid: UUID): Promise<Blob>
}
```

## Use Cases (TDD Approach)

### 3. Get Promotion Stats Use Case

**Files**:
- `src/core/usecases/promotions/get-promotion-stats/getPromotionStats.ts`
- `src/core/usecases/promotions/get-promotion-stats/getPromotionStats.spec.ts`

**Responsibility**: Load promotion statistics from gateway and save to store

**Test Cases**:
1. Should load stats for a promotion and save in store
2. Should handle loading states correctly
3. Should handle different promotions with different stats
4. Should handle promotions with no usage (zero stats)

### 4. Export Promotion Stats PDF Use Case

**Files**:
- `src/core/usecases/promotions/export-promotion-stats-pdf/exportPromotionStatsPDF.ts`
- `src/core/usecases/promotions/export-promotion-stats-pdf/exportPromotionStatsPDF.spec.ts`

**Responsibility**: Download PDF blob from backend and trigger browser download

**Test Cases**:
1. Should call gateway to get PDF blob
2. Should return blob with correct type
3. Should handle loading states

## Adapters Layer

### 5. Gateway Implementations

#### InMemoryPromotionGateway

**File**: `src/adapters/secondary/promotion-gateways/InMemoryPromotionGateway.ts`

Add methods:
- `getStats(uuid: UUID): Promise<PromotionStats>`
- `exportStatsPDF(uuid: UUID): Promise<Blob>`
- `feedStatsFor(uuid: UUID, stats: PromotionStats)` (for testing)

#### RealPromotionGateway

**File**: `src/adapters/secondary/promotion-gateways/RealPromotionGateway.ts`

Implement API calls:
- `GET ${this.baseUrl}/promotions/${uuid}/stats`
- `GET ${this.baseUrl}/promotions/${uuid}/stats/pdf` (with responseType: 'blob')

### 6. Store Updates

**File**: `src/store/promotionStore.ts`

Add to store state:
```typescript
stats: PromotionStats | null
```

Add action:
```typescript
setStats(stats: PromotionStats)
```

## View Models

### 7. Promotion Stats View Model

**Files**:
- `src/adapters/primary/view-models/promotions/promotion-stats/promotionStatsVM.ts`
- `src/adapters/primary/view-models/promotions/promotion-stats/promotionStatsVM.spec.ts`

**Transformation**:
```typescript
export interface PromotionStatsVM {
  usageCount: number
  totalSales: string // Formatted with currency
  totalSalesRaw: number
  totalDiscountGiven: string // Formatted with currency
  totalDiscountGivenRaw: number
  productUsages: Array<{
    productUuid: UUID
    name: string
    ean13: string
    usageCount: number
    totalAmountTaxIncluded: string // Formatted
    totalReductionTaxIncluded: string // Formatted
  }>
}
```

**Test Cases**:
1. Should format currency amounts correctly
2. Should return product usage list
3. Should handle zero stats
4. Should return null when stats are undefined

## Frontend Components

### 8. Stats Display Component

**File**: `src/adapters/primary/nuxt/components/molecules/PromotionStatsTable.vue`

**Props**:
- `promotionStatsVM: PromotionStatsVM`

**Features**:
- Display product-level statistics in a table
- Show columns: Product name, EAN13, Usage count, Total amount (TTC), Total reduction (TTC)
- Summary row with totals
- Empty state when no data

### 9. Update Promotion Detail Page

**File**: `src/adapters/primary/nuxt/pages/promotions/get/[uuid].vue`

**Changes**:
- Add stats section below promotion details
- Call `getPromotionStats` use case on mount
- Display `PromotionStatsTable` component
- Add "Export PDF" button
- Use Pug templates
- Use i18n for all text (no raw text)

**Example structure**:
```pug
.stats-section
  h2 {{ $t('promotions.stats.title') }}
  ft-button(@click="exportPDF") {{ $t('promotions.stats.export_pdf') }}
  promotion-stats-table(:promotion-stats-vm="statsVM")
```

## PDF Generation Strategy

### Backend Responsibility (Recommended)

**Why Backend**:
- Consistent formatting across all clients
- Better for official documents (pharmacy reports)
- Easier to maintain and version
- Can include pharmacy logo, official headers
- Server-side rendering for complex layouts
- No client-side dependencies

**Pattern** (same as delivery labels):
- Backend generates PDF with all formatting
- Returns Blob with `Content-Type: application/pdf`
- Frontend downloads using browser APIs
- Set appropriate filename: `promotion-{name}-stats-{date}.pdf`

**Endpoint**: `GET /promotions/{uuid}/stats/pdf`

## Test Data

### 10. Create Test Data

**File**: `src/utils/testData/promotionStats.ts`

Example test data:
```typescript
export const summerPromotionStats: PromotionStats = {
  usageCount: 45,
  totalSales: 567890, // in cents
  totalDiscountGiven: 56789, // in cents
  productUsages: [
    {
      productUuid: 'product-1',
      name: 'Doliprane 1000mg',
      ean13: '3400936403444',
      usageCount: 25,
      totalAmountTaxIncluded: 312500,
      totalReductionTaxIncluded: 31250
    },
    {
      productUuid: 'product-2',
      name: 'Efferalgan 500mg',
      ean13: '3400935896674',
      usageCount: 20,
      totalAmountTaxIncluded: 255390,
      totalReductionTaxIncluded: 25539
    }
  ]
}

export const noUsagePromotionStats: PromotionStats = {
  usageCount: 0,
  totalSales: 0,
  totalDiscountGiven: 0,
  productUsages: []
}
```

## Implementation Order (TDD)

Following TDD methodology strictly:

1. **Create entity and test data**
   - Define PromotionStats interface
   - Create test data

2. **Use Case: Get Promotion Stats**
   - Write failing test for getPromotionStats
   - Implement minimal code to pass
   - Refactor and verify tests still pass
   - Add next test (loading states)
   - Repeat until complete

3. **Gateway Layer**
   - Write tests for InMemory gateway stats methods
   - Implement InMemory gateway
   - Write tests for Real gateway (mock axios)
   - Implement Real gateway

4. **Store Updates**
   - Write tests for stats state and actions
   - Implement store changes

5. **View Model**
   - Write failing test for view model transformation
   - Implement minimal code to pass
   - Add formatting tests
   - Implement formatting

6. **Use Case: Export PDF**
   - Write failing test for exportStatsPDF
   - Implement minimal code to pass
   - Test blob download

7. **UI Components**
   - Create stats table component
   - Update promotion detail page
   - Add i18n keys

8. **Integration Testing**
   - Test complete flow from UI to backend
   - Verify PDF download works

## i18n Keys

**File**: `src/locales/fr.json` (or appropriate locale file)

```json
{
  "promotions": {
    "stats": {
      "title": "Statistiques de la promotion",
      "product_name": "Produit",
      "ean13": "EAN13",
      "usage_count": "Nombre d'utilisations",
      "total_amount_tax_included": "Montant total TTC",
      "total_reduction_tax_included": "Réduction totale TTC",
      "export_pdf": "Exporter en PDF",
      "no_data": "Aucune donnée disponible",
      "summary": "Résumé",
      "total_usage": "Total des utilisations",
      "total_sales": "Ventes totales",
      "total_discount": "Réduction totale accordée"
    }
  }
}
```

## Backend Requirements

The backend must implement:

1. **GET /promotions/{uuid}/stats**
   - Returns JSON with PromotionStats structure
   - Calculate statistics from order data
   - Filter by promotion UUID
   - Include all products that had this promotion applied

2. **GET /promotions/{uuid}/stats/pdf**
   - Returns PDF blob (Content-Type: application/pdf)
   - Include pharmacy header/logo
   - Professional layout suitable for official reports
   - Include: promotion name, period, product details, totals
   - Filename suggestion: `Content-Disposition: attachment; filename="promotion-{name}-stats-{date}.pdf"`

## Key Differences from Promotion Code Stats

| Feature | Promotion Code Stats | Promotion Stats |
|---------|---------------------|-----------------|
| Tracking by | Email address | Product (EAN13) |
| Use case | Customer usage tracking | Official pharmacy reports |
| PDF export | No | Yes (required for reports) |
| Data granularity | Email usage count | Product sales & reductions |
| Tax included | Not specified | Always tax included |
| Official document | No | Yes |

## Testing Strategy

- **ONE EXPECT PER TEST** (absolute rule)
- Compare full objects with `toStrictEqual()`
- Use InMemory gateway pattern (no mocks)
- Run tests with `TZ=UTC pnpm test run <test-suite>`
- Test both success and edge cases
- Verify loading states

## Success Criteria

- All tests passing with TDD approach
- PDF export working on frontend
- Stats display correctly formatted
- i18n used for all text
- No TypeScript errors
- Follows existing architectural patterns
- Backend integration successful
