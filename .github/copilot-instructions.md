# Kakeibo v2 - GitHub Copilot Instructions

## Project Overview

**Kakeibo v2** is a cross-platform personal finance management app built with a modern monorepo architecture. This is a complete rewrite of the original Kakeibo v1 app (found in `/kakeibo` workspace) with improved architecture, separation of concerns, and better type safety.

### Key Objectives

1. **Platform-Agnostic Core**: All business logic, types, and services live in `@kakeibo/core` and work identically on web and native
2. **Type Safety**: Zod schemas for runtime validation, TypeScript types for compile-time safety
3. **Code Reuse**: Maximum code sharing between web (React) and native (React Native)
4. **Modern Stack**: Latest versions of React 19, TypeScript 5, Vite 7, React Native 0.83

---

## Architecture

### Monorepo Structure

```
kakeibo-v2/
├── apps/
│   ├── web/              # React web app (Vite + TanStack Router)
│   │   ├── src/
│   │   │   ├── components/    # Web-specific UI components
│   │   │   ├── routes/        # TanStack Router pages
│   │   │   └── services/
│   │   │       └── db/        # DexieAdapter (IndexedDB wrapper)
│   │   └── package.json       # @kakeibo/web
│   │
│   └── native/           # React Native mobile app
│       ├── android/           # Android native code
│       ├── ios/               # iOS native code
│       ├── src/
│       │   ├── components/    # Native-specific UI components
│       │   ├── screens/       # Navigation screens
│       │   └── services/
│       │       └── db/        # SQLiteAdapter (OP-SQLite wrapper)
│       └── package.json       # @kakeibo/native
│
└── packages/
    └── core/             # Platform-agnostic shared code
        ├── src/
        │   ├── types/         # Entity type definitions
        │   ├── schemas/       # Zod validation schemas
        │   ├── services/
        │   │   ├── database/  # IDatabaseAdapter interface
        │   │   ├── calculations/  # Budget/Goal/Stats services
        │   │   ├── formatters/    # Currency/Date formatters
        │   │   └── auth/          # Guest user & OAuth logic
        │   └── index.ts       # Single entry point
        └── package.json       # @kakeibo/core
```

### Key Architectural Patterns

#### 1. **Schema vs Entity Pattern**

We separate input/output schemas (Zod) from internal entity types (TypeScript):

```typescript
// Schemas (runtime validation, user-facing)
export const createTransactionSchema = z.object({
  amount: z.string(),           // String from form input
  date: z.string(),             // ISO date string
  // ... other fields
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

// Entities (internal storage, type-safe)
export interface Transaction {
  amount: number;               // Parsed number
  date: Date;                   // Date object
  // ... other fields
}
```

**Why?**
- Forms work with strings (inputs, date pickers)
- Database stores proper types (numbers, Date objects)
- Adapters handle conversion between the two

#### 2. **Platform Adapters**

The `IDatabaseAdapter` interface defines all database operations. Each platform implements it:

- **Web**: `DexieAdapter` (IndexedDB via Dexie.js)
- **Native**: `SQLiteAdapter` (SQLite via OP-SQLite) - *not yet implemented*

```typescript
interface IDatabaseAdapter {
  // User operations
  getUser(userId: string): Promise<User | undefined>;
  createUser(user: User): Promise<User>;
  
  // Transaction operations
  getTransactions(userId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  createTransaction(userId: string, input: CreateTransactionInput): Promise<Transaction>;
  // ... 30+ more methods
}
```

**Benefits:**
- UI code is platform-agnostic
- Easy to test with mock adapters
- Can swap storage engines without changing business logic

#### 3. **ID Prefixes for Debugging**

All entities use prefixed IDs for better debugging and clarity:

```typescript
// ID generators
const generateTransactionId = () => `tr-${nanoid()}`;     // tr-abc123
const generateAccountId = () => `acc-${nanoid()}`;        // acc-xyz789
const generateCategoryId = () => `cat-${nanoid()}`;       // cat-def456
const generateBudgetId = () => `bud-${nanoid()}`;         // bud-ghi789
const generateGoalId = () => `goal-${nanoid()}`;          // goal-jkl012
```

**Why?**
- Instantly recognize entity type in logs
- Easier debugging in database inspectors
- Prevents mixing up IDs across entities

