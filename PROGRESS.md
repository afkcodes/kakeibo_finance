# Kakeibo v2 Migration - Progress Report & Continuation Guide

**Last Updated**: December 25, 2024  
**Current Phase**: 🔄 Phase 4F - Native Screens Implementation  
**Overall Progress**: 145/191 tasks (75.9% complete)
**Native Progress**: 137/183 tasks (74.9% complete)

---

## 📋 Executive Summary

We are migrating **Kakeibo** (personal finance PWA) from a single-app structure to a **monorepo** supporting both web and native platforms. The project uses a shared core package (`@kakeibo/core`) with platform-specific implementations.

### Latest Achievement (Dec 25, 2024)
Successfully implemented **Pure Calculated Balance Architecture** and enhanced all **Native Platform Hooks**:

**Pure Calculated Balance (Native Only)**:
- ✅ Added `initialBalance` field to Account type and schema
- ✅ Created `calculateAccountBalance()` utility in @kakeibo/core
- ✅ Updated SQLiteAdapter:
  - Removed `updateAccountBalance()`, `applyTransactionBalance()`, `revertTransactionBalance()`
  - All transaction operations only modify transactions table
  - Balance calculated on-the-fly: `balance = initialBalance + sum(transactions)`
- ✅ Simplified `deleteGoal` - just deletes transactions (balance auto-corrects)
- ✅ Benefits: Self-healing, crash-safe, full audit trail, no accumulated errors

**All Native Hooks Enhanced**:
- ✅ useTransactions + useTransactionActions: Zustand invalidation, toasts, return entities
- ✅ useGoals: Zustand invalidation, toasts, return entities, progress calculations
- ✅ useCategories: Zustand invalidation, toasts, return entities, stable deps
- ✅ useBudgets: Zustand invalidation, toasts, return entities, stable deps
- ✅ useAccounts: Zustand invalidation, toasts, return entities, stable deps
- ✅ useAuth: Full migration support, MMKV storage, toast notifications

**MMKV Storage Integration Fixed**:
- ✅ Correct v4 API: `createMMKV()` not `new MMKV()`
- ✅ Correct methods: `.remove()` not `.delete()`
- ✅ PersistStorage<T> type for Zustand compatibility
- ✅ Verified against official documentation

🎯 Next: Complete remaining screens (Phase 4F)

### Previous Achievements
- ✅ All shared types, schemas, utilities (35 tasks)
- ✅ All business logic services (8 tasks)  
- ✅ Complete web database implementation (6 tasks)
- ✅ All web UI components (24 tasks)
- ✅ **All 7 web pages implemented** (13 tasks):
  - Dashboard, Transactions, Budgets, Analytics, Goals, Accounts, Settings, Welcome
- ✅ **Toast notification system** (11 tasks):
  - Toast utility, components, integration with all operations
- ✅ **Authentication system** (11 tasks):
  - Supabase OAuth, guest mode, protected routes, data migration

---

## 🏗️ Architecture Overview

### Monorepo Structure
```
kakeibo-v2/
├── packages/
│   └── core/               # Platform-agnostic code
│       ├── src/
│       │   ├── types/      # TypeScript interfaces
│       │   ├── schemas/    # Zod validation schemas
│       │   ├── constants/  # Default data, currencies
│       │   ├── utils/      # Pure functions
│       │   └── services/   # Business logic
│       │       ├── database/     # IDatabaseAdapter interface
│       │       ├── calculations/ # Budget/Goal/Stats math
│       │       └── auth/         # Guest user & OAuth
│       └── index.ts        # Single entry point
│
├── apps/
│   ├── web/               # React web app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/         # Base components (Button, Input, etc.)
│   │   │   │   ├── layout/     # AppShell, Navbar, Sidebar, etc.
│   │   │   │   └── features/   # Feature-specific components
│   │   │   ├── services/
│   │   │   │   └── db/         # DexieAdapter (IndexedDB)
│   │   │   └── routes/         # TanStack Router pages
│   │   └── package.json        # @kakeibo/web
│   │
│   └── native/            # React Native mobile app
│       ├── src/
│       │   ├── components/     # Native UI components
│       │   ├── screens/        # Navigation screens
│       │   └── services/
│       │       └── db/         # SQLiteAdapter (planned)
│       └── package.json        # @kakeibo/native
```

