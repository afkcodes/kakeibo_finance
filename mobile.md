# Native Platform (React Native) - Complete Feature Checklist

**Target**: Feature parity with web platform  
**Approach**: Maximize code reuse from `@kakeibo/core` (~70% shared logic)  
**Last Updated**: December 22, 2024

---

## 📊 Progress Overview

**Total Tasks**: 73/183 completed (39.9%)

### Phases
- [x] Phase 4A: Database Layer (25/25) ✅ COMPLETE (Dec 20, 2024)
- [x] Phase 4B: Core UI Components (42/42) ✅ COMPLETE (Dec 22, 2024)
- [ ] Phase 4C: Feature Components (6/21) 🔴 IN PROGRESS - TransactionCard COMPLETE
- [ ] Phase 4D: State Management & Hooks (0/12) 🔴 HIGH PRIORITY
- [ ] Phase 4E: Navigation & Routing (0/10) 🔴 HIGH PRIORITY
- [ ] Phase 4F: Screens Implementation (0/60) 🔴 HIGH PRIORITY
- [ ] Phase 4G: Advanced Features (0/13) 🟡 MEDIUM PRIORITY

---

## 🏗️ Development Principles (Prerequisites)

Before writing any code, every implementation MUST follow these core principles:

### 1. **Highly Modular Code**
- Each component/service does ONE thing well
- Small, focused files (ideally <200 lines, wherever possible)
- Easy to understand, test, and replace
- Clear boundaries between modules

### 2. **Maintainability**
- Self-documenting code with clear naming
- Consistent patterns across the codebase
- Easy to debug and extend
- Well-structured with logical organization

### 3. **DRY Principle (Don't Repeat Yourself)**
- Extract common logic into utilities/hooks
- Reuse components via composition
- Share code from `@kakeibo/core` whenever possible
- Single source of truth for business logic

### 4. **Separation of Concerns**
- **Data Layer** (SQLiteAdapter): Database operations only
- **Business Logic** (`@kakeibo/core`): Calculations, validation, formatting
- **UI Layer** (Components): Presentation and user interaction only
- **State Management** (Zustand): Global state coordination
- **Navigation**: Routing and screen transitions

### 5. **Scalable Architecture**
- Future-proof: Easy to add new features
- Performance-conscious: Optimized for mobile devices
- Testable: Unit tests, integration tests, E2E tests
- Platform-aware: iOS/Android differences handled gracefully

### Implementation Checklist (Every File)
- [ ] Does this follow a pattern we've established?
- [ ] Can this logic be reused from `@kakeibo/core`?
- [ ] Is this component composable and reusable?
- [ ] Is the file size reasonable (<200 lines)?
- [ ] Are concerns properly separated (UI vs logic)?
- [ ] Will this be easy to test?
- [ ] Is the naming clear and consistent?

**Example**:
```typescript
// ❌ BAD: Logic mixed with UI, not reusable
const BudgetCard = ({ budgetId }) => {
  const budget = db.budgets.get(budgetId);
  const spent = db.transactions.where({ budgetId }).sum('amount');
  const progress = (spent / budget.amount) * 100;
  return <View><Text>{progress}%</Text></View>;
};

// ✅ GOOD: Separation of concerns, reusable
// In @kakeibo/core/services/calculations/budgetCalculations.ts
export const calculateBudgetProgress = (budget: Budget, transactions: Transaction[]) => {
  // Pure function, testable, platform-agnostic
};

// In apps/native/src/components/features/budgets/BudgetCard.tsx
const BudgetCard = ({ budget, transactions }) => {
  const { progress } = calculateBudgetProgress(budget, transactions); // Reuse core logic
  return <BudgetCardView progress={progress} budget={budget} />; // UI only
};
```

---

## 🔴 Phase 4A: Database Layer (SQLite) - HIGH PRIORITY

### 4A.1 Dependencies & Setup (0/6)
- [ ] Install OP-SQLite: `yarn workspace @kakeibo/native add @op-engineering/op-sqlite`
- [ ] Install async-storage for metadata: `yarn workspace @kakeibo/native add @react-native-async-storage/async-storage`
- [ ] Create `apps/native/src/services/db/` directory structure
- [ ] Create `schema.ts` with SQL table definitions (6 tables: users, accounts, categories, transactions, budgets, goals)
- [ ] Create `migrations.ts` with version management system
- [ ] Create database initialization utility in `index.ts`

### 4A.2 Core Database Setup (0/4)
- [ ] Implement database connection singleton pattern
- [ ] Create `executeQuery()` helper for SQL queries
- [ ] Create `executeTransaction()` wrapper for atomic operations
- [ ] Add database error handling with retry logic (exponential backoff)

### 4A.3 SQLiteAdapter - User Operations (0/2)
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 61-97
- [ ] Implement `getUser(userId: string): Promise<User | undefined>`
- [ ] Implement `createUser(user: User): Promise<User>`, `updateUser()`, `deleteUser()` with cascade deletes

### 4A.4 SQLiteAdapter - Account Operations (0/3)
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 99-217
**Reuse from core**: Account type definitions, filter interfaces
- [ ] Implement `getAccounts(userId, filters?)` with filter support (type, isArchived)
- [ ] Implement `getAccount(id)`, `createAccount()`, `updateAccount()`, `deleteAccount()`
- [ ] Implement balance update helpers (private methods `applyTransactionBalance`, `revertTransactionBalance`)

### 4A.5 SQLiteAdapter - Category Operations (0/3)
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 219-398
**Reuse from core**: `defaultExpenseCategories`, `defaultIncomeCategories` from `@kakeibo/core/constants`
- [ ] Implement `getCategories(userId, filters?)` with support for type, parentId, isDefault filters
- [ ] Implement `createCategory()` with order assignment logic
- [ ] Implement default category initialization (52 expense + 18 income categories)

### 4A.6 SQLiteAdapter - Transaction Operations (0/4)
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 400-687
**Critical**: Type conversions (amount: string → number, date: string → Date)
- [ ] Implement `getTransactions(userId, filters?, options?)` with comprehensive filters:
  - Type filter (expense, income, transfer, goal-contribution, goal-withdrawal)
  - Category/subcategory filters
  - Account filter (accountId or toAccountId)
  - Date range filter (startDate, endDate)
  - Goal filter
  - isEssential filter
