# Shop Home Management Specification

## Overview
Implement comprehensive shop home page management functionality to control four key elements displayed on the e-commerce website: announcement bar, category display order, pharmacist product selection, and emergency pharmacy information.

## Requirements

### Functional Requirements
1. **Announcement Bar Management**: Single announcement with text, active status, and optional date range
2. **Category Order Management**: Drag-and-drop reordering of product categories
3. **Pharmacist Selection Management**: Manage featured products list with ordering
4. **Emergency Pharmacy Management**: Maintain and schedule on-duty pharmacy information

### Non-Functional Requirements
- Follow hexagonal architecture patterns
- Implement TDD methodology (tests first)
- Type-safe implementation with TypeScript
- Zero warnings tolerance (linting)
- Consistent with existing patterns (banners, roles, etc.)
- All UI text via i18n (no hardcoded strings)

## Architecture Design

### Core Layer - New Entities

#### 1. AnnouncementBar Entity
```typescript
interface AnnouncementBar {
  uuid: UUID
  text: string
  isActive: boolean
  startDate?: Timestamp
  endDate?: Timestamp
}
```
Helper functions:
- `isAnnouncementBarStarted(announcementBar, now)`
- `isAnnouncementBarEnded(announcementBar, now)`
- `isAnnouncementBarInProgress(announcementBar, now)`

#### 2. PharmacistSelection Entity
```typescript
interface PharmacistSelection {
  productUuids: Array<UUID>
}
```
Note: Backend endpoint already exists at `/products/selection`

#### 3. EmergencyPharmacy Entity
```typescript
interface EmergencyPharmacy {
  uuid: UUID
  name: string
  address: string
  phone: string
  date: Timestamp
  isActive: boolean
}
```

#### 4. Category Entity Extension
Add field: `order: number` (following Banner pattern)

### Gateway Interfaces

#### AnnouncementBarGateway
```typescript
interface AnnouncementBarGateway {
  get(): Promise<AnnouncementBar>
  update(dto: UpdateAnnouncementBarDTO): Promise<AnnouncementBar>
}
```

#### PharmacistSelectionGateway
```typescript
interface PharmacistSelectionGateway {
  get(): Promise<PharmacistSelection>
  update(productUuids: Array<UUID>): Promise<PharmacistSelection>
}
```

#### EmergencyPharmacyGateway
```typescript
interface EmergencyPharmacyGateway {
  list(): Promise<Array<EmergencyPharmacy>>
  create(dto: CreateEmergencyPharmacyDTO): Promise<EmergencyPharmacy>
  edit(uuid: UUID, dto: EditEmergencyPharmacyDTO): Promise<EmergencyPharmacy>
  delete(uuid: UUID): Promise<void>
  get(uuid: UUID): Promise<EmergencyPharmacy>
}
```

#### CategoryGateway Extension
Add method: `reorder(categoryUuids: Array<UUID>): Promise<Array<Category>>`

### Use Cases (TDD Implementation)

#### Announcement Bar
1. **getAnnouncementBar**
   - Retrieve current announcement bar
   - Store in announcementBarStore

2. **updateAnnouncementBar**
   - Input: UpdateAnnouncementBarDTO (text, isActive, startDate?, endDate?)
   - Validation: text required
   - Update store after successful API call

#### Category Order
1. **reorderCategories**
   - Input: Array<UUID> in desired order
   - Pattern: Follow `reorderBanners` implementation
   - Update categoryStore with reordered list

#### Pharmacist Selection
1. **getPharmacistSelection**
   - Retrieve current product UUIDs list
   - Store in pharmacistSelectionStore

2. **updatePharmacistSelection**
   - Input: Array<UUID> (ordered product list)
   - Backend handles product fetching
   - Update store after successful API call

#### Emergency Pharmacy
1. **listEmergencyPharmacies**
   - Retrieve all emergency pharmacies
   - Backend filters by active dates
   - Store in emergencyPharmacyStore

2. **createEmergencyPharmacy**
   - Input: CreateEmergencyPharmacyDTO
   - Validation: name, address, phone, date required
   - Add to store after creation

3. **editEmergencyPharmacy**
   - Input: uuid, EditEmergencyPharmacyDTO
   - Update existing pharmacy
   - Refresh store

4. **deleteEmergencyPharmacy**
   - Input: uuid
   - Remove from backend and store

5. **getEmergencyPharmacy**
   - Input: uuid
   - Retrieve single pharmacy for editing