### Key Architectural Principles

1. **Schema vs Entity Pattern**
   ```typescript
   // Schemas: User-facing input/output (Zod validation)
   export const createTransactionSchema = z.object({
     amount: z.string(),     // String from form
     date: z.string(),       // ISO date string
   });
   
   // Entities: Internal storage (TypeScript types)
   export interface Transaction {
     amount: number;         // Parsed number
     date: Date;            // Date object
   }
   ```

2. **Platform Adapters**
   - `IDatabaseAdapter` interface in `@kakeibo/core`

3. **Pure Calculated Balance (Native Only - Dec 25, 2024)**
   ```typescript
   // Formula
   balance = initialBalance + sum(transactions)
   
   // Implementation in SQLiteAdapter
   const calculateAndSetAccountBalance = (account: Account, transactions: Transaction[]) => {
     return calculateAccountBalance(account.initialBalance, transactions);
   };
   
   // Benefits
   - Self-healing (recalculated on every query)
   - Crash-safe (no partial updates)
   - Full audit trail (all transactions preserved)
   - No accumulated errors from bugs
   - Simplified transaction operations (no balance revert logic)
   ```
   
   **Status**: ✅ Native complete, ⏳ Web deferred
   - `DexieAdapter` (web) implements interface
   - `SQLiteAdapter` (native) will implement same interface
   - All UI code uses adapter, not Dexie directly

3. **ID Prefix System**
   - Transactions: `tr-abc123`
   - Accounts: `acc-xyz789`
   - Categories: `cat-def456`
   - Budgets: `bud-ghi789`
   - Goals: `goal-jkl012`
   - Helps debugging, prevents ID confusion

4. **Import Pattern**
   ```typescript
   // ✅ Always import from core barrel export
   import { Transaction, cn, tv } from '@kakeibo/core';
   
   // ❌ Never use sub-paths
   import { Transaction } from '@kakeibo/core/types';
   ```

---

## ✅ What's Been Completed

### Phase 1: Core Foundation (35/35) ✅

**Location**: `packages/core/`

#### 1.1 Type System (9/9)
- All entity types: Account, Transaction, Category, Budget, Goal, User, Auth
- Exported from `packages/core/src/types/index.ts`
- No platform-specific code (pure TypeScript)

#### 1.2 Constants & Defaults (5/5)
- **categories.ts**: 24 expense + 8 income default categories
- **currencies.ts**: Symbol/code mappings for USD, EUR, GBP, JPY, INR
- **defaults.ts**: `defaultUserSettings`, alert thresholds
- **icons.ts**: 70+ Lucide icon name mappings

#### 1.3 Validation Schemas (6/6)
- Zod schemas for all entities
- `create` and `update` schemas for each
- Filter schemas for queries
- Located in `packages/core/src/schemas/`

#### 1.4 Utility Functions (10/10)
- **date.ts**: `financialMonthStartDate()`, `financialMonthEndDate()`
- **formatters.ts**: `formatCurrency()`, `formatRelativeDate()`
- **calculations.ts**: Budget/goal/savings calculations
- **generators.ts**: `generateId()` with nanoid
- **cn.ts**: Tailwind class merging utility
- **validators.ts**: Custom Zod validators

#### 1.5 Database Abstraction (7/7)
- **IDatabaseAdapter.ts**: Complete interface (30+ methods)
  - User CRUD
  - Transaction CRUD with filters
  - Account CRUD with balance tracking
  - Category CRUD with defaults
  - Budget CRUD with multi-category support
  - Goal CRUD with savings/debt types
  - Backup/restore methods
- **types.ts**: Filter interfaces, QueryOptions
- **operations.ts**: Complex cross-entity operations
- **migrations.ts**: User ID remapping, category normalization

### Phase 2: Business Logic Services (8/8) ✅

**Location**: `packages/core/src/services/`

#### 2.1 Calculation Services (3/3)
- **budgetProgress.ts** (156 lines)
  - `calculateBudgetProgress()`: Spent/budget percentage, alerts, projections
  - `calculateActiveAlerts()`: Which thresholds exceeded
  - `calculateProjectedSpending()`: Based on daily average