- [ ] Implement sorting & pagination (sortBy, sortOrder, limit, offset)
- [ ] Implement `createTransaction()` with atomic balance updates
- [ ] Implement `updateTransaction()` and `deleteTransaction()` with balance reversion

### 4A.7 SQLiteAdapter - Budget Operations (0/2)
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 689-845
**Key feature**: Multi-category support (`categoryIds: string[]`)
- [ ] Implement `getBudgets(userId, filters?)` with categoryId matching (check if categoryId in categoryIds array)
- [ ] Implement `createBudget()`, `updateBudget()`, `deleteBudget()` with multi-category handling

### 4A.8 SQLiteAdapter - Goal Operations (0/3)
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 847-1038
**Status mapping**: `isArchived: boolean → status: 'active' | 'completed' | 'cancelled'`
- [ ] Implement `getGoals(userId, filters?)` with type, status, isArchived filters
- [ ] Implement `createGoal()`, `updateGoal()`, `deleteGoal()`
- [ ] Implement `contributeToGoal()` and `withdrawFromGoal()` with transaction creation

### 4A.9 Import/Export Operations (0/4)
**Reference**: `apps/web/src/services/db/DexieAdapter.ts` lines 1040-1146
**Reuse from core**: `cleanExportData`, `detectBackupUserId`, `remapUserId`, `normalizeCategoryIdsInRecord`, `generateMigrationReport` from `@kakeibo/core/services/database/migrations`
- [ ] Implement `exportDatabase(userId): Promise<ExportData>` - export all user data to JSON
- [ ] Implement `importDatabase(data: ExportData, targetUserId?: string)` with:
  - User ID remapping (support importing from different user)
  - Category ID normalization (v1 compatibility: remove "exp-" and "inc-" prefixes)
  - Settings migration
  - Date conversion handling
- [ ] Add import validation with user-friendly error messages
- [ ] Test cross-platform compatibility (import web backup on mobile, vice versa)

**Total Phase 4A**: 0/25 tasks

---

## ✅ Phase 4B: Core UI Components - COMPLETE (Dec 22, 2024)

> **Status**: All 14 base UI components implemented!  
> **Styling**: UniWind 1.2.2 (Tailwind for React Native)  
> **Design System**: Dark elegant theme matching web (colors from `@kakeibo/core/styles`)  
> **NO third-party UI libraries**: Pure React Native primitives only

### Completed Components (14/14) ✅

#### 4B.1 Button Component (5/5) ✅
**Location**: `apps/native/src/components/ui/Button.tsx`
- [x] Base Button with Pressable (not TouchableOpacity)
- [x] 6 variants: primary, secondary, danger, success, ghost, outline
- [x] 3 sizes: sm, md, lg
- [x] Loading state with ActivityIndicator
- [x] Disabled state with 50% opacity
- [x] Active press feedback

#### 4B.2 Input Component (4/4) ✅
**Location**: `apps/native/src/components/ui/Input.tsx`
- [x] Base Input with TextInput
- [x] Label, error message, helper text slots (using tv() slots)
- [x] Error state styling (red border)
- [x] Disabled state with opacity

#### 4B.3 Card Component (3/3) ✅
**Location**: `apps/native/src/components/ui/Card.tsx`
- [x] Card with View/Pressable wrapper
- [x] 3 variants: default, elevated, outlined
- [x] 4 padding sizes: none, sm, md, lg
- [x] Pressable variant for clickable cards

#### 4B.4 Badge Component (2/2) ✅
**Location**: `apps/native/src/components/ui/Badge.tsx`
- [x] Badge with View + Text
- [x] 5 variants: primary, success, danger, warning, neutral
- [x] 3 sizes: sm, md, lg

#### 4B.5 ProgressBar Component (2/2) ✅
**Location**: `apps/native/src/components/ui/ProgressBar.tsx`
- [x] ProgressBar with nested Views
- [x] 4 colors: primary, success, warning, danger
- [x] 3 sizes: sm, md, lg
- [x] Optional percentage display

#### 4B.6 Checkbox Component (2/2) ✅
**Location**: `apps/native/src/components/ui/Checkbox.tsx`
- [x] Checkbox with Pressable + View
- [x] Check icon from lucide-react-native
- [x] Label support

#### 4B.7 Modal Component (4/4) ✅
**Location**: `apps/native/src/components/ui/Modal.tsx`
- [x] Modal with React Native Modal
- [x] Pressable backdrop for dismiss
- [x] Custom header with close button (X icon)
- [x] ScrollView content area
- [x] Optional footer slot

#### 4B.8 CategoryIcon Component (3/3) ✅
**Location**: `apps/native/src/components/ui/CategoryIcon.tsx`
- [x] Dynamic icon rendering based on icon name
- [x] 70+ Lucide icons mapped (shopping-cart, utensils, car, home, etc.)
- [x] Color and size props (sm, md, lg)
- [x] Fallback to Tag icon

#### 4B.9 Select Component (3/3) ✅
**Location**: `apps/native/src/components/ui/Select.tsx`
- [x] Bottom sheet pattern using Modal
- [x] Pressable trigger with ChevronDown icon
- [x] ScrollView list of options with Check icon for selected
- [x] Label, error, placeholder support

#### 4B.10 DatePicker Component (3/3) ✅
**Location**: `apps/native/src/components/ui/DatePicker.tsx`
- [x] Platform-specific behavior (iOS modal, Android native)
- [x] @react-native-community/datetimepicker integration
- [x] Calendar icon trigger
- [x] Confirm button for iOS

#### 4B.11 Chip Component (3/3) ✅
**Location**: `apps/native/src/components/ui/Chip.tsx`
- [x] Pill-shaped chips with rounded-full borders
- [x] 5 variants: primary, success, danger, warning, neutral
- [x] 3 sizes: sm, md, lg
- [x] Optional close button (X icon) with onClose callback
- [x] Pressable support with onPress callback

#### 4B.12 SkeletonLoader Component (2/2) ✅
**Location**: `apps/native/src/components/ui/SkeletonLoader.tsx`
- [x] Shimmer animation using Animated API
- [x] 3 variants: text, card, list
- [x] Opacity animation loop (0.3 to 0.7)