### Adapters Layer

#### Secondary Adapters
1. **InMemory Gateways** (for testing)
   - InMemoryAnnouncementBarGateway
   - InMemoryPharmacistSelectionGateway
   - InMemoryEmergencyPharmacyGateway
   - Update InMemoryCategoryGateway with reorder

2. **Real Gateways** (API integration)
   - RealAnnouncementBarGateway
   - RealPharmacistSelectionGateway
   - RealEmergencyPharmacyGateway
   - Update RealCategoryGateway with reorder

3. **Pinia Stores**
   - announcementBarStore.ts
   - pharmacistSelectionStore.ts
   - emergencyPharmacyStore.ts
   - Update categoryStore.ts with reorder support

#### Primary Adapters - View Models

1. **Announcement Bar**
   - getAnnouncementBarVM: Transform for display
   - announcementBarFormVM: Form state management

2. **Category Order**
   - Update getTreeCategoriesVM: Include order field
   - reorderCategoriesVM: Handle drag-drop state

3. **Pharmacist Selection**
   - getPharmacistSelectionVM: Get products with selection
   - pharmacistSelectionVM: Manage list + reordering

4. **Emergency Pharmacy**
   - getEmergencyPharmaciesVM: List pharmacies grouped by date
   - emergencyPharmacyFormCreateVM: Create form
   - emergencyPharmacyFormEditVM: Edit form
   - emergencyPharmacyFormGetVM: Get form

### UI Layer

#### Page Structure
```
/shop-management/
  ├── index.vue                           # Overview/dashboard page
  ├── announcement-bar.vue                # Single announcement editor
  ├── category-order.vue                  # Drag-drop category list
  ├── pharmacist-selection.vue            # Product selection manager
  └── emergency-pharmacies/
      ├── index.vue                       # List by date
      ├── new.vue                         # Create pharmacy
      └── edit/[uuid].vue                 # Edit pharmacy
```

#### Component Structure

**Organisms:**
- `AnnouncementBarForm.vue` - Text editor with date range picker
- `CategoryOrderList.vue` - Draggable category list (pattern: BannersList.vue)
- `PharmacistSelectionManager.vue` - Product search + ordered list with drag-drop
- `EmergencyPharmacyForm.vue` - Pharmacy information form
- `EmergencyPharmaciesList.vue` - List grouped by date with cards

**Molecules:**
- `CategoryOrderItem.vue` - Drag handle + category name/miniature
- `PharmacistSelectionItem.vue` - Product card in selection list
- `EmergencyPharmacyCard.vue` - Pharmacy details card with date

**Atoms:**
- Reuse existing atoms (FtInput, FtButton, FtDatePicker, etc.)

#### Technical Implementation
- Use `vuedraggable` for all reordering features
- Follow atomic design methodology
- All text via i18n (no hardcoded strings)
- Use existing form patterns from categories/banners

## I18n Translations

Add to `i18n/locales/fr.json`:

```json
"shopManagement": {
  "title": "Gestion de la boutique",
  "overview": {
    "title": "Vue d'ensemble",
    "announcementBarCard": "Barre d'annonce",
    "categoryOrderCard": "Ordre des catégories",
    "pharmacistSelectionCard": "Sélection du pharmacien",
    "emergencyPharmaciesCard": "Pharmacies de garde"
  },
  "announcementBar": {
    "title": "Barre d'annonce",
    "text": "Texte de l'annonce",
    "isActive": "Annonce active",
    "startDate": "Date de début",
    "endDate": "Date de fin",
    "updateSuccess": "Annonce mise à jour avec succès",
    "updateError": "Erreur lors de la mise à jour de l'annonce"
  },
  "categoryOrder": {
    "title": "Ordre des catégories",
    "description": "Glissez-déposez les catégories pour modifier leur ordre d'affichage",
    "dragToReorder": "Glisser pour réorganiser",
    "reorderSuccess": "Ordre des catégories mis à jour",
    "reorderError": "Erreur lors de la réorganisation"
  },
  "pharmacistSelection": {
    "title": "Sélection du pharmacien",
    "description": "Gérez les produits mis en avant sur la page d'accueil",
    "addProduct": "Ajouter un produit",
    "removeProduct": "Retirer",
    "reorder": "Réorganiser",
    "searchPlaceholder": "Rechercher un produit...",
    "updateSuccess": "Sélection mise à jour",
    "updateError": "Erreur lors de la mise à jour"
  },
  "emergencyPharmacies": {
    "title": "Pharmacies de garde",
    "create": "Ajouter une pharmacie de garde",
    "edit": "Modifier la pharmacie de garde",
    "delete": "Supprimer",
    "name": "Nom de la pharmacie",
    "address": "Adresse",
    "phone": "Téléphone",
    "date": "Date de garde",
    "isActive": "Active",
    "createSuccess": "Pharmacie de garde créée",
    "updateSuccess": "Pharmacie de garde mise à jour",
    "deleteSuccess": "Pharmacie de garde supprimée",
    "deleteConfirm": "Êtes-vous sûr de vouloir supprimer cette pharmacie de garde ?",
    "groupedByDate": "Pharmacies par date"
  }
}
```