- **goalProgress.ts** (105 lines)
  - `calculateGoalProgress()`: Completion %, remaining amount, on-track status
  - `calculateRequiredMonthlyContribution()`: How much to save per month
- **statistics.ts** (286 lines)
  - `calculateMonthlyStats()`: Income, expenses, savings, rate
  - `calculateSpendingByCategory()`: Category breakdown
  - `calculateNetWorth()`: Assets - liabilities

#### 2.2 Auth Services (3/3)
- **authService.ts** (165 lines)
  - `createGuestUser()`: Generate guest user ID
  - `convertSupabaseUser()`: OAuth user to AuthUser type
  - Platform-agnostic auth helpers
- **migration.ts**: 
  - `detectBackupUserId()`: Find user ID in backup JSON
  - User ID remapping for data migration

#### 2.3 Formatter Services (2/2)
- Already in `utils/formatters.ts`
- Uses date-fns (works on both platforms)
- No Intl dependency (for React Native compatibility)

### Phase 3A: Web Database (6/6) ✅

**Location**: `apps/web/src/services/db/`

#### Database Implementation
- **index.ts** (41 lines): Dexie schema with 6 tables
  - Compound indexes for efficient queries
  - `[userId+date]`, `[userId+categoryId]`, etc.
- **DexieAdapter.ts** (774 lines): Complete implementation
  - Implements all `IDatabaseAdapter` methods
  - Atomic transactions for balance updates
  - Type conversions (string → Date, string → number)
  - All CRUD operations tested during development

#### Key Implementation Details
```typescript
// Balance updates are atomic
await db.transaction('rw', [db.transactions, db.accounts], async () => {
  await this.applyTransactionBalance(transaction);
  await db.transactions.add(transaction);
});

// Type conversions in adapter
const transaction: Transaction = {
  amount: parseFloat(input.amount),  // string → number
  date: new Date(input.date),        // string → Date
  isActive: !(input.isArchived ?? false), // Invert for accounts
};
```

### Phase 3B: Web UI Components (15/24) 🔄

**Location**: `apps/web/src/components/`

#### 3B.1 Base Components (10/14)

**Completed Components** (9 functional + 1 barrel export):

1. **Button** - 8 variants, 7 sizes, loading state
   - Uses `tv()` from `@kakeibo/core` for variants
   - Lucide icons for leftIcon/rightIcon
   
2. **Input** - Label, error, helper text, icon slots
   - Variant: default/filled
   - Proper accessibility (htmlFor, aria attributes)

3. **Card** - 6 sub-components
   - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
   - Composable design

4. **Modal** - Radix UI Dialog (accessible)
   - Focus trap, escape handling
   - Overlay click to close
   - **Decision**: Used Radix UI instead of framer-motion for accessibility

5. **Badge** - 5 variants
   - default, success, warning, danger, info
   - Auto-sizing based on content

6. **ProgressBar** - Auto-variant based on percentage
   - <50%: success, 50-79%: warning, 80-99%: danger, 100%+: danger
   - Animated with transitions

7. **Select** - Radix UI Select
   - Icon and color support per option
   - Dynamic Lucide icon rendering
   - Accessibility built-in

8. **Checkbox** - Radix UI Checkbox
   - Uses `tv()` for variants
   - Indeterminate state support

9. **CategoryIcon** - 70+ Lucide icons mapped
   - Size variants: sm/md/lg
   - Color customization
   - **Important**: Renamed `Map` to `MapIcon` to avoid shadowing global

10. **Barrel Export** - `components/ui/index.ts`
    - Exports all 9 components
    - Type-safe imports

**Deferred Components** (4):
- CategorySelect (complex, needs subcategory logic)
- TieredCategorySelect (complex)
- MultiCategorySelect (complex)
- SubcategorySelect (complex)
- Toast (needs toast system architecture)

#### 3B.2 Layout Components (5/5) ✅

**All Complete**:

1. **Navbar** - Desktop top bar
   - Search, theme toggle, notifications
   - Uses Button component from ui/
   - Placeholder TODOs for store integration