---

## Type System Details

### Critical Type Mappings

#### 1. **isActive vs isArchived Confusion**

Different entities use different patterns - be careful!

**Accounts & Budgets:**
- **Entity field**: `isActive: boolean` (true = active, false = archived)
- **Schema field**: `isArchived?: boolean` (optional, user intent)
- **Mapping**: `isActive = !isArchived`

```typescript
// In DexieAdapter
const account: Account = {
  // ... other fields
  isActive: !(input.isArchived ?? false),  // Invert: archived = not active
};
```

**Goals:**
- **Entity field**: `status: 'active' | 'completed' | 'cancelled'`
- **Schema field**: `isArchived?: boolean` (optional)
- **Mapping**: `status = isArchived ? 'cancelled' : 'active'`

```typescript
// In DexieAdapter
const goal: Goal = {
  // ... other fields
  status: input.isArchived ? 'cancelled' : 'active',
};
```

**Filters:**
- **Account filters**: Use `isArchived?: boolean`
- **Goal filters**: Use `isArchived?: boolean` and `isCompleted?: boolean`

#### 2. **Date Conversions**

Schemas accept ISO strings, entities use Date objects:

```typescript
// Schema (form input)
export const createTransactionSchema = z.object({
  date: z.string().min(1, 'Date is required'),  // "2024-12-20"
});

// Entity (storage)
export interface Transaction {
  date: Date;  // Date object
}

// Adapter conversion
const transaction: Transaction = {
  date: input.date ? new Date(input.date) : new Date(),
};
```

**Always convert in adapters!**

#### 3. **Amount String → Number**

Forms use strings (for input validation), database uses numbers:

```typescript
// Schema
amount: z.string().min(1, 'Amount is required'),

// Entity
amount: number,

// Conversion
amount: typeof input.amount === 'string' ? parseFloat(input.amount) : input.amount,
```

#### 4. **Budget Multi-Category Support**

Budgets track MULTIPLE categories:

```typescript
// Single category in v1 (old)
categoryId: string;

// Multiple categories in v2 (current)
categoryIds: string[];

// Filter still uses singular for searching
filters.categoryId && budget.categoryIds.includes(filters.categoryId)
```

#### 5. **Goal Icon Field**

Goals have a required `icon` field in the entity, but optional in schema:

```typescript
// Schema (optional)
icon: z.string().optional(),

// Entity (required)
icon: string,

// Provide default in adapter
icon: input.icon ?? 'target',
```

---

## Technology Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **Yarn** | 4.7.0 | Package manager (Corepack) |
| **Turborepo** | 2.6.3 | Monorepo orchestration |
| **TypeScript** | 5.9.3 | Type safety |
| **Biome** | 2.3.10 | Linting & formatting |
| **Zod** | 4.2.1 | Schema validation |
| **Zustand** | 5.0.9 | State management |

### Web Platform

| Package | Version | Purpose |
|---------|---------|---------|
| **React** | 19.2.3 | UI framework |
| **Vite** | 7.3.0 | Build tool |
| **TanStack Router** | 1.132.0 | File-based routing |
| **Dexie** | 4.2.1 | IndexedDB wrapper |
| **dexie-react-hooks** | 4.2.0 | React hooks for Dexie |

### Native Platform

| Package | Version | Purpose |
|---------|---------|---------|
| **React Native** | 0.83.1 | Mobile framework |
| **OP-SQLite** | TBD | SQLite wrapper (planned) |

---

## Development Workflow

### Commands

```bash
# Install dependencies
yarn install

# Development
yarn dev:web           # Start web dev server (port 3000)
yarn dev:native        # Start Metro bundler
yarn android           # Run Android emulator
yarn ios               # Run iOS simulator

# Build
yarn build             # Build all packages (Turbo)
yarn build:web         # Build web only
yarn build:core        # Build core only

# Quality checks
yarn lint              # Lint all packages (Biome)
yarn format            # Format all files (Biome)
yarn typecheck         # TypeScript check (Turbo)

# Testing
yarn test              # Run tests (when added)
```

### Git Workflow

We use **conventional commits** with **Lefthook** pre-commit hooks:

```bash
# Commit format
feat(web): add transaction filtering
fix(core): correct budget calculation
docs(readme): update installation steps
chore(deps): upgrade react to 19.2.3

# Pre-commit hooks run automatically:
# 1. Biome format (auto-fix)
# 2. Biome lint (check only)
# 3. TypeScript check (all packages)

# Commit message validation
# - Must follow conventional commit format
# - Enforced by commitlint
```

### Turborepo Caching

Turborepo caches build outputs for speed:

```bash
# Cache hit (instant)
@kakeibo/core:build: cache hit, replaying logs

# Cache miss (builds)
@kakeibo/core:build: cache miss, executing
```

**Clear cache if needed:**
```bash
yarn turbo clean
```

---

## Code Patterns

### 1. **DexieAdapter Pattern (Web Database)**

```typescript
export class DexieAdapter implements IDatabaseAdapter {
  async createTransaction(userId: string, input: CreateTransactionInput): Promise<Transaction> {
    // 1. Generate prefixed ID
    const id = generateTransactionId();
    
    // 2. Convert types (string → number, string → Date)
    const transaction: Transaction = {
      id,
      userId,
      amount: parseFloat(input.amount),
      date: new Date(input.date),
      // ... other fields
    };
    
    // 3. Wrap in Dexie transaction for atomicity
    await db.transaction('rw', [db.transactions, db.accounts], async () => {
      // 4. Update related entities (e.g., account balances)
      await this.applyTransactionBalance(transaction);
      
      // 5. Add to database
      await db.transactions.add(transaction);
    });
    
    return transaction;
  }
}
```

### 2. **Filter Implementation**

```typescript
async getTransactions(
  userId: string,
  filters?: TransactionFilters,
  options?: QueryOptions
): Promise<Transaction[]> {
  // 1. Get all user's transactions
  let transactions = await db.transactions
    .where('userId')
    .equals(userId)
    .toArray();
  
  // 2. Apply filters
  if (filters) {
    transactions = transactions.filter(t => this.matchesFilters(t, filters));
  }
  
  // 3. Apply sorting
  if (options?.sortBy) {
    transactions.sort((a, b) => {
      const aVal = a[options.sortBy];
      const bVal = b[options.sortBy];
      if (aVal === undefined || bVal === undefined) return 0;
      return options.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }
  
  // 4. Apply pagination
  if (options?.limit) {
    transactions = transactions.slice(
      options.offset ?? 0,
      (options.offset ?? 0) + options.limit
    );
  }
  
  return transactions;
}
```

### 3. **Transaction Balance Updates**

Critical: Always update account balances atomically with transactions!

```typescript
private async applyTransactionBalance(transaction: Transaction): Promise<void> {
  const account = await db.accounts.get(transaction.accountId);
  if (!account) throw new Error('Account not found');
  
  let newBalance = account.balance;
  
  switch (transaction.type) {
    case 'expense':
      newBalance -= transaction.amount;
      break;
    case 'income':
      newBalance += transaction.amount;
      break;
    case 'transfer':
      // Deduct from source account
      newBalance -= transaction.amount;
      // Add to destination account (separate update)
      if (transaction.toAccountId) {
        const toAccount = await db.accounts.get(transaction.toAccountId);
        if (toAccount) {
          await db.accounts.update(transaction.toAccountId, {
            balance: toAccount.balance + transaction.amount,
          });
        }
      }
      break;
  }
  
  await db.accounts.update(transaction.accountId, { balance: newBalance });
}
```

---

## Entity Relationships

### Transaction Relationships

```typescript
interface Transaction {
  userId: string;           // → User
  accountId: string;        // → Account (source)
  categoryId: string;       // → Category
  subcategoryId?: string;   // → Category (child)
  toAccountId?: string;     // → Account (destination, transfers only)
  goalId?: string;          // → Goal (goal transactions only)
}
```

### Budget Relationships

```typescript
interface Budget {
  userId: string;           // → User
  categoryIds: string[];    // → Category[] (multiple!)
  startDate: Date;
  endDate?: Date;
}
```

### Goal Relationships

```typescript
interface Goal {
  userId: string;           // → User
  accountId?: string;       // → Account (optional, where funds are held)
  type: 'savings' | 'debt';
  status: 'active' | 'completed' | 'cancelled';
}
```

---

## Common Pitfalls & Solutions

### ❌ DON'T