#### 4B.13 Toast System (4/4) ✅
**Location**: `apps/native/src/components/ui/Toast/`
- [x] toast.ts - ToastManager with pub/sub pattern
- [x] Toast.tsx - Individual toast with slide animation and auto-dismiss
- [x] ToastContainer.tsx - Renders all active toasts at top with safe area
- [x] Pill-shaped minimal design matching web (borderRadius: 999, dark bg, colored icon circles)

#### 4B.14 EmptyState Component (2/2) ✅
**Location**: `apps/native/src/components/common/EmptyState.tsx`
- [x] Icon, title, description layout
- [x] Optional action button
- [x] Centered with rounded icon background

#### 4B.15 ComponentShowcase (1/1) ✅
**Location**: `apps/native/src/screens/ComponentShowcase.tsx`
- [x] Demo screen for all UI components
- [x] Interactive examples with state
- [x] Toast triggers for each variant
- [x] Skeleton loader toggle
- [x] Empty state toggle

### Key Implementation Achievements
- ✅ **Removed HeroUI Native completely** - All components use pure React Native primitives
- ✅ **UniWind 1.2.2** for Tailwind-like styling with `className` prop
- ✅ **tailwind-variants (tv())** for variant management (same pattern as web)
- ✅ **Dark theme** colors from @kakeibo/core/styles
- ✅ **lucide-react-native 0.562.0** for 70+ category icons
- ✅ **@react-native-community/datetimepicker 8.5.1** for date picker
- ✅ **react-native-safe-area-context** for SafeAreaView (non-deprecated)
- ✅ **All components fully typed** with TypeScript interfaces
- ✅ **Consistent API** with web components (same prop names, same variants)

**Total Phase 4B**: 42/42 tasks ✅

---

## 🔴 Phase 4C: Feature Components - HIGH PRIORITY (NEXT)

### 4B.4 Badge Component (0/2)
**Reference**: `apps/web/src/components/ui/Badge/Badge.tsx`
**Location**: `apps/native/src/components/ui/Badge.tsx`
- [ ] Create Badge with View + Text (rounded-full, px-2, py-0.5)
- [ ] Implement 5 variants: default, success, danger, warning, primary (color-coded backgrounds)

### 4B.5 ProgressBar Component (0/3)
**Reference**: `apps/web/src/components/ui/ProgressBar/ProgressBar.tsx`
**Location**: `apps/native/src/components/ui/ProgressBar.tsx`
- [ ] Create linear ProgressBar with View (background) + Animated.View (fill)
- [ ] Add color prop with support for primary, success, warning, danger
- [ ] Add smooth animation when progress value changes

### 4B.6 Checkbox Component (0/2)
**Reference**: `apps/web/src/components/ui/Checkbox/Checkbox.tsx`
**Location**: `apps/native/src/components/ui/Checkbox.tsx`
- [ ] Create controlled Checkbox with TouchableOpacity
- [ ] Add checkmark icon (lucide-react-native Check icon) with animation

### 4B.7 Modal Component (0/4)
**Reference**: `apps/web/src/components/ui/Modal/Modal.tsx`
**Location**: `apps/native/src/components/ui/Modal.tsx`
- [ ] Create Modal using React Native Modal component
- [ ] Add overlay with TouchableWithoutFeedback for backdrop dismiss
- [ ] Implement slide-up animation (Animated API or Reanimated)
- [ ] Add close button in header (X icon top-right)

### 4B.8 EmptyState Component (0/2)
**Reference**: `apps/web/src/components/common/EmptyState.tsx`
**Location**: `apps/native/src/components/common/EmptyState.tsx`
- [ ] Create EmptyState with icon, title, description, optional CTA button
- [ ] Use Lucide icons for visual representation

### 4B.9 Select Component (0/3)
**Reference**: `apps/web/src/components/ui/Select/Select.tsx` (uses Radix UI)
**Location**: `apps/native/src/components/ui/Select.tsx`
- [ ] Create Select using React Native Picker or custom bottom sheet
- [ ] Add label and error state styling
- [ ] Implement controlled component pattern (value, onValueChange)

### 4B.10 DatePicker Component (0/2)
**Location**: `apps/native/src/components/ui/DatePicker.tsx`
**Dependencies**: `@react-native-community/datetimepicker`
- [ ] Install `@react-native-community/datetimepicker`
- [ ] Create DatePicker wrapper with TouchableOpacity trigger + modal picker

### 4B.11 CategoryIcon Component (0/3)
**Reference**: `apps/web/src/components/ui/CategoryIcon/CategoryIcon.tsx`
**Location**: `apps/native/src/components/ui/CategoryIcon.tsx`
**Dependencies**: `lucide-react-native`
- [ ] Install `lucide-react-native` for 70+ icons
- [ ] Port iconMap from web (70+ icon name mappings)
- [ ] Create CategoryIcon with dynamic icon rendering based on icon name + color

### 4B.12 CategorySelect Component (0/4)
**Reference**: `apps/web/src/components/ui/CategorySelect/CategorySelect.tsx`
**Location**: `apps/native/src/components/ui/CategorySelect.tsx`
**Complex**: Subcategory drill-down UI
- [ ] Create category list (FlatList) with parent categories
- [ ] Add subcategory expansion (collapsible sections)
- [ ] Implement selection state (highlight selected category)
- [ ] Add bottom sheet or modal wrapper for mobile UX

### 4B.13 MultiCategorySelect Component (0/3)
**Reference**: `apps/web/src/components/ui/MultiCategorySelect/MultiCategorySelect.tsx`
**Location**: `apps/native/src/components/ui/MultiCategorySelect.tsx`
**For budgets**: Select multiple categories
- [ ] Create multi-select category list with checkboxes
- [ ] Show selected count badge
- [ ] Add "Select All" and "Clear All" buttons

### 4B.14 Toast Notification System (0/4)
**Reference**: `apps/web/src/components/ui/Toast/` (4 files)
**Location**: `apps/native/src/components/ui/Toast/`
**Pattern**: Pub/sub with event emitter
- [ ] Create `toast.ts` utility with pub/sub pattern (subscribe/publish)
- [ ] Create Toast component with slide-down animation (Animated API)
- [ ] Create ToastContainer to render toasts (absolute positioning at top)
- [ ] Add toast types: success (green), error (red), info (blue), warning (amber)