2. **Sidebar** - Desktop navigation (collapsible)
   - 7 navigation items
   - Collapse/expand functionality
   - **Removed framer-motion**, used CSS transitions

3. **BottomNav** - Mobile bottom navigation
   - 6 navigation items
   - Active route highlighting
   - Pure CSS animations (no framer-motion)

4. **FloatingActionButton** - Mobile FAB
   - Context-aware (changes icon per route)
   - Hides on settings/analytics pages
   - CSS `active:scale-90` instead of framer-motion

5. **AppShell** - Main layout wrapper
   - Integrates all layout components
   - Uses TanStack Router `Outlet`
   - Placeholder TODOs for auth/theme/modals

**Key Pattern**: Removed all framer-motion dependencies, using CSS transitions/transforms instead for better performance and smaller bundle.

#### Dependencies Installed
```json
{
  "lucide-react": "0.562.0",
  "@radix-ui/react-dialog": "1.1.15",
  "@radix-ui/react-select": "2.2.6",
  "@radix-ui/react-checkbox": "1.1.3"
}
```

---

## 🔧 Development Workflow Established

### 1. Git Commit Workflow

**Pre-commit hooks auto-run** (via Lefthook):
1. Biome format (auto-fix)
2. Biome lint (check only)
3. TypeScript check (all packages)

**Commit message format** (enforced by commitlint):
```bash
<type>(<scope>): <description>

# Examples:
feat(web): add Button component with 8 variants
fix(core): correct budget calculation for multi-category budgets
docs(readme): update installation steps
chore(deps): upgrade react to 19.2.3
```

**Important**: No need to manually run `yarn biome check --write` - pre-commit hooks handle it!

### 2. Component Creation Pattern

```bash
# 1. Read v1 component
read_file(/home/ashish/projects/kakeibo/src/components/...)

# 2. Create v2 component
create_file(apps/web/src/components/...)

# 3. Update imports
- Remove: '@/...' aliases
- Add: '@kakeibo/core' for utilities
- Add: '../../ui' for components

# 4. Fix linting issues
- Run build to check
- Fix any reported errors
- Common issues:
  - bg-gradient-to-br → bg-linear-to-br
  - flex-shrink-0 → shrink-0
  - Import ordering (Biome auto-fixes)

# 5. Create index.ts barrel export

# 6. Build and commit
yarn build
git add -A
git commit -m "feat(web): add ComponentName"
```

### 3. Handling Common Issues

**Import Shadowing**:
```typescript
// ❌ Don't shadow globals
import { Map } from 'lucide-react';

// ✅ Rename
import { Map as MapIcon } from 'lucide-react';
```

**Label Accessibility**:
```typescript
// ❌ Missing htmlFor
<label>Name</label>
<input id="name" />

// ✅ Proper association
<label htmlFor="name">Name</label>
<input id="name" />
```

**Radix UI Pattern**:
```typescript
// Always wrap in Root, use Portal for overlays
<Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      {children}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### 4. Build Verification

```bash
# Always build before committing
yarn build