```typescript
// 1. Don't spread input directly into entity (type mismatch!)
const transaction: Transaction = {
  id: generateId(),
  userId,
  ...input,  // ❌ amount is string, date is string
};

// 2. Don't update entities without updatedAt
await db.budgets.update(id, updates);  // ❌ Missing timestamp

// 3. Don't forget to revert balance on transaction delete
await db.transactions.delete(id);  // ❌ Account balance not reverted

// 4. Don't use null for optional fields
parentId: input.parentId ?? null,  // ❌ v2 uses undefined

// 5. Don't check for fields that don't exist
if (goal.isArchived) { }  // ❌ Goal has status, not isArchived
```

### ✅ DO

```typescript
// 1. Convert types explicitly
const transaction: Transaction = {
  id: generateTransactionId(),
  userId,
  amount: parseFloat(input.amount),
  date: new Date(input.date),
  // ... other fields
};

// 2. Always include updatedAt
await db.budgets.update(id, { ...updates, updatedAt: new Date() });

// 3. Revert balances before delete
await this.revertTransactionBalance(transaction);
await db.transactions.delete(id);

// 4. Use undefined for optionals
parentId: input.parentId ?? undefined,  // ✅ or just input.parentId

// 5. Map status to isArchived for filters
const isArchived = goal.status === 'cancelled';
```

---

## Dexie-Specific Notes

### Table Definitions

```typescript
class KakeiboDatabase extends Dexie {
  constructor() {
    super('KakeiboDB');
    
    // Version 1 schema
    this.version(1).stores({
      users: 'id, email',
      accounts: 'id, userId, type, isActive',
      categories: 'id, userId, type, parentId, isDefault, order',
      transactions: 'id, userId, accountId, categoryId, type, date, [userId+date], [userId+categoryId], [userId+accountId]',
      budgets: 'id, userId, categoryId, period, [userId+categoryId]',
      goals: 'id, userId, type, status, [userId+status]',
    });
  }
}
```

**Key Points:**
- Primary key is always first (e.g., `id`)
- Indexed fields enable fast queries (e.g., `userId`)
- Compound indexes for common queries (e.g., `[userId+date]`)
- Don't index everything (performance cost)

### Update Constraints

Dexie's `.update()` method has strict typing:

```typescript
// ❌ Can't spread schema types directly
await db.transactions.update(id, { ...updates, updatedAt: new Date() });
// Error: 'date' is string, but entity expects Date

// ✅ Convert types first
const processedUpdates: Partial<Transaction> = {};
if (updates.date) processedUpdates.date = new Date(updates.date);
if (updates.amount) processedUpdates.amount = parseFloat(updates.amount);
processedUpdates.updatedAt = new Date();
await db.transactions.update(id, processedUpdates);
```

---

## Testing Strategy (Planned)

### Unit Tests
- Test calculation services (budgets, goals, stats)
- Test formatters (currency, date)
- Test utilities

### Integration Tests
- Test database adapters with in-memory storage
- Test transaction balance updates
- Test filter/sort/pagination

### E2E Tests
- Web: Playwright
- Native: Detox

---

## Migration from v1

### Key Differences

| Feature | v1 (kakeibo) | v2 (kakeibo-v2) |
|---------|--------------|-----------------|
| Structure | Single app | Monorepo (web + native) |
| State | Zustand only | Zustand + Dexie/SQLite |
| Routing | TanStack Router | TanStack Router (web) |
| Database | Dexie (web only) | Dexie (web) + SQLite (native) |
| Categories | Single | Multiple per budget |
| IDs | Plain nanoid | Prefixed (tr-, acc-, etc.) |
| Types | Inline | Separated schemas + types |
| Build | Vite | Vite (web) + Metro (native) |

### Code Reference

Original v1 code is in `/kakeibo` workspace for reference:
- `/kakeibo/src/services/db/` - Original Dexie setup
- `/kakeibo/src/types/` - Original type definitions
- `/kakeibo/src/components/` - UI component patterns
- `/kakeibo/.github/copilot-instructions.md` - v1 instructions

**Use v1 as reference but don't copy directly** - types have evolved!

---

## Best Practices

### 1. **Always Import from @kakeibo/core**