### 4B.15 Skeleton Loader (0/2)
**Location**: `apps/native/src/components/ui/SkeletonLoader.tsx`
- [ ] Create SkeletonLoader with shimmer animation (Animated API)
- [ ] Create variants: text (single line), card (full card shape), list (multiple cards)

**Total Phase 4B**: 0/42 tasks

---

## 🔴 Phase 4C: Feature Components - IN PROGRESS

> **Reference**: `apps/web/src/components/features/`  
> **Reuse**: All form schemas from `@kakeibo/core/schemas`
> **Architecture**: Modular composition with sub-components + shared utilities in @kakeibo/core + custom hooks

### 4C.1 TransactionCard Component (6/6) ✅
**Reference**: `apps/web/src/components/features/transactions/TransactionCard.tsx` (256 lines)
**Location**: `apps/native/src/components/features/transactions/TransactionCard.tsx`
**Architecture**: Refactored from 220-line monolithic (complexity 29) to modular composition (141 lines)

**Core Utilities** (`@kakeibo/core/src/utils/transactionHelpers.ts`):
- [x] `getTransactionAmountColor(type)`: Returns color based on transaction type
- [x] `getTransactionAmountPrefix(type)`: Returns prefix (−, +, or empty)
- [x] `isGoalTransaction(type)`: Boolean check for goal transactions
- [x] `getGoalIconColor(type)`: Color for goal icons

**Custom Hook** (`apps/native/src/hooks/useTransactionMenu.ts`):
- [x] State management: menuOpen, openMenu, closeMenu, toggleMenu

**Sub-Components**:
- [x] `TransactionIcon.tsx`: Icon rendering (goal/transfer/category)
- [x] `TransactionInfo.tsx`: Description, category, essential badge
- [x] `TransactionAmount.tsx`: Amount with color, prefix, date
- [x] `TransactionMenu.tsx`: Edit/delete dropdown menu

**Main Component** (`TransactionCard.tsx`):
- [x] Composition of sub-components
- [x] Supports all 5 transaction types (expense, income, transfer, goal-contribution, goal-withdrawal)
- [x] Compact variant (smaller icons, reduced padding)
- [x] Type-safe with proper TypeScript
- [x] Uses utilities from @kakeibo/core for DRY principle

**Benefits**:
- ✅ Modular: Each sub-component has single responsibility
- ✅ Testable: Small, focused components easy to unit test
- ✅ Maintainable: Changes isolated to specific sub-components
- ✅ DRY: Shared utilities reusable across all feature components

### 4C.2 BudgetCard Component (0/5)
**Reference**: `apps/web/src/components/features/budgets/BudgetCard.tsx`
**Location**: `apps/native/src/components/features/budgets/BudgetCard.tsx`
**Reuse**: `calculateBudgetProgress()` from `@kakeibo/core/services/calculations/budgetProgress`
- [ ] Create BudgetCard with progress bar (ProgressBar component)
- [ ] Display budget amount, spent amount, remaining amount
- [ ] Show multi-category chips (if multiple categories)
- [ ] Add alert badges for budgets at risk (≥70% = warning, ≥100% = danger)
- [ ] Add 3-dot menu with Edit/Delete options

### 4C.3 GoalCard Component (0/4)
**Reference**: `apps/web/src/components/features/goals/GoalCard.tsx`
**Location**: `apps/native/src/components/features/goals/GoalCard.tsx`
**Reuse**: `calculateGoalProgress()` from `@kakeibo/core/services/calculations/goalProgress`
- [ ] Create GoalCard with circular progress indicator
- [ ] Display goal icon, name, type badge (Savings/Debt)
- [ ] Show progress percentage and remaining amount
- [ ] Add "Contribute" button (opens ContributeGoalModal)

### 4C.4 AccountCard Component (0/3)
**Reference**: `apps/web/src/components/features/accounts/AccountCard.tsx`
**Location**: `apps/native/src/components/features/accounts/AccountCard.tsx`
- [ ] Create AccountCard displaying account name, type, balance
- [ ] Add type badge (Cash, Bank, Credit Card, Investment)
- [ ] Add isActive/isArchived indicator

### 4C.5 AddTransactionModal Component (0/7)
**Reference**: `apps/web/src/components/features/transactions/AddTransactionModal.tsx`
**Location**: `apps/native/src/components/features/transactions/AddTransactionModal.tsx`
**Forms**: Use `react-hook-form` + `@hookform/resolvers/zod`
**Schema**: `createTransactionSchema` from `@kakeibo/core/schemas`
- [ ] Install `react-hook-form` and `@hookform/resolvers`
- [ ] Create form with type selector (Expense, Income, Transfer)
- [ ] Add dynamic fields based on type (show toAccountId for transfers)
- [ ] Add CategorySelect integration
- [ ] Add DatePicker integration
- [ ] Add validation with Zod schema
- [ ] Handle create/update mode (check if editing transaction exists)

### 4C.6 AddBudgetModal Component (0/4)
**Reference**: `apps/web/src/components/features/budgets/AddBudgetModal.tsx`
**Location**: `apps/native/src/components/features/budgets/AddBudgetModal.tsx`
**Schema**: `createBudgetSchema` from `@kakeibo/core/schemas`
- [ ] Create form with name, amount, period inputs
- [ ] Add MultiCategorySelect for categoryIds (array of strings)
- [ ] Add date range inputs (startDate, endDate)
- [ ] Handle create/update mode

### 4C.7 AddGoalModal Component (0/4)
**Reference**: `apps/web/src/components/features/goals/AddGoalModal.tsx`
**Location**: `apps/native/src/components/features/goals/AddGoalModal.tsx`
**Schema**: `createGoalSchema` from `@kakeibo/core/schemas`
- [ ] Create form with name, type (Savings/Debt), targetAmount, deadline
- [ ] Add icon picker (optional)
- [ ] Add currentAmount input (optional)
- [ ] Handle create/update mode

### 4C.8 ContributeGoalModal Component (0/4)
**Reference**: `apps/web/src/components/features/goals/ContributeGoalModal.tsx`
**Location**: `apps/native/src/components/features/goals/ContributeGoalModal.tsx`
**Actions**: Contribute (add) or Withdraw (subtract)
- [ ] Create form with amount input and action selector (Contribute/Withdraw)
- [ ] Show current progress and remaining amount
- [ ] Call `adapter.contributeToGoal()` or `adapter.withdrawFromGoal()`
- [ ] Show toast notification on success