# Acceptable warnings (6):
# - DexieAdapter complexity warnings (18-27, max 15)
# - These are complex database methods, refactoring deferred
```

### 5. TODO Update Pattern

After completing tasks:
```markdown
1. Mark checkboxes: [ ] → [x]
2. Update counts: (0/5) → (5/5)
3. Add ✅ emoji to completed sections
4. Update overall progress count
5. Commit with: docs: update TODO...
```

---

## 📊 Current Status

### Progress by Phase

| Phase | Status | Tasks | Notes |
|-------|--------|-------|-------|
| **Phase 1**: Core Foundation | ✅ | 35/35 | Complete |
| **Phase 2**: Business Logic | ✅ | 8/8 | Complete |
| **Phase 3A**: Web Database | ✅ | 6/6 | Complete |
| **Phase 3B**: Web Components | ✅ | 24/24 | Complete |
| **Phase 3C**: Web Pages | ✅ | 13/13 | Complete |
| **Phase 3D**: Toast System | ✅ | 12/12 | Complete |
| **Phase 4A**: Native Database | ✅ | 25/25 | Complete |
| **Phase 4B**: Native Components | ✅ | 42/42 | Complete |
| **Phase 4C**: Native Features | 🔄 | 6/21 | TransactionCard Complete |
| **Phase 5**: Testing | ⏳ | 0/15 | Pending |
| **Phase 6**: Docs & CI/CD | ⏳ | 0/9 | Pending |

**Total**: 129/174 tasks (74.1%)

### What's Working
- ✅ Core package builds successfully
- ✅ Web package builds successfully
- ✅ All 7 web pages functional
- ✅ Database initialization with 32 default categories
- ✅ Toast notifications for all CRUD operations
- ✅ Type system is solid (no type errors)
- ✅ All imports using `@kakeibo/core` work
- ✅ Git hooks enforce code quality automatically

### Known Issues
- ⚠️ 44 complexity warnings (deferred - refactoring needed)
- ⚠️ 23 lint warnings (button types, SVG titles)
- 📝 Category operations need toast notifications
- 📝 Import/export needs toast notifications
- 📝 Settings changes need toast notifications

---

## 🎯 Phase 3D: Toast Notification System (8/12 Complete)

### Completed Tasks

1. ✅ **Toast Utility** (`apps/web/src/utils/toast.ts`)
   - Pub/sub pattern from v1
   - Success, error, warning, info helpers
   - Auto-generated unique IDs

2. ✅ **Toast Component** (`apps/web/src/components/ui/Toast/Toast.tsx`)
   - Framer Motion animations (slide-up, fade)
   - 5 variants (default, success, error, warning, info)
   - Icons from Lucide (CheckCircle, AlertCircle, Info)
   - Dismissible with X button

3. ✅ **Toast Container** (`apps/web/src/components/ui/Toast/ToastContainer.tsx`)
   - AnimatePresence for enter/exit animations
   - Fixed positioning (bottom-20 on mobile, bottom-8 on desktop)
   - ARIA live region for screen readers

4. ✅ **Toast Root** (`apps/web/src/components/ui/Toast/ToastRoot.tsx`)
   - React Portal (renders to document.body)
   - Auto-dismiss after 4 seconds
   - Toast subscription management

5. ✅ **Transaction Toasts** (`apps/web/src/hooks/useTransactions.ts`)
   - Create: "Transaction added"
   - Update: "Transaction updated"
   - Delete: "Transaction deleted"

6. ✅ **Budget Toasts** (`apps/web/src/hooks/useBudgets.ts`)
   - Create: "Budget created"
   - Update: "Budget updated"
   - Delete: "Budget deleted"

7. ✅ **Goal Toasts** (`apps/web/src/hooks/useGoals.ts`)
   - Create: "Goal created"
   - Update: "Goal updated"
   - Delete: "Goal deleted"
   - Contribute: "Contribution added"
   - Withdraw: "Withdrawal recorded"
   - Update amount: "Goal amount updated"

8. ✅ **Account Toasts** (`apps/web/src/hooks/useAccounts.ts`)
   - Create: "Account created"
   - Update: "Account updated"
   - Delete: "Account deleted"

### Remaining Tasks (4)

1. ⏳ **Category Operations** - Need to add toasts to useCategories hook
2. ⏳ **Import/Export** - Toast feedback for data operations
3. ⏳ **Settings Changes** - Toast when currency/date format changes
4. ⏳ **Console Errors** - Replace remaining console.error with toast.error

---

## 🎯 Next Steps: Complete Toast System

### Immediate Tasks

1. **Add Category Toasts**
   - Edit `apps/web/src/hooks/useCategories.ts`
   - Add toast.success/error to create/update/delete operations

2. **Add Import/Export Toasts**
   - Will be implemented when import/export feature is built
   - Show progress/success/error during data operations

3. **Add Settings Toasts**
   - Will be implemented when settings page is enhanced
   - Toast when user changes currency, date format, theme

---

## 🎯 Phase 4C: Native Feature Components (6/21 Complete)

### TransactionCard Component - ✅ COMPLETE

**Location**: `apps/native/src/components/features/transactions/`

**Architecture**: Established modular composition pattern for all future feature components

#### Core Utilities (`@kakeibo/core/src/utils/transactionHelpers.ts`)
- ✅ `getTransactionAmountColor(type)`: Color based on transaction type
- ✅ `getTransactionAmountPrefix(type)`: Prefix (−, +, or empty)
- ✅ `isGoalTransaction(type)`: Boolean check
- ✅ `getGoalIconColor(type)`: Icon color for goals

#### Custom Hook (`apps/native/src/hooks/useTransactionMenu.ts`)
- ✅ Menu state management extracted from component
- ✅ Methods: openMenu, closeMenu, toggleMenu
- ✅ Returns: menuOpen state + handlers

#### Sub-Components (Modular Architecture)
1. ✅ **TransactionIcon.tsx** - Icon rendering only
   - Goal icon (Target), Transfer icon (ArrowLeftRight), or CategoryIcon
   - Uses utilities from @kakeibo/core
   
2. ✅ **TransactionInfo.tsx** - Description & category display
   - Description with essential badge
   - Category/goal/transfer info
   
3. ✅ **TransactionAmount.tsx** - Amount & date display
   - Colored amount with prefix
   - Formatted date
   
4. ✅ **TransactionMenu.tsx** - Edit/delete menu
   - MoreVertical trigger
   - Dropdown with actions

#### Main Component (`TransactionCard.tsx`)
- ✅ Composition of sub-components
- ✅ Reduced from 220 lines (complexity 29) → 141 lines
- ✅ Supports all 5 transaction types
- ✅ Compact variant (smaller icons, reduced padding)
- ✅ Type-safe, maintainable, testable

**Architectural Benefits**:
- ✅ **Modular**: Each sub-component has single responsibility
- ✅ **DRY**: Shared utilities in @kakeibo/core, reusable across all feature components
- ✅ **Maintainable**: Changes isolated to specific sub-components
- ✅ **Testable**: Small, focused components easy to unit test

**Pattern Established**: This modular approach (utilities + hooks + sub-components + composition) will be followed for BudgetCard, GoalCard, and all future feature components.

4. **Replace Console Errors**
   - Search for `console.error` in web codebase
   - Replace with `toastHelpers.error()` where appropriate

---

## 🎯 Next Steps: Phase 4 (Native Platform)

### What to Do Next

**Location**: `apps/web/src/components/features/`

**Tasks** (0/5):

1. **Transaction Components**
   - Copy `src/components/features/transactions/` → `apps/web/src/components/features/transactions/`
   - Components:
     - TransactionCard.tsx
     - AddTransactionModal.tsx
     - TransactionList.tsx (if exists)
   - Will need: Button, Input, Modal, Select, CategoryIcon from ui/

2. **Budget Components**
   - Copy `src/components/features/budgets/` → `apps/web/src/components/features/budgets/`
   - Components:
     - BudgetCard.tsx
     - AddBudgetModal.tsx
   - Will need: ProgressBar, Badge, MultiCategorySelect (deferred)

3. **Goal Components**
   - Copy `src/components/features/goals/` → `apps/web/src/components/features/goals/`
   - Components:
     - GoalCard.tsx
     - AddGoalModal.tsx
     - ContributeModal.tsx

4. **Account Components**
   - Copy `src/components/features/accounts/` → `apps/web/src/components/features/accounts/`
   - Components:
     - AccountCard.tsx
     - AddAccountModal.tsx

5. **Common Components**
   - Copy `src/components/common/` → `apps/web/src/components/common/`
   - Components:
     - EmptyState.tsx
     - LoadingSpinner.tsx
     - PWAPrompts.tsx (if applicable)

### Expected Challenges

1. **Store Integration**
   - Feature components use Zustand store (`useAppStore`)
   - Store doesn't exist in v2 yet
   - **Solution**: Add placeholder TODOs or create minimal store

2. **Hooks Missing**
   - Components use `useTransactions`, `useAccounts`, etc.
   - Hooks don't exist in v2 yet
   - **Solution**: Either create hooks now, or add TODOs

3. **Complex Category Selects**
   - Some modals use deferred components
   - **Solution**: Temporarily use basic Select, mark as TODO

### Implementation Guide

For each feature component:

```typescript
// 1. Read v1 component
const v1Code = await read_file('/home/ashish/projects/kakeibo/src/components/features/transactions/TransactionCard.tsx');