## Navigation Integration

Update navigation menu to add "Gestion boutique" section:

```typescript
{
  name: 'Gestion boutique',
  icon: 'i-heroicons-home',
  children: [
    { name: 'Vue d\'ensemble', path: '/shop-management' },
    { name: 'Barre d\'annonce', path: '/shop-management/announcement-bar' },
    { name: 'Ordre des catégories', path: '/shop-management/category-order' },
    { name: 'Sélection du pharmacien', path: '/shop-management/pharmacist-selection' },
    { name: 'Pharmacies de garde', path: '/shop-management/emergency-pharmacies' }
  ]
}
```

## TDD Implementation Workflow

For each feature, follow this cycle:

### 1. Entities (Red → Green → Refactor)
- Write entity interface and helper functions
- Add tests for helper functions
- Run tests: `TZ=UTC pnpm test-once`

### 2. Use Cases (Red → Green → Refactor)
- Write test for use case
- Implement minimal code to pass
- Refactor if needed
- Verify: `TZ=UTC pnpm test-once`

### 3. View Models (Red → Green → Refactor)
- Write VM tests
- Implement VM logic
- Refactor
- Verify tests pass

### 4. Integration
- Build UI components
- Test manually
- Run full test suite
- Verify zero warnings: `pnpm lint`

## Testing Strategy

### Unit Tests
- Entity helper functions
- Use case logic
- View model transformations
- Gateway implementations

### Testing Rules
- One expect per test
- Compare full objects (not individual fields)
- Use InMemory gateways (avoid mocks)
- Inject dateProvider (never use Date.now())
- Never use expect.any()

### Test Data
- Create realistic test data in `src/utils/testData/`
- Reuse existing patterns where possible

## Implementation Order

1. **Phase 1: Core Layer**
   - Create entities (AnnouncementBar, PharmacistSelection, EmergencyPharmacy)
   - Extend Category with order field
   - Create gateway interfaces
   - Write entity tests

2. **Phase 2: Use Cases (TDD)**
   - Announcement Bar use cases + tests
   - Category reorder use case + tests
   - Pharmacist Selection use cases + tests
   - Emergency Pharmacy use cases + tests

3. **Phase 3: Adapters**
   - InMemory gateways
   - Real gateways
   - Pinia stores
   - Test data utilities

4. **Phase 4: View Models (TDD)**
   - Create all view models with tests
   - Follow existing patterns (banners, roles)

5. **Phase 5: UI Components**
   - Build pages and organisms
   - Add i18n translations
   - Integrate with navigation

6. **Phase 6: Integration Testing**
   - Manual testing of all features
   - Run full test suite
   - Verify linting passes
   - Build verification

## Key Technical Decisions

✅ **Pharmacist Selection**: Store only UUIDs array, backend handles product fetching
✅ **Category Order**: Add `order` field to Category entity (like Banner pattern)
✅ **Announcement Bar**: Single instance (not multiple like banners)
✅ **Emergency Pharmacy**: Reusable pharmacies with date assignment, backend filters active
✅ **Reordering**: Use vuedraggable pattern from BannersList.vue
✅ **Code Style**: No comments - extract functions for clarity
✅ **Testing**: One expect per test, compare full objects
✅ **Date Handling**: Inject dateProvider, never use Date.now()

## Success Criteria

- [ ] All entities created with proper TypeScript types
- [ ] All use cases implemented with passing tests
- [ ] All view models created with passing tests
- [ ] All UI components functional with proper i18n
- [ ] Navigation integrated correctly
- [ ] Full test suite passes: `TZ=UTC pnpm test-once`
- [ ] Linting passes with zero warnings: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] Manual testing confirms all features work as expected