### 4C.9 AddAccountModal Component (0/4)
**Reference**: `apps/web/src/components/features/accounts/AddAccountModal.tsx`
**Location**: `apps/native/src/components/features/accounts/AddAccountModal.tsx`
**Schema**: `createAccountSchema` from `@kakeibo/core/schemas`
- [ ] Create form with name, type, balance, currency inputs
- [ ] Add type selector (Cash, Bank, Credit Card, Investment, Loan)
- [ ] Add isActive toggle (checkbox)
- [ ] Handle create/update mode

**Total Phase 4C**: 0/41 tasks (Updated from 21 - more granular breakdown)

---

## 🔴 Phase 4D: State Management & Hooks - HIGH PRIORITY

> **Reference**: `apps/web/src/store/` and `apps/web/src/hooks/`  
> **State**: Zustand with persist middleware (AsyncStorage)

### 4D.1 App Store Setup (0/4)
**Reference**: `apps/web/src/store/appStore.ts` (185 lines)
**Location**: `apps/native/src/store/appStore.ts`
- [ ] Install Zustand: `yarn workspace @kakeibo/native add zustand`
- [ ] Create AppState interface (currentUser, settings, UI state, modal states, editing states)
- [ ] Implement store with persist middleware (use AsyncStorage)
- [ ] Export store hook: `useAppStore()`

### 4D.2 Custom Hooks - Database Operations (0/5)
**Reference**: `apps/web/src/hooks/` (8 hook files)
**Pattern**: Separate query hooks (data) from action hooks (mutations)
- [ ] Create `useTransactions()` hook with SQLiteAdapter queries (get transactions with filters)
- [ ] Create `useAccounts()`, `useBudgets()`, `useGoals()`, `useCategories()` hooks
- [ ] Create action hooks: `useTransactionActions()` (create, update, delete), etc.
- [ ] Add loading states and error handling in hooks
- [ ] Add optimistic updates for better UX

### 4D.3 Auth Hook (0/2)
**Reference**: `apps/web/src/hooks/useAuth.ts` (complete Supabase integration)
**Location**: `apps/native/src/hooks/useAuth.ts`
**Reuse**: `createGuestUser()` from `@kakeibo/core/services/auth`
- [ ] Port `useAuth()` hook with Supabase integration (Google OAuth)
- [ ] Implement guest mode (startAsGuest) and guest-to-authenticated migration

### 4D.4 Utility Hooks (0/1)
**Reference**: `apps/web/src/hooks/useCurrency.ts`
**Location**: `apps/native/src/hooks/useCurrency.ts`
**Reuse**: `formatCurrency()` from `@kakeibo/core/utils/formatters`
- [ ] Create `useCurrency()` hook (returns formatCurrency function and current currency symbol)

**Total Phase 4D**: 0/12 tasks

---

## 🔴 Phase 4E: Navigation & Routing - HIGH PRIORITY

> **Library**: React Navigation (Bottom Tabs + Stack)  
> **Reference**: Web uses TanStack Router, but we'll adapt the same structure