// 2. Identify dependencies
// - UI components (Button, Badge, etc.) → import from '../../ui'
// - Store hooks → Add TODO comment
// - Database hooks → Add TODO comment

// 3. Create v2 component
create_file('apps/web/src/components/features/transactions/TransactionCard.tsx', {
  // Update imports:
  // - '@/components/ui' → '../../ui'
  // - '@/types' → '@kakeibo/core'
  // - '@/hooks/useTransactions' → Add TODO
  // - '@/store' → Add TODO
  
  // Add placeholder functions for missing hooks
  // const transactions = []; // TODO: Use useTransactions when available
  // const { deleteTransaction } = { deleteTransaction: () => {} }; // TODO
});

// 4. Create barrel export
create_file('apps/web/src/components/features/transactions/index.ts');

// 5. Build and verify
yarn build

// 6. Fix any errors

// 7. Commit
git add apps/web/src/components/features/transactions/
git commit -m "feat(web): add transaction feature components"

// 8. Update TODO.md
// Mark tasks complete, update counts
```

---

## 📚 Important Reference Files

### Must-Read Before Continuing

1. **/.github/copilot-instructions.md** (820 lines)
   - Complete v2 architecture guide
   - Type mapping patterns (isActive vs isArchived)
   - Date/amount conversions
   - All architectural decisions documented

2. **/TODO.md** (896 lines)
   - Detailed task breakdown
   - Progress tracking
   - Phase dependencies

3. **v1 Reference**: `/home/ashish/projects/kakeibo/`
   - Original implementation
   - Component patterns
   - Hook implementations
   - Store structure

### Key Sections in Copilot Instructions

- **Type System Details** (lines 51-120)
  - Schema vs Entity pattern
  - Critical type mappings
  - Date/amount conversions

- **DexieAdapter Pattern** (lines 121-180)
  - Transaction balance updates
  - Filter implementation
  - Type conversions

- **Component Patterns** (lines 181-240)
  - Feature card pattern
  - Delete confirmation modal
  - CategoryIcon usage

---

## 🚨 Critical Gotchas

### 1. Type Conversions (MUST DO)
```typescript
// ❌ Never spread input directly
const transaction = { ...input }; // Types don't match!