```typescript
// ✅ Correct
import { Transaction, CreateTransactionInput } from '@kakeibo/core';

// ❌ Wrong - don't use sub-paths
import { Transaction } from '@kakeibo/core/types';
```

### 2. **Use Adapter Interface, Not Dexie Directly**

```typescript
// ✅ Correct (platform-agnostic)
const db: IDatabaseAdapter = new DexieAdapter();
const transactions = await db.getTransactions(userId);

// ❌ Wrong (couples to Dexie)
import { db } from './services/db';
const transactions = await db.transactions.toArray();
```

### 3. **Validate with Zod Before Adapter**

```typescript
// In form submission
const onSubmit = async (data: unknown) => {
  // 1. Validate with schema
  const validated = createTransactionSchema.parse(data);
  
  // 2. Pass to adapter (already validated)
  await adapter.createTransaction(userId, validated);
};
```

### 4. **Handle Dates Consistently**

```typescript
// ✅ Store as ISO strings in state/URLs
const dateStr = '2024-12-20';

// ✅ Convert to Date for adapter
const date = new Date(dateStr);

// ✅ Format for display
const formatted = format(date, 'MMM dd, yyyy');
```

### 5. **Use Prefixed IDs**

```typescript
// ✅ Always use entity-specific generators
const transactionId = generateTransactionId();  // "tr-abc123"

// ❌ Don't use generic ID for entities
const id = nanoid();  // Hard to debug
```

---

## File Naming Conventions

### Core Package
- Types: `transaction.ts` (lowercase, singular)
- Schemas: `transaction.schema.ts`
- Services: `budgetCalculations.ts` (camelCase, descriptive)
- Utils: `formatCurrency.ts` (camelCase, verb)

### Web/Native Apps
- Components: `TransactionCard.tsx` (PascalCase)
- Pages/Screens: `DashboardPage.tsx` / `DashboardScreen.tsx`
- Hooks: `useTransactions.ts` (camelCase, use prefix)
- Adapters: `DexieAdapter.ts` / `SQLiteAdapter.ts` (PascalCase)

---

## Environment & Setup

### Prerequisites
- **Node.js**: 20+ (with Corepack)
- **Yarn**: 4.7.0 (via Corepack, don't install globally)
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)

### First-Time Setup

```bash
# 1. Enable Corepack (one-time)
corepack enable

# 2. Install dependencies
yarn install

# 3. Build core package first
yarn build:core

# 4. Start development
yarn dev:web
```

### Troubleshooting

**TypeScript errors after pulling changes:**
```bash
# Rebuild core package
yarn build:core
```

**Turbo cache issues:**
```bash
# Clear cache
yarn turbo clean
```

**Biome formatting conflicts:**
```bash
# Format all files
yarn format
```

---

## Phase 3A: Web Database Implementation (Current Phase)

### ✅ Completed
1. Dexie database schema created
2. `DexieAdapter` class with all methods implemented
3. Type conversions (string → Date, string → number)
4. ID prefix system (tr-, acc-, cat-, bud-, goal-)
5. isActive/isArchived mapping documented
6. Balance update logic for transactions
7. All 33+ type errors fixed
8. Build passing ✅

### 🚧 In Progress
- None (Phase 3A complete, ready for Phase 3B)

### 📋 Next Steps (Phase 3B: Web UI Components)
1. Port UI components from v1 to v2
2. Update to use `IDatabaseAdapter` instead of Dexie directly
3. Implement with new type system
4. Add proper error handling

---

## Support & Resources

- **TODO.md**: Detailed phase-by-phase migration checklist
- **README.md**: Quick start guide
- **v1 Copilot Instructions**: `/kakeibo/.github/copilot-instructions.md`
- **Type Definitions**: `packages/core/src/types/`
- **Schemas**: `packages/core/src/schemas/`

---

## Key Reminders

1. **Always convert types** in adapters (schemas → entities)
2. **Use prefixed IDs** for all entities
3. **Handle isActive/isArchived** mapping carefully per entity
4. **Update balances atomically** with transactions
5. **Import from @kakeibo/core** only (single entry point)
6. **Test builds** after type changes (`yarn build`)
7. **Follow conventional commits** for git messages
8. **Reference v1** but don't copy - types evolved!

---

**Remember**: This is a monorepo. Changes to `@kakeibo/core` affect both web and native. Always build core first, then test both platforms!