### 4E.1 Navigation Setup (0/5)
**Dependencies**: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`
- [ ] Install React Navigation core: `yarn workspace @kakeibo/native add @react-navigation/native react-native-screens react-native-safe-area-context`
- [ ] Install navigators: `yarn workspace @kakeibo/native add @react-navigation/bottom-tabs @react-navigation/stack`
- [ ] Install gesture handler: `yarn workspace @kakeibo/native add react-native-gesture-handler react-native-reanimated`
- [ ] Configure gesture handler in index.js (import 'react-native-gesture-handler' at top)
- [ ] Set up TypeScript types for navigation (RootStackParamList, TabParamList)

### 4E.2 Bottom Tab Navigator (0/3)
**Reference**: Web has 6 tabs (Dashboard, Transactions, Budgets, Analytics, Goals, Accounts)
**Location**: `apps/native/src/navigation/TabNavigator.tsx`
- [ ] Create bottom tab navigator with 6 tabs
- [ ] Add tab bar icons using Lucide icons (Home, Receipt, Wallet, TrendingUp, Target, CreditCard)
- [ ] Style tab bar (dark theme, active/inactive colors)

### 4E.3 Stack Navigator for Modals (0/2)
**Location**: `apps/native/src/navigation/RootNavigator.tsx`
- [ ] Create root stack navigator (wraps tab navigator)
- [ ] Add modal screens (Settings, Welcome) with slide-up animation

**Total Phase 4E**: 0/10 tasks

---

## 🔴 Phase 4F: Screens Implementation - HIGH PRIORITY

> **Reference**: All web pages in `apps/web/src/pages/`  
> **Reuse**: All calculations from `@kakeibo/core/services/calculations/`

### 4F.1 Dashboard Screen (0/12)
**Reference**: `apps/web/src/pages/Dashboard/DashboardPage.tsx` (complete implementation)
**Location**: `apps/native/src/screens/DashboardScreen.tsx`
**Reuse**: `calculateMonthlyStats()`, `calculateSpendingByCategory()` from `@kakeibo/core/services/calculations/statistics`
- [ ] Create hero balance card (credit card style with curved lines background)
- [ ] Add account picker dropdown (All Accounts + individual accounts)
- [ ] Add balance visibility toggle (eye icon)
- [ ] Create monthly stats section (Income, Expenses, Savings with gradient meter)
- [ ] Create top spending by category section (top 4 cards with CategoryIcon)
- [ ] Create budgets at risk section (≥70% spent, top 3 with ProgressBar)
- [ ] Create active goals section (top 2 with circular progress)
- [ ] Create accounts section (top 3 with balances)
- [ ] Create recent transactions section (last 5 with TransactionCard)
- [ ] Add empty state for new users (no data)
- [ ] Add navigation links to all sections (View All → navigate to respective tab)
- [ ] Add pull-to-refresh functionality

### 4F.2 Transactions Screen (0/10)
**Reference**: `apps/web/src/pages/Transactions/TransactionsPage.tsx`
**Location**: `apps/native/src/screens/TransactionsScreen.tsx`
**List**: Use FlatList with virtualization for performance
- [ ] Create transaction list with FlatList (render TransactionCard)
- [ ] Add type filter (All, Expense, Income, Transfer) - horizontal ScrollView chips
- [ ] Add category filter dropdown (bottom sheet)
- [ ] Add account filter dropdown (bottom sheet)
- [ ] Add date range filter (This Month, Last Month, This Year, All Time)
- [ ] Add search by description (debounced input, 300ms delay)
- [ ] Implement edit transaction (open AddTransactionModal with pre-filled data)
- [ ] Implement delete transaction with confirmation alert
- [ ] Add empty states (no transactions, no search results)
- [ ] Add pull-to-refresh and infinite scroll (pagination)

### 4F.3 Budgets Screen (0/9)
**Reference**: `apps/web/src/pages/Budgets/BudgetsPage.tsx`
**Location**: `apps/native/src/screens/BudgetsScreen.tsx`
**Reuse**: `calculateBudgetProgress()` from `@kakeibo/core`
- [ ] Create monthly overview card (total budget, total spent, remaining)
- [ ] Add overall progress bar (color-coded: green <70%, yellow 70-99%, red ≥100%)
- [ ] Create budget list with FlatList (render BudgetCard)
- [ ] Show multi-category chips for each budget
- [ ] Show alert badges for budgets at risk
- [ ] Show days remaining in month
- [ ] Add daily average spending insight
- [ ] Implement edit budget (open AddBudgetModal)
- [ ] Add empty state with create budget CTA

### 4F.4 Analytics Screen (0/8)
**Reference**: `apps/web/src/pages/Analytics/AnalyticsPage.tsx`
**Location**: `apps/native/src/screens/AnalyticsScreen.tsx`
**Charts**: Use `react-native-chart-kit` or `victory-native`
**Reuse**: All data aggregation from `@kakeibo/core/services/calculations/statistics`
- [ ] Install chart library: `yarn workspace @kakeibo/native add react-native-chart-kit react-native-svg`
- [ ] Create time range selector (7D, 1M, 3M, 6M) - horizontal chips
- [ ] Create spending trend chart (line chart, shows daily/weekly/monthly spending)
- [ ] Create category breakdown chart (donut chart with legend)
- [ ] Add subcategory drill-down (tap on category → show subcategories)
- [ ] Create monthly comparison chart (bar chart, compare months)
- [ ] Add empty states for no data
- [ ] Add ScrollView wrapper for scrollable analytics

### 4F.5 Goals Screen (0/7)
**Reference**: `apps/web/src/pages/Goals/GoalsPage.tsx`
**Location**: `apps/native/src/screens/GoalsScreen.tsx`
**Reuse**: `calculateGoalProgress()` from `@kakeibo/core`
- [ ] Create overview card (total saved, total target, overall progress with circular indicator)
- [ ] Create goals list with FlatList (render GoalCard)
- [ ] Add type badges (Savings/Debt) with color coding
- [ ] Show deadline warnings (30-day alerts for goals near deadline)
- [ ] Implement contribute button (open ContributeGoalModal)
- [ ] Implement edit goal (open AddGoalModal)
- [ ] Add empty state with create goal CTA

### 4F.6 Accounts Screen (0/6)
**Reference**: `apps/web/src/pages/Accounts/AccountsPage.tsx`
**Location**: `apps/native/src/screens/AccountsScreen.tsx`
**Reuse**: Account aggregation from core
- [ ] Create net worth overview card (total assets - total liabilities)
- [ ] Create account list with FlatList (render AccountCard)
- [ ] Add account type grouping (Cash, Bank, Credit Card, Investment, Loan)
- [ ] Show balance for each account (color-coded by positive/negative)
- [ ] Implement edit account (open AddAccountModal)
- [ ] Add empty state with create account CTA

### 4F.7 Settings Screen (0/10)
**Reference**: `apps/web/src/pages/Settings/SettingsPage.tsx`
**Location**: `apps/native/src/screens/SettingsScreen.tsx`
**Reuse**: Import/export logic from `@kakeibo/core/services/database/migrations`
- [ ] Create profile section (avatar, name, email from OAuth)
- [ ] Add currency selector (Select component with currency list)
- [ ] Add date format preference (Select component)
- [ ] Add theme toggle (Light/Dark/System) with radio buttons
- [ ] Add financial month start day selector (1-28)
- [ ] Add notification preferences section (4 toggles: budget alerts, bill reminders, weekly reports, unusual spending)
- [ ] Add export database button (downloads JSON via Share API)
- [ ] Add import database button (file picker → import)
- [ ] Add sign out button with data retention option (alert dialog)
- [ ] Show app version and build number at bottom

### 4F.8 Welcome Screen (0/8)
**Reference**: `apps/web/src/pages/Welcome/WelcomePage.tsx`
**Location**: `apps/native/src/screens/WelcomeScreen.tsx`
**Reuse**: Auth logic from `@kakeibo/core/services/auth`
- [ ] Create onboarding slides (3-4 slides explaining features)
- [ ] Add slide indicators (dots at bottom)
- [ ] Add "Sign in with Google" button (Supabase OAuth)
- [ ] Add "Continue as Guest" button (calls createGuestUser)
- [ ] Add swipe gesture to navigate slides (PanResponder or Reanimated)
- [ ] Add "Skip" button (top-right)
- [ ] Navigate to Dashboard after auth (check hasCompletedOnboarding)
- [ ] Animate transitions between slides

**Total Phase 4F**: 0/70 tasks (Updated from 60 - more granular)

---

## 🟡 Phase 4G: Advanced Features - MEDIUM PRIORITY
---

## 🟡 Phase 4G: Advanced Features - MEDIUM PRIORITY

### 4G.1 Biometric Authentication (0/3)
**Library**: `react-native-biometrics`
- [ ] Install `react-native-biometrics`
- [ ] Add Face ID/Touch ID prompt on app launch (optional, user preference)
- [ ] Store biometric preference in AsyncStorage

### 4G.2 Local Push Notifications (0/3)
**Library**: `@react-native-community/push-notification-ios` + `react-native-push-notification`
- [ ] Install notification libraries
- [ ] Implement budget alert notifications (when budget ≥90% spent)
- [ ] Implement bill reminder notifications (configurable in settings)

### 4G.3 Camera Integration (0/2)
**Library**: `react-native-camera` or `react-native-image-picker`
**Feature**: Receipt capture for transactions
- [ ] Install camera library
- [ ] Add camera button in AddTransactionModal (capture receipt, store as base64 or file path)

### 4G.4 Haptic Feedback (0/1)
**Built-in**: `react-native-haptic-feedback`
- [ ] Add haptic feedback on button presses, swipe actions, delete confirmations

### 4G.5 Share Functionality (0/2)
**Built-in**: React Native Share API
- [ ] Add "Share" button in export functionality (share JSON backup file)
- [ ] Add share analytics report as PDF (future)

### 4G.6 Dark Mode with System Preference (0/2)
**Built-in**: `useColorScheme` hook
- [ ] Detect system theme preference on launch
- [ ] Update theme when system preference changes (listen to Appearance events)

### 4G.7 Offline-First with Background Sync (0/3)
**Library**: `@react-native-community/netinfo`
- [ ] Install NetInfo for network status detection
- [ ] Show offline banner when no network
- [ ] Queue mutations when offline, sync when back online (use AsyncStorage queue)

### 4G.8 Pull-to-Refresh (0/1)
**Built-in**: FlatList `refreshControl` prop
- [ ] Add pull-to-refresh on all list screens (already planned in screen tasks above)

### 4G.9 Swipe Actions on List Items (0/2)
**Library**: `react-native-swipeable-item` or custom
- [ ] Add swipe-to-edit on TransactionCard (swipe right → Edit)
- [ ] Add swipe-to-delete on TransactionCard (swipe left → Delete with confirmation)

**Total Phase 4G**: 0/19 tasks (Updated from 13)

---

## 🎯 Code Reuse Strategy

### ✅ Shared from `@kakeibo/core` (~70%)

**Types & Schemas**:
- All entity types (Account, Transaction, Category, Budget, Goal, User)
- All Zod schemas (validation rules)
- All TypeScript interfaces

**Business Logic**:
- Budget calculations (progress, spending rate, alerts) ✅
- Goal calculations (progress, contributions, projections) ✅
- Stats calculations (income, expenses, savings, trends) ✅
- Date utilities (financial month, date ranges) ✅
- Currency formatting ✅
- Auth logic (guest mode, OAuth, data migration) ✅

**Constants**:
- Default categories (52 expense + 18 income) ✅
- Currency list ✅
- Date format options ✅
- Color tokens (design system) ✅

### ❌ Platform-Specific (~30%)

**Database**:
- SQLiteAdapter (instead of DexieAdapter)
- OP-SQLite queries (instead of Dexie queries)
- SQL table definitions

**UI Components**:
- React Native components (View, Text, TouchableOpacity, FlatList)
- Native animations (Animated API or Reanimated)
- Platform-specific styling (UniWind)

**Navigation**:
- React Navigation (instead of TanStack Router)
- Tab navigator, Stack navigator
- Native gestures

**Libraries**:
- Charts: react-native-chart-kit (instead of Recharts)
- Forms: react-hook-form (same as web ✅)
- Icons: lucide-react-native (same as web ✅)
- Date picker: @react-native-community/datetimepicker (instead of HTML input)

---

## 📱 Platform Considerations

### iOS
- Safe area handling (notch, home indicator) - use `react-native-safe-area-context`
- Navigation bar styling (match iOS design guidelines)
- Haptic feedback (use `react-native-haptic-feedback`)
- Face ID authentication (use `react-native-biometrics`)

### Android
- Material Design patterns (use Paper components if needed)
- Back button handling (navigate back in stack)
- Fingerprint authentication (use `react-native-biometrics`)
- System navigation bar (handle edge-to-edge layout)

### Performance
- FlatList for long lists (virtualization) ✅
- React.memo for expensive components ✅
- useCallback for event handlers ✅
- Lazy loading for screens (React Navigation lazy loading)
- Optimize re-renders (React DevTools Profiler)

---

## 🚀 Development Workflow

### Setup
```bash
# Install dependencies (from monorepo root)
yarn install

