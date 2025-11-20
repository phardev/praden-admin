# Invoice Backend PDF Migration Plan

## Problem Statement & Objectives

### Current State
- Frontend generates and displays invoice HTML using Vue components
- Invoice printing is handled via browser's `window.print()` during order preparation
- Invoice display is available at `/invoices/[invoiceNumber]` route
- Invoice creation happens when preparation is validated or canceled

### Target State
- Backend is responsible for generating invoice PDFs
- Invoices are automatically sent by email (no more manual printing)
- Invoice viewing triggers PDF download instead of HTML page display
- Invoice PDF creation remains triggered at preparation validation/cancellation

### Key Objectives
1. Eliminate manual invoice printing from the preparation workflow
2. Enable automatic email delivery of invoices
3. Simplify invoice viewing to PDF download
4. Maintain existing business logic for invoice creation timing

## Technical Approach

### Architecture Decisions

1. **Invoice Gateway Enhancement**
   - Extend `InvoiceGateway` interface to include PDF download capability
   - Add `downloadPdf(invoiceNumber: string): Promise<Blob>` method
   - Keep existing `create()` and `get()` methods for backward compatibility

2. **Backend API Integration**
   - Backend generates PDF when invoice is created (during preparation validation/cancellation)
   - New endpoint: `GET /invoices/{invoiceNumber}/pdf` returns PDF blob
   - Backend handles email sending automatically upon invoice creation

3. **Frontend Simplification**
   - Remove invoice HTML component from preparation page printing flow
   - Replace invoice display page with PDF download trigger
   - Remove invoice-related print styles and media queries

## Step-by-Step Implementation Guide

### Phase 1: Gateway Enhancement

#### 1.1 Update Core Gateway Interface
```typescript
// src/core/gateways/invoiceGateway.ts
export interface InvoiceGateway {
  get(invoiceNumber: string): Promise<Invoice>
  create(order: Order): Promise<Invoice>
  downloadPdf(invoiceNumber: string): Promise<Blob> // NEW
}
```

#### 1.2 Implement InMemory Gateway
```typescript
// src/adapters/secondary/invoice-gateways/InMemoryInvoiceGateway.ts
downloadPdf(invoiceNumber: string): Promise<Blob> {
  // Return mock PDF blob for testing
  const mockPdf = new Blob(['Mock PDF content'], { type: 'application/pdf' })
  return Promise.resolve(mockPdf)
}
```

#### 1.3 Implement Real Gateway
```typescript
// src/adapters/secondary/invoice-gateways/RealInvoiceGateway.ts
async downloadPdf(invoiceNumber: string): Promise<Blob> {
  const response = await axiosWithBearer.get(
    `${this.baseUrl}/invoices/${encodeURIComponent(invoiceNumber)}/pdf`,
    { responseType: 'blob' }
  )
  return response.data
}
```

### Phase 2: Create Download Usecase

#### 2.1 Create Invoice PDF Download Usecase
```typescript
// src/core/usecases/invoices/download-invoice-pdf/downloadInvoicePdf.ts
import { InvoiceGateway } from '@core/gateways/invoiceGateway'

export const downloadInvoicePdf = async (
  invoiceNumber: string,
  invoiceGateway: InvoiceGateway
) => {
  const blob = await invoiceGateway.downloadPdf(invoiceNumber)

  // Create download link
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `facture-${invoiceNumber}.pdf`
  link.click()

  // Cleanup
  window.URL.revokeObjectURL(url)
}
```

#### 2.2 Create Tests
```typescript
// src/core/usecases/invoices/download-invoice-pdf/downloadInvoicePdf.spec.ts
describe('Download invoice PDF', () => {
  // Test successful download
  // Test error handling
})
```

### Phase 3: Update Invoice Display Page

#### 3.1 Replace Invoice Display with Download
```vue
// src/adapters/primary/nuxt/pages/invoices/[invoiceNumber].vue
<template lang="pug">
.section
  .flex.flex-col.items-center.justify-center.h-64
    p.text-lg.mb-4 {{ $t('invoice.downloading') }}
    ft-spinner
</template>

<script lang="ts" setup>
import { downloadInvoicePdf } from '@core/usecases/invoices/download-invoice-pdf/downloadInvoicePdf'
import { useInvoiceGateway } from '../../../../../../gateways/invoiceGateway'

definePageMeta({ layout: 'main' })

onMounted(async () => {
  const route = useRoute()
  const router = useRouter()
  const invoiceNumber = decodeURIComponent(route.params.invoiceNumber)

  try {
    await downloadInvoicePdf(invoiceNumber, useInvoiceGateway())
    // Redirect back to orders or preparations after download
    router.push('/orders')
  } catch (error) {
    console.error('Failed to download invoice:', error)
    // Handle error - show notification
  }
})
</script>
```

### Phase 4: Remove Printing from Preparation Flow