// ✅ Always convert types
const transaction: Transaction = {
  amount: parseFloat(input.amount),
  date: new Date(input.date),
  isActive: !(input.isArchived ?? false),
};
```

### 2. isActive vs isArchived Confusion
```typescript
// Accounts & Budgets
entity.isActive = !(input.isArchived ?? false); // Invert!

// Goals
entity.status = input.isArchived ? 'cancelled' : 'active';
```

### 3. Multi-Category Budgets
```typescript
// v1 (old)
categoryId: string;

// v2 (current)
categoryIds: string[]; // Multiple categories!
```

### 4. Import From Core Only
```typescript
// ✅ Always
import { Transaction, cn } from '@kakeibo/core';

// ❌ Never
import { Transaction } from '@kakeibo/core/types';
```

### 5. Radix UI Over Framer Motion
- Use Radix UI primitives for accessibility
- Use CSS transitions for animations
- No framer-motion in new code

---

## 🛠️ Tools & Commands

### Development
```bash
# Install dependencies
yarn install

# Development
yarn dev:web           # Web dev server (port 3000)
yarn dev:native        # Metro bundler

# Build
yarn build             # Build all packages
yarn build:web         # Build web only
yarn build:core        # Build core only

# Checks
yarn lint              # Lint all
yarn typecheck         # TypeScript check
```

### Git
```bash
# Pre-commit runs automatically
git add -A
git commit -m "feat(web): add feature"

# View changes
git status
git diff