# iOS setup (macOS only)
cd apps/native/ios && pod install && cd -

# Build core package first (required)
yarn build:core

# Start Metro bundler
yarn dev:native
```

### Development
```bash
# Terminal 1: Metro bundler
yarn dev:native

# Terminal 2: Run on Android
yarn android

# Terminal 2: Run on iOS (macOS only)
yarn ios

# Hot reload on save (Metro fast refresh)
```

### Debugging
- React Native Debugger (for Redux/Zustand state)
- Flipper (for network requests, database inspection)
- React DevTools (component tree)
- Console logs (LogBox)

---

## 📝 Testing Strategy

### Unit Tests
- Database adapter methods (SQLite CRUD) - use Jest with in-memory SQLite
- Component rendering - use React Native Testing Library
- Hook tests - use `@testing-library/react-hooks`

### Integration Tests
- Transaction flow (create → update balance)
- Budget progress calculations
- Goal contribution logic

### E2E Tests (Detox)
- Install Detox: `yarn workspace @kakeibo/native add -D detox`
- Critical user flows (add transaction, create budget, view dashboard)
- Authentication flow (guest mode, OAuth)
- Data import/export

---

## 🎨 Design System Alignment

> **Source**: All color tokens from `@kakeibo/core/styles/colors.ts`

### Colors (Match Web)
```typescript
// Primary - Purple Blue
--color-primary-500: #5B6EF5

// Success/Income - Emerald Green
--color-success-500: #10b981

// Danger/Expense - Rose
--color-danger-500: #f43f5e

// Warning - Amber
--color-warning-500: #f59e0b

// Surface (Dark Greys)
--color-surface-50: #f8f9fa (lightest)
--color-surface-800: #1e1e2e (card background)
--color-surface-950: #0a0a0f (darkest)
```

### Typography
- **Headings**: 24px (h1), 20px (h2), 18px (h3), 16px (h4)
- **Body**: 14px (base), 13px (small)
- **Caption**: 12px (muted text)
- **Font Family**: System default
  - iOS: SF Pro Display / SF Pro Text
  - Android: Roboto

### Spacing Scale
```typescript
// Base unit: 4px
const spacing = {
  0.5: 2,   // 2px
  1: 4,     // 4px
  1.5: 6,   // 6px
  2: 8,     // 8px
  3: 12,    // 12px
  4: 16,    // 16px
  6: 24,    // 24px
  8: 32,    // 32px
  12: 48,   // 48px
  16: 64,   // 64px
  20: 80,   // 80px
  24: 96,   // 96px
}
```

### Border Radius
- **Small**: 8px (badges, chips)
- **Medium**: 12px (buttons, inputs)
- **Large**: 16px (cards)
- **XLarge**: 20px (modals, hero cards)

### Shadow (iOS only, elevation on Android)
```typescript
// iOS shadows
shadow-sm: { shadowRadius: 2, shadowOpacity: 0.1 }
shadow-md: { shadowRadius: 4, shadowOpacity: 0.15 }
shadow-lg: { shadowRadius: 8, shadowOpacity: 0.2 }

