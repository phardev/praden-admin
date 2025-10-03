# 📋 Specification: Add Staff Member Creation

## 🎯 Goal
Allow users to add new staff members with:
- **Required**: email, role (UUID)
- **Optional**: firstname, lastname

## 📐 Architecture Analysis

**Current State:**
- ✅ Staff entity exists with correct structure (email required, firstname/lastname optional)
- ✅ StaffStore with actions: `list()`, `setCurrent()`, `update()`, `startLoading()`, `stopLoading()`
- ✅ InMemoryStaffGateway and RealStaffGateway with `list()` and `assignRole()`
- ❌ Missing: `create()` method in gateways
- ❌ Missing: `add()` action in StaffStore
- ❌ Missing: `createStaff` usecase
- ❌ Missing: Staff form ViewModel
- ❌ Missing: UI components for staff creation

## 🧪 TDD Implementation Steps

### **PHASE 1: Core Layer (Usecase + Gateway Interface)**

#### 1.1 Create test file: `src/core/usecases/staff/staff-creation/createStaff.spec.ts`
**Test scenarios (Given/When/Then):**
- ✅ Create staff with all fields (email, firstname, lastname, roleUuid)
- ✅ Create staff with only required fields (email, roleUuid)
- ✅ Create staff with optional fields (group: email + firstname only, email + lastname only)
- ✅ Verify staff saved in store
- ✅ Verify staff saved in gateway
- ✅ Verify loading states (start/stop)
- ❌ One expect per test, use `toStrictEqual()` for full objects

#### 1.2 Update `src/core/gateways/staffGateway.ts`
Add to interface:
```typescript
export type CreateStaffDTO = Pick<Staff, 'email' | 'firstname' | 'lastname'> & {
  roleUuid: UUID
}

create(dto: CreateStaffDTO): Promise<Staff>
```

#### 1.3 Create usecase: `src/core/usecases/staff/staff-creation/createStaff.ts`
```typescript
export const createStaff = async (
  dto: CreateStaffDTO,
  staffGateway: StaffGateway,
  roleGateway: RoleGateway
): Promise<void> => {
  const staffStore = useStaffStore()
  try {
    staffStore.startLoading()
    const created = await staffGateway.create(dto)
    staffStore.add(created)
  } finally {
    staffStore.stopLoading()
  }
}
```

### **PHASE 2: Infrastructure Layer**

#### 2.1 Update `src/store/StaffStore.ts`
Add action:
```typescript
add(staff: Staff) {
  this.items.push(staff)
}
```

#### 2.2 Update `src/adapters/secondary/staff-gateways/InMemoryStaffGateway.ts`
```typescript
async create(dto: CreateStaffDTO): Promise<Staff> {
  const role = this.roles.find(r => r.uuid === dto.roleUuid)
  if (!role) throw new Error(`Role with UUID ${dto.roleUuid} not found`)

  const newStaff: Staff = {
    uuid: this.uuidGenerator.generate(),
    email: dto.email,
    firstname: dto.firstname,
    lastname: dto.lastname,
    role
  }
  this.staff.push(newStaff)
  return JSON.parse(JSON.stringify(newStaff))
}
```

#### 2.3 Update `src/adapters/secondary/staff-gateways/RealStaffGateway.ts`
```typescript
async create(dto: CreateStaffDTO): Promise<Staff> {
  const res = await axiosWithBearer.post(`${this.baseUrl}/staff`, dto)
  return res.data.item
}
```

### **PHASE 3: Presentation Layer (ViewModel)**

#### 3.1 Create test: `src/adapters/primary/view-models/staff/staff-form/staffFormCreateVM.spec.ts`
Test scenarios:
- ✅ Initialize form with empty values
- ✅ Set/get email field
- ✅ Set/get firstname field (optional)
- ✅ Set/get lastname field (optional)
- ✅ Set/get roleUuid field
- ✅ Validate form (email + roleUuid required)
- ✅ Get DTO with all fields
- ✅ Get DTO with only required fields

#### 3.2 Create `src/adapters/primary/view-models/staff/staff-form/staffFormVM.ts`
Base class for form logic (similar to RoleFormVM pattern)