# Clear Turbo cache (if needed)
yarn turbo clean
```

---

## 💡 LLM Continuation Instructions

### How to Pick Up Where I Left Off

1. **Read This Document First**
   - Understand architecture
   - Review completed phases
   - Check current status

2. **Read Copilot Instructions**
   - `/kakeibo-v2/.github/copilot-instructions.md`
   - Contains all technical details

3. **Check TODO.md**
   - Find next incomplete section
   - Current: Phase 3B.3 (Feature Components)

4. **Follow Established Patterns**
   - Use same import style
   - Same component structure
   - Same commit format
   - Same TODO update format

5. **Reference v1 Code**
   - Location: `/home/ashish/projects/kakeibo/`
   - Mirror structure in v2
   - Update imports/dependencies

6. **Build After Every Change**
   - `yarn build` before committing
   - Fix errors immediately
   - Keep build passing

7. **Update TODO After Each Task**
   - Mark checkboxes
   - Update counts
   - Commit updates

### When Creating New Components

```bash
# Template workflow:
1. list_dir v1 location
2. read_file v1 component
3. create_file v2 component (update imports)
4. create_file index.ts barrel export
5. run_in_terminal yarn build
6. Fix errors (if any)
7. run_in_terminal git commit
8. replace_string_in_file TODO.md (mark complete)
9. run_in_terminal git commit TODO update
```

### Decision-Making Guidelines

**When to defer**:
- Complex components blocking progress → defer
- Missing dependencies (store, hooks) → add TODO
- Requires architecture decision → ask user

**When to implement**:
- Straightforward component port → implement
- Clear pattern established → follow pattern
- All dependencies available → implement

**When to ask user**:
- Architecture change needed
- Multiple valid approaches
- Breaking change required
- Unclear requirements

### Quality Standards

- ✅ All imports from `@kakeibo/core`
- ✅ No type errors
- ✅ Build passing
- ✅ Conventional commits
- ✅ TODOs for missing features
- ✅ Barrel exports created
- ✅ Progress tracked in TODO.md

---

## 📈 Success Metrics

### What "Done" Looks Like

**Phase Complete When**:
- All tasks marked [x]
- All files created
- Build passing
- TODO.md updated
- Committed to git

**Feature Complete When**:
- Component renders without errors
- Types are correct
- Imports work
- Can be used by other components

**Project Complete When**:
- All 141 tasks done
- Both web and native working
- Tests passing
- Documentation complete

---

## 🎓 Lessons Learned

### What Worked Well
1. **Barrel exports** - Easy imports, clean structure
2. **Radix UI** - Better accessibility than custom solutions
3. **CSS over framer-motion** - Smaller bundle, faster
4. **TODO-first approach** - Clear roadmap, no missed work
5. **Conventional commits** - Clean history, enforced standards
6. **Pre-commit hooks** - Automatic quality checks

### What to Avoid
1. ❌ Don't skip TODO updates
2. ❌ Don't commit without building
3. ❌ Don't use sub-paths in imports
4. ❌ Don't shadow global objects (Map, Date, etc.)
5. ❌ Don't forget type conversions
6. ❌ Don't assume v1 code works as-is

### Patterns Established
- Schema for input → Entity for storage
- Adapter for platform differences
- Prefixed IDs for debugging
- CSS transitions over JS animations
- Deferred > blocked progress

---

## 🔗 Quick Links

- **v2 Project**: `/home/ashish/projects/kakeibo-v2/`
- **v1 Reference**: `/home/ashish/projects/kakeibo/`
- **Core Package**: `packages/core/src/`
- **Web App**: `apps/web/src/`
- **Components**: `apps/web/src/components/`
- **Database**: `apps/web/src/services/db/`
- **TODO**: `TODO.md`
- **Copilot Docs**: `.github/copilot-instructions.md`

---

## 📞 Current State Summary

**We are here**:
- 70/141 tasks complete (49.6%)
- Phases 1, 2, 3A complete
- Phase 3B: 15/24 (Layout done, Features next)
- All foundation work complete
- Ready for feature components

**Next immediate task**:
- Port transaction components from v1
- Create TransactionCard, AddTransactionModal
- Add TODOs for missing store/hooks
- Continue through feature components

**Code is ready for**:
- Creating hooks (useTransactions, etc.)
- Creating store (Zustand)
- Creating pages (Dashboard, etc.)
- Connecting everything together

---

**Document Version**: 1.0  
**Author**: GitHub Copilot (Claude Sonnet 4.5)  
**Date**: December 20, 2024  
**Status**: Ready for handoff to any LLM continuation
