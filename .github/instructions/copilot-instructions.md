# Kakeibo-v2 Monorepo - LLM Developer Instructions

> **Last Updated**: December 20, 2025  
> **Project Status**: Phase 1 - Core Foundation (In Progress)  
> **Important**: Read this entire document before making ANY changes

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Critical Rules - READ FIRST](#critical-rules)
3. [Architecture Principles](#architecture-principles)
4. [Monorepo Structure](#monorepo-structure)
5. [Technology Stack](#technology-stack)
6. [Development Workflow](#development-workflow)
7. [Code Standards](#code-standards)
8. [Platform Separation Rules](#platform-separation-rules)
9. [Common Patterns](#common-patterns)
10. [How to Proceed](#how-to-proceed)

---

## 📖 Project Overview

**Kakeibo-v2** is a complete rewrite of the Kakeibo personal finance app (located at `/home/ashish/projects/kakeibo`) into a **monorepo architecture** that supports:

- 🌐 **Web**: Progressive Web App (React + Vite)
- 📱 **Native**: React Native mobile app (iOS + Android)
- 🧠 **Shared Core**: Platform-agnostic business logic

### Goal
Migrate 100% of features from the original kakeibo app while maintaining:
- Clean separation between platforms
- Shared business logic in core package
- Type safety across the entire codebase
- Scalable, maintainable architecture

---

## 🚨 CRITICAL RULES - READ FIRST

### Rule #1: ALWAYS Read Before Writing
```
NEVER copy/paste code blindly.
ALWAYS read the source file first.
ALWAYS understand what you're copying.
ALWAYS check for platform-specific dependencies.
```

### Rule #2: Platform Separation is SACRED
```
❌ NEVER import web code into native
❌ NEVER import native code into web
❌ NEVER use browser APIs in core
❌ NEVER use React Native APIs in core
```

### Rule #3: Stop and Ask
```
If you find:
  - Platform-specific imports in core code
  - Dependencies that don't work on both platforms
  - Unclear architecture decisions
  - Missing information

STOP immediately and ASK the user.
```

### Rule #4: Update TODO.md After EVERY Task
```
After completing ANY task from TODO.md:
1. Mark the checkbox as completed [x]
2. Update the progress count
3. Commit the change
4. Move to the next task
```

### Rule #5: Documentation is Mandatory
```
EVERY file you create must have:
- File header comment explaining its purpose
- JSDoc comments for all exported functions/interfaces
- Inline comments for complex logic
- Examples where helpful
```

---

## 🏗️ Architecture Principles

### The Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│           PLATFORM LAYER                │
│  apps/web/        apps/native/          │
│  - UI Components  - UI Components       │
│  - Pages/Screens  - Navigation          │
│  - Routing        - Platform Services   │
│  - Dexie DB       - OP-SQLite DB        │
└──────────────┬──────────────────────────┘
               │
               │ imports from
               ↓
┌─────────────────────────────────────────┐
│           SHARED LAYER                  │
│         packages/core/                  │
│  - Types & Interfaces                   │
│  - Business Logic                       │
│  - Calculations                         │
│  - Validation Schemas                   │
│  - Constants                            │
│  - Pure Utilities                       │
└─────────────────────────────────────────┘
```

### Dependency Flow
```
✅ ALLOWED:
   apps/web → packages/core
   apps/native → packages/core
   
❌ FORBIDDEN:
   packages/core → apps/web
   packages/core → apps/native
   apps/web → apps/native
   apps/native → apps/web
```

---

## 📁 Monorepo Structure

```
kakeibo-v2/
├── packages/
│   └── core/                    # Platform-agnostic code
│       ├── src/
│       │   ├── types/           # TypeScript interfaces
│       │   ├── constants/       # Shared constants
│       │   ├── schemas/         # Zod validation
│       │   ├── utils/           # Pure functions
│       │   ├── services/        # Business logic
│       │   │   ├── calculations/
│       │   │   ├── formatters/
│       │   │   ├── auth/
│       │   │   └── database/
│       │   ├── hooks/           # React hooks (platform-agnostic)
│       │   └── stores/          # Zustand store factories
│       └── package.json
│
├── apps/
│   ├── web/                     # Web-specific code
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/          # Radix UI components
│   │   │   │   ├── features/    # Feature components
│   │   │   │   └── layout/      # Layout components
│   │   │   ├── pages/           # React pages
│   │   │   ├── services/
│   │   │   │   ├── db/          # Dexie (IndexedDB)
│   │   │   │   └── auth/        # Supabase web SDK
│   │   │   ├── hooks/           # Web-specific hooks
│   │   │   ├── router/          # TanStack Router
│   │   │   └── styles/          # CSS/Tailwind
│   │   └── package.json
│   │
│   └── native/                  # React Native code
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/          # RN components
│       │   │   └── features/
│       │   ├── screens/         # RN screens
│       │   ├── services/
│       │   │   ├── db/          # OP-SQLite
│       │   │   └── auth/        # Supabase RN SDK
│       │   ├── hooks/           # Native-specific hooks
│       │   └── navigation/      # React Navigation
│       └── package.json
│
├── TODO.md                      # Task tracker (UPDATE AFTER EACH TASK!)
├── INSTRUCTIONS.md              # This file
└── package.json                 # Root workspace config
```

---

## 🛠️ Technology Stack

### Shared (Core)
- **Language**: TypeScript 5.x (strict mode)
- **Validation**: Zod
- **State**: Zustand (factory pattern)
- **Date**: date-fns (works on both platforms)

### Web Platform
- **Framework**: React 19.2 + TypeScript
- **Build**: Vite (rolldown-vite 7.2.5)
- **Router**: TanStack Router 1.139.3
- **Database**: Dexie 4.2.1 (IndexedDB wrapper)
- **UI Library**: Radix UI
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Auth**: Supabase JS SDK
- **PWA**: vite-plugin-pwa

### Native Platform
- **Framework**: React Native 0.83.1
- **Navigation**: React Navigation
- **Database**: OP-SQLite (@op-engineering/op-sqlite)
- **Styling**: NativeWind (Tailwind for RN)
- **Icons**: React Native vector icons
- **Auth**: Supabase React Native SDK

---

## 🔄 Development Workflow

### Before Starting Any Task

1. **Read TODO.md** - Find the current task
2. **Read source files** - Understand what you're copying
3. **Check for issues** - Look for platform dependencies
4. **Ask if unsure** - Better to ask than break things

### While Working

1. **Create directory structure** if needed
2. **Copy and adapt** the code (don't blindly copy)
3. **Remove platform-specific code** from core files
4. **Add comprehensive documentation**
5. **Test mentally** - will this work on both platforms?

### After Completing a Task

1. **Update TODO.md** - Mark task as complete [x]
2. **Update progress counts** - e.g., (1/9) → (2/9)
3. **Test imports** - Make sure nothing breaks
4. **Move to next task**

### Example Task Completion

```markdown
# Before
### 1.1 Type System Migration (0/9)
- [ ] Copy `src/types/account.ts` → `packages/core/src/types/account.ts`

# After
### 1.1 Type System Migration (1/9)
- [x] Copy `src/types/account.ts` → `packages/core/src/types/account.ts`
```

---

## 📝 Code Standards

### File Headers
Every file must start with a header comment:

```typescript
/**
 * @fileoverview Account type definitions and utilities
 * @module @kakeibo/core/types
 * 
 * Defines the Account entity used for tracking user bank accounts,
 * credit cards, cash, and other financial accounts.
 * 
 * Platform: Platform-agnostic (core)
 */
```

### JSDoc Comments
All exported items must have JSDoc:

```typescript
/**
 * Calculates the progress percentage for a budget
 * 
 * @param budget - The budget to calculate progress for
 * @param spent - The amount spent so far
 * @returns Progress percentage (0-100+)
 * 
 * @example
 * ```ts
 * const progress = calculateBudgetProgress(budget, 750);
 * // Returns 75 if budget.amount is 1000
 * ```
 */
export function calculateBudgetProgress(budget: Budget, spent: number): number {
  return (spent / budget.amount) * 100;
}
```

### Imports Order
```typescript
// 1. External dependencies
import { z } from 'zod';
import { format } from 'date-fns';

// 2. Core package imports (when in apps/)
import type { Transaction, Budget } from '@kakeibo/core';

// 3. Internal relative imports
import { cn } from '../utils/cn';
import type { ButtonProps } from './Button.types';
```

### Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Types**: PascalCase (e.g., `Transaction`, `BudgetProgress`)
- **Interfaces**: PascalCase (e.g., `IDatabaseAdapter`)
- **Functions**: camelCase (e.g., `calculateProgress`)
- **Constants**: SCREAMING_SNAKE_CASE or camelCase for objects

---

## 🚧 Platform Separation Rules

### In `packages/core/` - Platform-Agnostic Code

#### ✅ ALLOWED
```typescript
// Pure TypeScript types
export interface Transaction { ... }

// Pure functions
export function calculateTotal(transactions: Transaction[]): number { ... }

// Date manipulation (using date-fns, works everywhere)
export function getFinancialMonthStart(date: Date): Date { ... }

// Zod schemas
export const transactionSchema = z.object({ ... });

// Generic interfaces
export interface IDatabaseAdapter {
  getTransactions(): Promise<Transaction[]>;
}
```

#### ❌ FORBIDDEN
```typescript
// ❌ Browser APIs
localStorage.setItem('key', 'value');
window.location.href = '/page';

// ❌ React Native APIs
import { Platform } from 'react-native';

// ❌ Platform-specific dependencies
import { Session } from '@supabase/supabase-js'; // Web-only!

// ❌ DOM manipulation
document.getElementById('app');

// ❌ Web-only libraries
import { useNavigate } from '@tanstack/react-router'; // Web only!
```

### In `apps/web/` - Web-Specific Code

#### ✅ ALLOWED
```typescript
// Browser APIs
localStorage.setItem('theme', 'dark');

// Web frameworks
import { Link } from '@tanstack/react-router';

// Dexie (IndexedDB)
import Dexie from 'dexie';

// Radix UI
import * as Select from '@radix-ui/react-select';

// Core imports
import type { Transaction } from '@kakeibo/core';
```

#### ❌ FORBIDDEN
```typescript
// ❌ React Native imports
import { View, Text } from 'react-native';

// ❌ Native-specific packages
import { open } from '@op-engineering/op-sqlite';
```

### In `apps/native/` - Native-Specific Code

#### ✅ ALLOWED
```typescript
// React Native APIs
import { View, Text, Pressable } from 'react-native';

// React Navigation
import { useNavigation } from '@react-navigation/native';

// OP-SQLite
import { open } from '@op-engineering/op-sqlite';

// Core imports
import type { Transaction } from '@kakeibo/core';
```

#### ❌ FORBIDDEN
```typescript
// ❌ Browser APIs
localStorage.setItem('key', 'value');

// ❌ Web-only libraries
import { Link } from '@tanstack/react-router';

// ❌ Dexie
import Dexie from 'dexie';
```

---

## 🎯 Common Patterns

### Database Adapter Pattern

**Core defines the interface:**
```typescript
// packages/core/src/services/database/IDatabaseAdapter.ts
export interface IDatabaseAdapter {
  // Transactions
  getTransactions(filters?: TransactionFilters): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  addTransaction(input: CreateTransactionInput): Promise<Transaction>;
  updateTransaction(id: string, input: UpdateTransactionInput): Promise<void>;
  deleteTransaction(id: string): Promise<void>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  // ... more methods
}
```

**Web implements with Dexie:**
```typescript
// apps/web/src/services/db/DexieAdapter.ts
export class DexieAdapter implements IDatabaseAdapter {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    // Use Dexie to query IndexedDB
    return db.transactions.toArray();
  }
}
```

**Native implements with OP-SQLite:**
```typescript
// apps/native/src/services/db/OpSqliteAdapter.ts
export class OpSqliteAdapter implements IDatabaseAdapter {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    // Use OP-SQLite to query SQLite
    const result = this.db.execute('SELECT * FROM transactions');
    return result.rows._array;
  }
}
```

### Store Factory Pattern

**Core creates the store factory:**
```typescript
// packages/core/src/stores/createAppStore.ts
import { create } from 'zustand';

export const createAppStore = (persistMiddleware: any) => {
  return create(
    persistMiddleware(
      (set) => ({
        theme: 'dark',
        setTheme: (theme) => set({ theme }),
      })
    )
  );
};
```

**Web uses with localStorage:**
```typescript
// apps/web/src/stores/index.ts
import { persist } from 'zustand/middleware';
import { createAppStore } from '@kakeibo/core';

export const useAppStore = createAppStore(
  (config) => persist(config, { name: 'app-store' })
);
```

**Native uses with AsyncStorage:**
```typescript
// apps/native/src/stores/index.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppStore } from '@kakeibo/core';

export const useAppStore = createAppStore(
  (config) => persist(config, { 
    storage: AsyncStorage,
    name: 'app-store'
  })
);
```

---

## � Migration Methodology

### How We're Migrating the Codebase

We're following a **systematic, phase-by-phase approach** to ensure nothing is missed and everything is properly separated by platform.

#### Source and Target Locations

```
SOURCE: /home/ashish/projects/kakeibo/
TARGET: /home/ashish/projects/kakeibo-v2/
```

#### The Migration Process

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: READ & ANALYZE                                  │
│ - Read the original file from kakeibo                   │
│ - Understand the code and its purpose                   │
│ - Identify all dependencies and imports                 │
│ - Check for platform-specific code                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: CLASSIFY                                        │
│ Ask: Where does this belong?                            │
│ - Platform-agnostic? → packages/core/                   │
│ - Web-specific? → apps/web/                             │
│ - Native-specific? → apps/native/                       │
│ - Both platforms but different implementations?         │
│   → Create interface in core, implement in platforms    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: TRANSFORM                                       │
│ - Remove platform-specific imports                      │
│ - Replace with platform-agnostic alternatives           │
│ - Add comprehensive documentation                       │
│ - Add @fileoverview and JSDoc comments                  │
│ - Ensure TypeScript strict mode compliance              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: CREATE                                          │
│ - Create necessary directory structure                  │
│ - Write the transformed code                            │
│ - Follow naming conventions                             │
│ - Maintain consistent code style                        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 5: VERIFY                                          │
│ - Mental check: Will this work on both platforms?       │
│ - Are all imports platform-agnostic (if in core)?       │
│ - Is the code properly documented?                      │
│ - Does it follow our architecture principles?           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 6: UPDATE TRACKING                                 │
│ - Mark task as complete [x] in TODO.md                  │
│ - Update progress count (e.g., 0/9 → 1/9)               │
│ - Update "Last Updated" date                            │
│ - Move to next task                                     │
└─────────────────────────────────────────────────────────┘
```

#### Transformation Examples

**Example 1: Removing Platform-Specific Imports**

```typescript
// ❌ ORIGINAL (kakeibo/src/types/auth.ts)
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthState {
  user: AuthUser | null;
  session: Session | null; // ← Platform-specific type!
}

// ✅ TRANSFORMED (kakeibo-v2/packages/core/src/types/auth.ts)
/**
 * Platform-agnostic session representation
 * Platforms can convert from their specific session types to this
 */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
  userId: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null; // ← Platform-agnostic!
}
```

**Example 2: Extracting Business Logic to Core**

```typescript
// ❌ ORIGINAL (kakeibo/src/hooks/useBudgets.ts)
export const useBudgets = () => {
  // Business logic mixed with database calls
  const calculateProgress = (budget: Budget, spent: number) => {
    return (spent / budget.amount) * 100;
  };
  
  const budgets = useLiveQuery(() => db.budgets.toArray());
  return { budgets, calculateProgress };
};

// ✅ TRANSFORMED
// packages/core/src/services/calculations/budgetProgress.ts
/**
 * Calculates budget progress percentage
 * Pure function - no side effects, no database calls
 */
export function calculateBudgetProgress(budget: Budget, spent: number): number {
  if (budget.amount === 0) return 0;
  return (spent / budget.amount) * 100;
}

// apps/web/src/hooks/useBudgets.ts
import { useLiveQuery } from 'dexie-react-hooks';
import { calculateBudgetProgress } from '@kakeibo/core';

export const useBudgets = () => {
  const budgets = useLiveQuery(() => db.budgets.toArray());
  // Use the pure function from core
  return { budgets, calculateBudgetProgress };
};
```

**Example 3: Creating Platform Abstractions**

```typescript
// ✅ CORE - Define the interface
// packages/core/src/services/database/IDatabaseAdapter.ts
export interface IDatabaseAdapter {
  getTransactions(filters?: TransactionFilters): Promise<Transaction[]>;
  addTransaction(input: CreateTransactionInput): Promise<Transaction>;
}

// ✅ WEB - Implement with Dexie
// apps/web/src/services/db/DexieAdapter.ts
export class DexieAdapter implements IDatabaseAdapter {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    let query = db.transactions;
    if (filters?.type) {
      query = query.where('type').equals(filters.type);
    }
    return query.toArray();
  }
}

// ✅ NATIVE - Implement with OP-SQLite
// apps/native/src/services/db/OpSqliteAdapter.ts
export class OpSqliteAdapter implements IDatabaseAdapter {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    let sql = 'SELECT * FROM transactions';
    if (filters?.type) {
      sql += ` WHERE type = '${filters.type}'`;
    }
    const result = this.db.execute(sql);
    return this.mapToTransactions(result.rows._array);
  }
}
```

#### Decision Tree for Code Placement

```
Is this code...
│
├─ UI Component?
│  ├─ Uses Radix UI / DOM? → apps/web/src/components/
│  └─ Uses React Native components? → apps/native/src/components/
│
├─ Database related?
│  ├─ Interface definition? → packages/core/src/services/database/
│  ├─ Uses Dexie? → apps/web/src/services/db/
│  └─ Uses OP-SQLite? → apps/native/src/services/db/
│
├─ Business Logic / Calculations?
│  └─ Pure functions, no platform deps? → packages/core/src/services/
│
├─ Type Definitions?
│  ├─ Platform-specific types (e.g., Session)? → apps/{web|native}/src/types/
│  └─ Shared business types? → packages/core/src/types/
│
├─ Constants / Configuration?
│  ├─ Platform-agnostic? → packages/core/src/constants/
│  └─ Platform-specific? → apps/{web|native}/src/config/
│
├─ React Hooks?
│  ├─ Uses platform DB? → apps/{web|native}/src/hooks/
│  └─ Pure logic, no DB? → packages/core/src/hooks/
│
├─ Navigation / Routing?
│  ├─ TanStack Router? → apps/web/src/router/
│  └─ React Navigation? → apps/native/src/navigation/
│
└─ Validation / Schemas?
   └─ Zod schemas? → packages/core/src/schemas/
```

#### Quality Checks Before Committing

Before marking any task as complete, verify:

```
✓ No platform-specific imports in core code
✓ All exports have JSDoc documentation
✓ File has @fileoverview header comment
✓ Code follows naming conventions
✓ No browser APIs (window, document, localStorage) in core
✓ No React Native APIs (Platform, AsyncStorage) in core
✓ TypeScript types are properly defined
✓ No hardcoded values that should be constants
✓ Code is formatted consistently
✓ TODO.md is updated with [x] and new progress count
```

---

## �🚀 How to Proceed

### Current Status
Check TODO.md for the current phase and task. As of this writing, we are on:
- **Phase 1: Core Foundation**
- **Task 1.1: Type System Migration**

### Step-by-Step Process

#### 1. Read the Current Task
```markdown
- [ ] Copy `src/types/account.ts` → `packages/core/src/types/account.ts`
```

#### 2. Read the Source File
```bash
# Look at what's in the original file
Read: /home/ashish/projects/kakeibo/src/types/account.ts
```

#### 3. Check for Platform Dependencies
Ask yourself:
- Does this import anything platform-specific?
- Does this use browser or React Native APIs?
- Will this work on both web and native?

#### 4. Create the Target File
```typescript
// packages/core/src/types/account.ts

/**
 * @fileoverview Account type definitions and utilities
 * ...
 */

// Copy the clean, platform-agnostic code
export interface Account { ... }
```

#### 5. Update TODO.md
```markdown
- [x] Copy `src/types/account.ts` → `packages/core/src/types/account.ts`
```

Update the progress count at the top of the phase:
```markdown
### 1.1 Type System Migration (1/9)  # Changed from (0/9)
```

#### 6. Move to Next Task
Continue with the next unchecked task in TODO.md.

---

## 🔍 Troubleshooting Guide

### "I found a platform-specific import in core code"
**STOP and ASK the user.** Example:
```
🚨 ISSUE FOUND: 
File: src/types/auth.ts imports '@supabase/supabase-js'
This is web-specific and won't work in React Native.

Proposed solution: Create generic types instead.
Should I proceed?
```

### "The source code uses localStorage"
If copying to core: **Remove it** and create a generic interface.
If copying to web: **Keep it**.
If copying to native: **Replace with AsyncStorage**.

### "I don't understand this code"
**STOP and ASK the user.** Better to clarify than to introduce bugs.

### "Should this go in core or platform-specific?"
Ask:
1. Does it use browser/native APIs? → Platform-specific
2. Is it UI components? → Platform-specific
3. Is it business logic/calculations? → Core
4. Is it types/constants? → Core (unless platform-specific types)

---

## 📚 Additional Resources

### Related Files
- **TODO.md** - Task tracker (update after every task!)
- **.github/copilot-instructions.md** - Original project instructions
- **Original kakeibo**: `/home/ashish/projects/kakeibo`
- **New monorepo**: `/home/ashish/projects/kakeibo-v2`

### Key Principles to Remember
1. **Read before writing**
2. **Platform separation is sacred**
3. **Document everything**
4. **Update TODO.md after every task**
5. **Ask when unsure**

---

## ✅ Checklist Before Any Code Change

- [ ] I have read the source file
- [ ] I understand what the code does
- [ ] I checked for platform-specific dependencies
- [ ] I know where this file should go (core/web/native)
- [ ] I will add proper documentation
- [ ] I will update TODO.md after completing this task
- [ ] If I'm unsure about anything, I will ASK

---

**Remember**: Quality over speed. It's better to ask and get it right than to rush and create problems.

**Last Updated**: December 20, 2025
**Current Phase**: Phase 1 - Core Foundation
**Next Task**: Check TODO.md