#### 3.3 Create `src/adapters/primary/view-models/staff/staff-form/staffFormCreateVM.ts`
```typescript
export class StaffFormCreateVM {
  // Field management
  // Validation: email + roleUuid required
  // getDto(): CreateStaffDTO
  // getCanValidate(): boolean
}

export const staffFormCreateVM = (key: string): StaffFormCreateVM
```

### **PHASE 4: View Layer (UI Components)**

#### 4.1 Create `src/adapters/primary/nuxt/components/organisms/StaffFormModal.vue`
Modal component for staff creation (similar to RoleFormModal):
- Email input (required)
- Firstname input (optional)
- Lastname input (optional)
- Role select (required, use existing FtRoleSelect)
- Validation
- Loading states
- Success/error handling

#### 4.2 Update `src/adapters/primary/nuxt/pages/staff/index.vue`
Add:
- "Add Staff" button in staff list tab
- Modal integration
- Handle create staff event
- Call `createStaff` usecase
- Refresh staff list after creation

### **PHASE 5: Integration & Testing**

#### 5.1 Run all tests
```bash
TZ=UTC pnpm test src/core/usecases/staff/
TZ=UTC pnpm test src/adapters/primary/view-models/staff/
```

#### 5.2 Manual testing checklist
- [ ] Create staff with all fields
- [ ] Create staff with only email + role
- [ ] Verify validation works
- [ ] Check staff appears in list
- [ ] Verify loading states
- [ ] Test error scenarios

## 🔄 TDD Workflow Per File

For EACH file:
1. **Write test** → RED
2. **Run test** → verify it fails
3. **Write minimal code** → GREEN
4. **Run test** → verify it passes
5. **Refactor if needed**
6. **Run test again** → still GREEN
7. **Next test**

## 📝 Key Constraints

- ✅ NO comments in code
- ✅ ONE expect per test
- ✅ Use `toStrictEqual()` for objects
- ✅ NO mocks (InMemory pattern)
- ✅ Usecases return `Promise<void>`
- ✅ ViewModels read-only from store
- ✅ Inject gateways explicitly
- ✅ Extract functions instead of comments
- ✅ Use `Pick<>` utility type for DTO when possible

## 📂 Files to Create/Modify

**Create (6 files):**
1. `src/core/usecases/staff/staff-creation/createStaff.spec.ts`
2. `src/core/usecases/staff/staff-creation/createStaff.ts`
3. `src/adapters/primary/view-models/staff/staff-form/staffFormVM.ts`
4. `src/adapters/primary/view-models/staff/staff-form/staffFormCreateVM.ts`
5. `src/adapters/primary/view-models/staff/staff-form/staffFormCreateVM.spec.ts`
6. `src/adapters/primary/nuxt/components/organisms/StaffFormModal.vue`

**Modify (5 files):**
7. `src/core/gateways/staffGateway.ts` (add CreateStaffDTO + create method)
8. `src/store/StaffStore.ts` (add `add()` action)
9. `src/adapters/secondary/staff-gateways/InMemoryStaffGateway.ts` (implement create)
10. `src/adapters/secondary/staff-gateways/RealStaffGateway.ts` (implement create)
11. `src/adapters/primary/nuxt/pages/staff/index.vue` (add modal + button)

## 📋 Test Structure Example

```typescript
describe('Create staff', () => {
  // Setup...

  describe('With all fields', () => {
    const dto: CreateStaffDTO = {
      email: 'john.doe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      roleUuid: 'admin-role-uuid'
    }

    beforeEach(async () => {
      await whenCreateStaff(uuid, dto)
    })

    it('should save the staff in the store', () => {
      expect(staffStore.items).toStrictEqual([expectedStaff])
    })

    it('should save the staff in the gateway', async () => {
      expect(await staffGateway.list()).toStrictEqual([expectedStaff])
    })
  })

  describe('With only required fields', () => {
    const dto: CreateStaffDTO = {
      email: 'jane@example.com',
      roleUuid: 'user-role-uuid'
    }
    // Tests...
  })

  describe('With optional fields', () => {
    describe('Email and firstname only', () => {
      // Test...
    })

    describe('Email and lastname only', () => {
      // Test...
    })
  })
})
```