// Android elevation
elevation: 2, 4, 8
```

---

## 🔗 Dependencies

### Already Installed ✅
- `react-native`: 0.83.1 ✅
- `react`: 19.2.0 ✅
- `zustand`: 5.0.9 ✅ (state management)
- `react-native-safe-area-context`: ✅
- `@kakeibo/core`: workspace:* ✅

### Phase 4A (Database) - To Install
```bash
yarn workspace @kakeibo/native add @op-engineering/op-sqlite
yarn workspace @kakeibo/native add @react-native-async-storage/async-storage
```

### Phase 4B (UI) - To Install
```bash
yarn workspace @kakeibo/native add lucide-react-native
yarn workspace @kakeibo/native add @react-native-community/datetimepicker
```

### Phase 4C (Forms) - To Install
```bash
yarn workspace @kakeibo/native add react-hook-form @hookform/resolvers
```

### Phase 4E (Navigation) - To Install
```bash
yarn workspace @kakeibo/native add @react-navigation/native react-native-screens react-native-safe-area-context
yarn workspace @kakeibo/native add @react-navigation/bottom-tabs @react-navigation/stack
yarn workspace @kakeibo/native add react-native-gesture-handler react-native-reanimated
```

### Phase 4F (Analytics Charts) - To Install
```bash
yarn workspace @kakeibo/native add react-native-chart-kit react-native-svg
# OR
yarn workspace @kakeibo/native add victory-native
```

### Phase 4G (Advanced) - To Install Later
```bash
# Biometrics
yarn workspace @kakeibo/native add react-native-biometrics

# Notifications
yarn workspace @kakeibo/native add @react-native-community/push-notification-ios react-native-push-notification

# Camera
yarn workspace @kakeibo/native add react-native-image-picker

# Network status
yarn workspace @kakeibo/native add @react-native-community/netinfo

# Haptics
yarn workspace @kakeibo/native add react-native-haptic-feedback

# Swipeable items
yarn workspace @kakeibo/native add react-native-swipeable-item
```

---

## 📅 Estimated Timeline

**Phase 4A (Database)**: 4-5 days ⏱️  
**Phase 4B (Core UI)**: 5-6 days ⏱️  
**Phase 4C (Feature Components)**: 4-5 days ⏱️  
**Phase 4D (State & Hooks)**: 2-3 days ⏱️  
**Phase 4E (Navigation)**: 2-3 days ⏱️  
**Phase 4F (Screens)**: 12-14 days ⏱️  
**Phase 4G (Advanced Features)**: 6-8 days ⏱️

**Total**: ~5-6 weeks to feature parity with web 🎯

---

## ✅ Success Criteria

Mobile app achieves feature parity with web when:

1. ✅ All screens match web functionality
2. ✅ SQLite adapter passes same tests as Dexie adapter
3. ✅ All calculations produce identical results (core logic reused)
4. ✅ Import/export works cross-platform (web ↔ mobile)
5. ✅ Auth state syncs via Supabase (Google OAuth)
6. ✅ UI matches design system (dark elegant theme)
7. ✅ Performance: 60fps animations, <100ms interactions
8. ✅ Works offline (local-first architecture)
9. ✅ iOS and Android builds working
10. ✅ All E2E tests passing (Detox)

---

## 🎯 Next Steps - Start Here! 🚀

### Immediate Actions (Week 1)

**Day 1-2: Database Foundation**
1. Install OP-SQLite and AsyncStorage
2. Create database schema (6 tables)
3. Implement database connection and helpers

**Day 3-4: User & Account Operations**
4. Implement User CRUD in SQLiteAdapter
5. Implement Account CRUD with balance tracking
6. Test database operations in isolation

**Day 5: Category & Transaction Operations**
7. Implement Category CRUD with defaults
8. Start Transaction CRUD implementation

### Week 2: Complete Database + Start UI

**Day 6-7: Finish Database Layer**
9. Complete Transaction operations with filters
10. Implement Budget and Goal operations
11. Implement Import/Export with v1 compatibility
12. Write database integration tests

**Day 8-10: Core UI Components**
13. Implement Button, Input, Card, Badge components
14. Implement ProgressBar, Checkbox, Modal components
15. Set up UniWind styling system

### Week 3-4: Feature Components + State

Continue with Phase 4C, 4D, 4E...

---

## 📚 Reference Documents

- **Architecture**: `/kakeibo-v2/.github/copilot-instructions.md`
- **Web Implementation**: `/kakeibo-v2/web.md`
- **Progress Tracking**: `/kakeibo-v2/PROGRESS.md`
- **Detailed Roadmap**: `/kakeibo-v2/TODO.md`
- **v1 Reference** (for UI patterns only): `/kakeibo/.github/copilot-instructions.md`

---

## 💡 Development Tips

### Code Organization
- Keep files small (<200 lines where possible)
- One component per file
- Separate logic from UI (hooks vs components)
- Use barrel exports (index.ts files)

### Performance
- Use `React.memo()` for list items (TransactionCard, BudgetCard, etc.)
- Use `useCallback()` for event handlers passed to children
- Use `useMemo()` for expensive calculations
- Optimize FlatList with `getItemLayout` for fixed-height items

### Debugging
- Use `console.log` for quick debugging (React Native Debugger)
- Use Flipper for network and database inspection
- Use React DevTools for component tree
- Use Hermes for better performance (enable in android/app/build.gradle)

### Testing
- Write tests as you build (TDD approach)
- Test database operations first (foundation)
- Test components in isolation (React Native Testing Library)
- Test user flows with Detox (E2E)

---

**Let's build an amazing mobile app! 🚀📱**