#### 4.1 Update Preparation Validation
```typescript
// src/adapters/primary/nuxt/pages/preparations/[uuid].vue
// Remove these lines:
// - invoice.hidden.printme.mx-2 (line 2)
// - window.print() calls after validation (lines 178, 189, 242)
// - Invoice component inclusion
```

#### 4.2 Update Validation Flow
```typescript
const validate = async () => {
  closeActionsModal()

  // Handle manual print for delivery label if needed
  if (useManualPrint) {
    // ... existing delivery label logic ...
  }

  // Just validate without printing invoice
  await validatePreparation(useOrderGateway(), useInvoiceGateway())

  router.push('/preparations')
}

const cancel = async () => {
  closeActionsModal()
  await cancelPreparation(useOrderGateway(), useInvoiceGateway())
  router.push('/preparations')
}
```

### Phase 5: Cleanup

#### 5.1 Remove Unused Components
- Delete `src/adapters/primary/nuxt/components/organisms/Invoice.vue` (if no longer needed elsewhere)
- Remove invoice-related view models if only used for display

#### 5.2 Update Localization
```yaml
# Add new translations
invoice:
  downloading: "Téléchargement de la facture en cours..."
  downloadError: "Erreur lors du téléchargement de la facture"
```

#### 5.3 Remove Print Styles
- Remove invoice-specific print media queries
- Clean up unused CSS classes related to invoice printing

## Testing Strategy

### Unit Tests
1. **Gateway Tests**
   - Test `downloadPdf` method in both InMemory and Real implementations
   - Test error handling (invoice not found, network errors)

2. **Usecase Tests**
   - Test successful PDF download
   - Test blob creation and cleanup
   - Test error propagation

### Integration Tests
1. **Preparation Flow**
   - Validate preparation creates invoice without printing
   - Cancel preparation creates invoice without printing
   - Verify email is sent (backend responsibility)

2. **Invoice Access**
   - Navigate to invoice URL triggers download
   - Error handling for invalid invoice numbers

### Manual Testing Checklist
- [ ] Validate order preparation without invoice printing
- [ ] Cancel order preparation without invoice printing
- [ ] Access invoice URL triggers PDF download
- [ ] Downloaded PDF opens correctly
- [ ] Email with invoice PDF is received (backend)
- [ ] Error messages display appropriately

## Potential Challenges & Solutions

### Challenge 1: Browser Download Blockers
**Problem**: Some browsers may block automatic downloads
**Solution**:
- Show a fallback UI with a manual download button
- Display the PDF in a new tab as alternative

### Challenge 2: Large PDF Files
**Problem**: Large invoices may take time to download
**Solution**:
- Add loading indicator during download
- Implement progress tracking if backend supports it
- Consider PDF compression on backend

### Challenge 3: Backward Compatibility
**Problem**: Existing invoices may need to be viewable
**Solution**:
- Keep the view model for potential future use
- Implement a migration period where both HTML and PDF are available

### Challenge 4: Testing PDF Generation
**Problem**: Cannot test actual PDF content in frontend
**Solution**:
- Mock PDF blobs in tests
- Rely on backend tests for PDF content validation
- Add contract tests between frontend and backend

## Success Criteria

1. **Functional Requirements**
   - ✅ Invoices are no longer printed during preparation
   - ✅ Invoice PDF can be downloaded from invoice page
   - ✅ Backend sends invoice via email automatically
   - ✅ Invoice creation timing unchanged (validation/cancellation)

2. **Non-Functional Requirements**
   - ✅ PDF download completes within 3 seconds
   - ✅ Error handling provides clear user feedback
   - ✅ No regression in preparation workflow performance
   - ✅ All tests pass with >90% coverage

3. **User Experience**
   - ✅ Preparation workflow is simplified
   - ✅ Invoice access is intuitive
   - ✅ Error messages are helpful
   - ✅ Loading states are clear

## Migration Plan

### Rollout Strategy
1. **Phase 1**: Deploy backend changes (PDF generation, email sending)
2. **Phase 2**: Deploy frontend with feature flag
3. **Phase 3**: Test with internal users
4. **Phase 4**: Gradual rollout to all users
5. **Phase 5**: Remove old invoice display code

### Rollback Plan
- Feature flag to revert to HTML display
- Keep old code for 2 weeks after full rollout
- Monitor error rates and user feedback

## Dependencies

### Backend Requirements
- PDF generation endpoint (`GET /invoices/{id}/pdf`)
- Automatic email sending on invoice creation
- PDF generation library integration
- Email template for invoice delivery

### Frontend Dependencies
- No new npm packages required
- Existing axios for API calls
- Existing blob handling utilities

## Timeline Estimate

- **Gateway Enhancement**: 2 hours
- **Download Usecase**: 2 hours
- **Update Invoice Page**: 1 hour
- **Remove Printing Logic**: 2 hours
- **Testing**: 3 hours
- **Cleanup & Documentation**: 2 hours

**Total Estimate**: 12 hours (1.5 days)

## Notes

- Coordinate with backend team for API readiness
- Ensure email templates are approved by business
- Consider A/B testing for user acceptance
- Monitor performance metrics post-deployment